/**
 * ID Photo generation pipeline — pure browser, zero backend.
 *
 * Six-step pipeline:
 * 1. AI background removal (IS-Net via @imgly/background-removal)
 * 2. Alpha-channel analysis to locate subject bounds
 * 3. Smart crop (head-top clearance + face-center alignment)
 * 4. Background color replacement
 * 5. Resize to spec dimensions (@300DPI)
 * 6. Optional 6-inch print layout (8x 1-inch photos)
 */

import { removeBackground } from '@imgly/background-removal'
import { refineMask, decontaminateEdges, smoothAlphaEdges, detectEdgeRoughness } from './maskRefine'
import i18n from '../i18n'

// ---------------------------------------------------------------------------
// Types & constants
// ---------------------------------------------------------------------------

export interface IdPhotoSpec {
  id: string
  name: string
  width: number   // px @300DPI
  height: number  // px @300DPI
}

export interface BgColor {
  id: string
  name: string
  hex: string
}

export interface IdPhotoResult {
  dataUrl: string
  width: number
  height: number
  printLayoutUrl?: string
}

/** Standard Chinese ID photo specs (@300DPI) */
export const ID_PHOTO_SPECS: IdPhotoSpec[] = [
  { id: '1inch',  name: '1寸',   width: 295, height: 413 },
  { id: '2inch',  name: '2寸',   width: 413, height: 579 },
  { id: 'small2', name: '小2寸', width: 413, height: 531 },
]

/** Standard background colors */
export const BG_COLORS: BgColor[] = [
  { id: 'white', name: '白色', hex: '#FFFFFF' },
  { id: 'blue',  name: '蓝色', hex: '#438EDB' },
  { id: 'red',   name: '红色', hex: '#D9001B' },
]

export type IdPhotoPhase = 'idle' | 'cutout' | 'analyze' | 'crop' | 'background' | 'output' | 'done' | 'error'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Load an HTMLImageElement from a URL (data URL or object URL). */
function loadImageEl(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = (e) => reject(new Error('Image load failed: ' + e))
    img.src = url
  })
}

/** Check if WebGPU is available for GPU-accelerated inference. */
function hasWebGPU(): boolean {
  return typeof (navigator as any).gpu !== 'undefined'
}

// ---------------------------------------------------------------------------
// Step 2: Alpha-channel analysis — find foreground bounding box
// ---------------------------------------------------------------------------

export interface ForegroundBounds {
  minX: number
  minY: number
  maxX: number
  maxY: number
  width: number
  height: number
}

/**
 * Scan the alpha channel of a transparent PNG to find the foreground
 * (subject) bounding box.  We also compute a horizontal density profile
 * to help estimate the head region.
 *
 * @param imageData RGBA pixel data
 * @param w width
 * @param h height
 * @param threshold alpha threshold (default 30, ignores nearly-transparent pixels)
 */
function findForegroundBounds(
  imageData: Uint8ClampedArray,
  w: number,
  h: number,
  threshold = 30,
): ForegroundBounds | null {
  let minX = w, minY = h, maxX = 0, maxY = 0
  let found = false

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const alpha = imageData[(y * w + x) * 4 + 3]
      if (alpha > threshold) {
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
        found = true
      }
    }
  }

  if (!found) return null
  return { minX, minY, maxX, maxY, width: maxX - minX + 1, height: maxY - minY + 1 }
}

/**
 * Clean up noise pixels that are far away from the main subject.
 *
 * AI background removal sometimes leaves isolated bright specks
 * in corners of the image (especially on solid-colour backgrounds).
 * This function zeroes out pixels whose alpha is above `minAlpha`
 * but whose Euclidean distance from the subject centre exceeds
 * `maxDistanceFactor × subject diagonal`.
 *
 * Semi-transparent edge pixels near the subject are preserved.
 */
function cleanDistantNoise(
  imageData: Uint8ClampedArray,
  w: number,
  h: number,
  bounds: ForegroundBounds,
  maxDistanceFactor = 1.3,
  minAlpha = 20,
): void {
  const centerX = (bounds.minX + bounds.maxX) / 2
  const centerY = (bounds.minY + bounds.maxY) / 2
  const diag = Math.sqrt(bounds.width * bounds.width + bounds.height * bounds.height)
  const maxDist = Math.max(diag * maxDistanceFactor, Math.max(bounds.width, bounds.height) * 0.55)

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4 + 3
      if (imageData[idx] <= minAlpha) continue
      const dx = x - centerX
      const dy = y - centerY
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist > maxDist) {
        imageData[idx] = 0
      }
    }
  }
}

/**
 * Estimate the head region from foreground bounds.
 *
 * Scans the full foreground to build a horizontal density profile,
 * then finds the shoulder line where the width suddenly increases.
 * If detection fails, falls back to a portrait-proportion estimate.
 *
 * Returns head top Y, head height, and the estimated face center.
 */
function estimateHeadRegion(
  imageData: Uint8ClampedArray,
  w: number,
  bounds: ForegroundBounds,
  threshold = 10,
): { headTop: number; headHeight: number; faceCenterY: number; faceCenterX: number } {
  const { minX, maxX, minY, maxY } = bounds
  const fgWidth = maxX - minX + 1
  const fgHeight = maxY - minY + 1

  // Build horizontal density profile (count of opaque pixels per row)
  const counts: number[] = new Array(fgHeight)
  for (let i = 0; i < fgHeight; i++) {
    const y = minY + i
    let cnt = 0
    for (let x = minX; x <= maxX; x++) {
      if (imageData[(y * w + x) * 4 + 3] > threshold) cnt++
    }
    counts[i] = cnt
  }

  // Sample head width from top 20% of foreground (more stable than 15%)
  const headSampleRows = Math.max(3, Math.floor(fgHeight * 0.20))
  let headAvgWidth = 0
  for (let i = 0; i < headSampleRows; i++) headAvgWidth += counts[i]
  headAvgWidth /= headSampleRows

  // Find shoulder line: first sustained row where width > 1.5x head average
  // and width > 40% of foreground width (ensures it's a real shoulder, not neck)
  let shoulderRow = -1
  const shoulderThreshold = headAvgWidth * 1.5
  const minShoulderWidth = fgWidth * 0.4

  for (let i = headSampleRows; i < fgHeight; i++) {
    if (counts[i] > shoulderThreshold && counts[i] > minShoulderWidth) {
      // Confirm it's a sustained increase, not a transient spike
      if (i + 2 < fgHeight && counts[i + 1] > shoulderThreshold * 0.85) {
        shoulderRow = i
        break
      }
    }
  }

  // Fallback: typical portrait head height is ~50% of foreground height
  const headBottom = shoulderRow > 0
    ? minY + shoulderRow
    : minY + Math.floor(fgHeight * 0.50)

  const headHeight = headBottom - minY

  // Face center at eye level: ~45% of head-to-shoulder height.
  // This is the anchor used to place the face in the final ID photo.
  const faceCenterY = minY + headHeight * 0.45

  // Compute horizontal center-of-mass in the head region for better centering
  // (more robust than simple bounds midpoint when the body is asymmetric)
  let massX = 0, massTotal = 0
  const headEnd = Math.min(minY + headHeight, minY + fgHeight - 1)
  for (let y = minY; y <= headEnd; y++) {
    for (let x = minX; x <= maxX; x++) {
      const a = imageData[(y * w + x) * 4 + 3]
      if (a > threshold) {
        massX += x * a
        massTotal += a
      }
    }
  }
  const faceCenterX = massTotal > 0 ? massX / massTotal : (minX + maxX) / 2

  return { headTop: minY, headHeight, faceCenterY, faceCenterX }
}

// ---------------------------------------------------------------------------
// Step 3: Smart crop region calculation
// ---------------------------------------------------------------------------

export interface CropRegion {
  sx: number  // source x
  sy: number  // source y
  sw: number  // source width
  sh: number  // source height
}

/**
 * Calculate the crop region for an ID photo based on head position.
 *
 * Composition rules (reference ID photo style):
 *   - Head (top of skull to chin) occupies ~58% of photo height
 *   - Eyes (face center) at ~33% of photo height from top
 *   - Top of skull to photo top edge: ~6% of photo height
 *   - Shoulders visible with small bottom margin (~8%)
 *
 * @param bounds  foreground bounding box
 * @param head    head region estimate
 * @param spec    target photo spec
 * @param imgW    source image width
 * @param imgH    source image height
 */
function calculateCropRegion(
  bounds: ForegroundBounds,
  head: { headTop: number; headHeight: number; faceCenterY: number; faceCenterX: number },
  spec: IdPhotoSpec,
  imgW: number,
  imgH: number,
): CropRegion {
  const targetRatio = spec.width / spec.height

  // --- Step 1: Calculate ideal photo height ---
  // Reference style: head-to-chin occupies ~58% of photo height.
  // headHeight = top to shoulder; chin is ~10% below shoulder.
  // So head-to-chin = headHeight * 1.1.
  // photoH = headToChin / 0.58
  const headToChin = head.headHeight * 1.1
  let photoH = headToChin / 0.58

  // Minimal safety net: ensure full body fits only if it's very compact
  // (for ID photos we intentionally crop tight around head-and-shoulders)
  photoH = Math.max(photoH, bounds.height * 1.02)

  // Ensure shoulders are not cut off: from faceCenterY to bottom of photo
  // must be at least (bounds.maxY - faceCenterY) + 8% padding
  const faceToBottom = bounds.maxY - head.faceCenterY
  const minPhotoHFromBottom = faceToBottom / 0.45  // faceCenterY at ~45% from top
  photoH = Math.max(photoH, minPhotoHFromBottom)

  let photoW = photoH * targetRatio

  // Ensure minimum width for shoulder room (very tight side padding)
  const minPhotoW = bounds.width * 1.02
  if (photoW < minPhotoW) {
    const scale = minPhotoW / photoW
    photoW = minPhotoW
    photoH = photoH * scale
  }

  // --- Step 2: Fit within image bounds ---
  // If photoH exceeds image bounds, scale down proportionally
  // (don't truncate — better to have smaller head than cut off body)
  let needsShrink = false
  if (photoH > imgH) {
    const scale = imgH / photoH
    photoH = imgH
    photoW = photoW * scale
    needsShrink = true
  }
  if (photoW > imgW) {
    const scale = imgW / photoW
    photoW = imgW
    photoH = photoH * scale
    needsShrink = true
  }

  // After fitting, re-check minPhotoW (photoH may have been reduced)
  if (photoW < minPhotoW) {
    const scale = minPhotoW / photoW
    photoW = minPhotoW
    photoH = photoH * scale
    // Clamp again
    if (photoH > imgH) {
      const s2 = imgH / photoH
      photoH = imgH
      photoW = photoW * s2
      needsShrink = true
    }
  }

  // --- Step 3: Position vertically ---
  // Reference style: eyes (faceCenterY) at ~33% from photo top
  let sy = head.faceCenterY - photoH * 0.33

  // Don't cut off the head: headTop should be at least 6% from photo top
  const minTop = head.headTop - photoH * 0.06
  if (sy > minTop) {
    sy = minTop
  }

  // Don't cut off shoulders: shoulder should be within photo bottom
  const shoulderY = head.headTop + head.headHeight
  const minBottom = shoulderY + photoH * 0.08  // small bottom margin
  if (sy + photoH < minBottom) {
    // Need more space below shoulders; try to lower sy
    sy = minBottom - photoH
    if (sy < minTop) {
      sy = minTop
    }
  }

  // Clamp to image bounds (don't let crop exceed source image)
  sy = Math.max(0, Math.min(sy, imgH - photoH))

  // If we had to shrink to fit, head may be too small.
  // Try to re-center by pushing photo down a bit to give head more room
  if (needsShrink && sy < minTop) {
    // We were forced to shrink and clamp to 0; try pushing photo down
    // to at least give the head some top clearance
    const idealTop = Math.max(0, head.headTop - photoH * 0.06)
    if (idealTop > 0 && idealTop + photoH <= imgH) {
      sy = idealTop
    }
  }

  // --- Step 4: Position horizontally ---
  let sx = head.faceCenterX - photoW / 2
  sx = Math.max(0, Math.min(sx, imgW - photoW))

  return {
    sx: Math.round(sx),
    sy: Math.round(sy),
    sw: Math.round(photoW),
    sh: Math.round(photoH),
  }
}

// ---------------------------------------------------------------------------
// Step 6: 6-inch print layout (8x 1-inch photos)
// ---------------------------------------------------------------------------

/**
 * Arrange multiple ID photos on a 6-inch print paper (4×6 inches @300DPI = 1200×1800px).
 * Layout: 4 columns × 2 rows = 8 photos for 1-inch.
 */
export function generatePrintLayout(
  photoCanvas: HTMLCanvasElement,
  spec: IdPhotoSpec,
): string {
  const paperW = 1200  // 4 inches @300DPI
  const paperH = 1800  // 6 inches @300DPI

  const paper = document.createElement('canvas')
  paper.width = paperW
  paper.height = paperH
  const ctx = paper.getContext('2d')!

  // White background
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, paperW, paperH)

  // Calculate how many photos fit with small gaps
  const gap = 4  // 4px gap between photos
  const cols = Math.floor((paperW + gap) / (spec.width + gap))
  const rows = Math.floor((paperH + gap) / (spec.height + gap))
  const totalSlots = cols * rows

  // Center the grid
  const gridW = cols * spec.width + (cols - 1) * gap
  const gridH = rows * spec.height + (rows - 1) * gap
  const offsetX = Math.floor((paperW - gridW) / 2)
  const offsetY = Math.floor((paperH - gridH) / 2)

  let count = 0
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (count >= totalSlots) break
      const x = offsetX + col * (spec.width + gap)
      const y = offsetY + row * (spec.height + gap)
      ctx.drawImage(photoCanvas, x, y, spec.width, spec.height)
      count++
    }
  }

  return paper.toDataURL('image/png')
}

// ---------------------------------------------------------------------------
// Main pipeline
// ---------------------------------------------------------------------------

/**
 * Generate an ID photo from a source canvas.
 *
 * @param sourceCanvas  the current editor canvas (with image + filters baked)
 * @param spec          target photo spec (1-inch, 2-inch, etc.)
 * @param bgColor       background color
 * @param options       pipeline options
 * @param onProgress    progress callback
 * @returns result with data URL and dimensions
 */
export async function generateIdPhoto(
  sourceCanvas: HTMLCanvasElement,
  spec: IdPhotoSpec,
  bgColor: BgColor,
  options?: {
    printLayout?: boolean
  },
  onProgress?: (phase: IdPhotoPhase, progress: number, message: string) => void,
): Promise<IdPhotoResult> {
  const cb = onProgress ?? (() => {})
  const wantPrint = options?.printLayout ?? false

  // --- Step 1: AI background removal ---
  cb('cutout', 5, i18n.t('idphoto.aiCutoutProgress'))

  // Export source as blob for AI processing
  const dataUrl = sourceCanvas.toDataURL('image/png')
  const resp = await fetch(dataUrl)
  const blob = await resp.blob()

  // Run AI background removal with GPU acceleration if available
  const useGpu = hasWebGPU()
  const resultBlob = await removeBackground(blob, {
    device: useGpu ? ('gpu' as const) : ('cpu' as const),
    output: { format: 'image/png' },
    progress: (key: string, current: number, total: number) => {
      const pct = total > 0 ? Math.round((current / total) * 100) : 0
      if (key.startsWith('fetch') || key.startsWith('download')) {
        cb('cutout', 5 + Math.round(pct * 0.3), i18n.t('cutout.downloadingModel', { pct }))
      } else if (key.startsWith('compute') || key.startsWith('inference')) {
        cb('cutout', 35 + Math.round(pct * 0.3), i18n.t('cutout.aiInferring', { pct }))
      }
    },
  })

  cb('cutout', 65, i18n.t('idphoto.cutoutDone'))

  // Load the transparent PNG result
  const resultUrl = URL.createObjectURL(resultBlob)
  const cutoutImg = await loadImageEl(resultUrl)
  URL.revokeObjectURL(resultUrl)

  // Draw to a canvas at original resolution
  let w = cutoutImg.naturalWidth
  let h = cutoutImg.naturalHeight

  let cutoutCanvas = document.createElement('canvas')
  cutoutCanvas.width = w
  cutoutCanvas.height = h
  let cutoutCtx = cutoutCanvas.getContext('2d', { willReadFrequently: true })!
  cutoutCtx.drawImage(cutoutImg, 0, 0)

  // --- Step 1b: Edge refinement ---
  cb('cutout', 70, i18n.t('idphoto.edgeRefining'))
  const imageData = cutoutCtx.getImageData(0, 0, w, h)
  const rgba = imageData.data

  // Extract alpha channel as mask
  const mask = new Uint8Array(w * h)
  let rawFgCount = 0
  for (let i = 0; i < w * h; i++) {
    mask[i] = rgba[i * 4 + 3]
    if (mask[i] > 10) rawFgCount++
  }

  if (rawFgCount === 0) {
    throw new Error(i18n.t('idphoto.noForeground'))
  }

  // Refine mask: morphological cleanup + feather + sharpen.
  // For low-contrast images (where person's edges blend with background),
  // use gentler params to avoid eating into semi-transparent body parts.
  // closeRadius: 2 — fill edge holes
  // openRadius: 1 — light spec removal (was 2, reduced for low-contrast images)
  // contrast: 1.1 — light edge sharpening (was 1.3, reduced to preserve thin edges)
  // islandThreshold: 30 — low threshold ensures semi-transparent body parts remain connected
  const refined = refineMask(mask, w, h, {
    closeRadius: 2,
    openRadius: 1,
    blurRadius: 1.5,
    contrast: 1.1,
    minIslandSize: 20,
    islandThreshold: 30,
  })

  // Safety net: if refineMask emptied the mask, fall back to original alpha
  let refinedFgCount = 0
  for (let i = 0; i < w * h; i++) {
    if (refined[i] > 10) refinedFgCount++
  }

  // If refinement removed more than 30% of foreground, the image likely has
  // low-contrast edges. Fall back to raw AI output to avoid creating holes.
  if (refinedFgCount < rawFgCount * 0.70 && rawFgCount > 100) {
    // Redo with ultra-gentle params: only blur + very light contrast
    const gentle = refineMask(mask, w, h, {
      closeRadius: 0,
      openRadius: 0,
      blurRadius: 1,
      contrast: 1.05,
      minIslandSize: 0,
    })
    let gentleFgCount = 0
    for (let i = 0; i < w * h; i++) {
      if (gentle[i] > 10) gentleFgCount++
    }
    const finalMask = gentleFgCount > rawFgCount * 0.70 ? gentle : mask
    // Use gentle or raw mask
    for (let i = 0; i < w * h; i++) {
      rgba[i * 4 + 3] = finalMask[i]
    }
  } else {
    const finalMask = refinedFgCount > 0 ? refined : mask
    // Apply final mask: replace alpha, keep original RGB
    for (let i = 0; i < w * h; i++) {
      rgba[i * 4 + 3] = finalMask[i]
    }
  }
  cutoutCtx.putImageData(imageData, 0, 0)

  // --- Step 1b-ii: Detect edge roughness ---
  // Casual clothing produces rougher AI cutout edges than formal wear.
  // We detect this and apply wider feathering + colour decontamination.
  const edgeMask = new Uint8Array(w * h)
  for (let i = 0; i < w * h; i++) edgeMask[i] = rgba[i * 4 + 3]
  const roughness = detectEdgeRoughness(edgeMask, w, h)
  const isRoughEdges = roughness > 0.35
  cb('cutout', 72, isRoughEdges ? i18n.t('idphoto.roughEdgeSoften') : i18n.t('idphoto.edgeRefineDone'))

  // --- Step 1b-iii: Edge smoothing for rough edges ---
  if (isRoughEdges) {
    // Re-read the current state (after refineMask was applied)
    const currentData = cutoutCtx.getImageData(0, 0, w, h)
    const currentMask = new Uint8Array(w * h)
    for (let i = 0; i < w * h; i++) currentMask[i] = currentData.data[i * 4 + 3]

    // Apply wider edge feathering — blends jagged alpha transitions
    const smoothed = smoothAlphaEdges(currentMask, w, h, 3)
    for (let i = 0; i < w * h; i++) {
      currentData.data[i * 4 + 3] = smoothed[i]
    }

    // Color decontamination: remove original background colour from
    // semi-transparent edge pixels BEFORE we place on the new solid bg.
    // This prevents the old background colour from bleeding through.
    decontaminateEdges(currentData.data, w, h, 8, 10, 230)

    cutoutCtx.putImageData(currentData, 0, 0)
    cb('cutout', 74, i18n.t('idphoto.roughEdgeDone'))
  } else {
    // Clean edges (formal wear): lighter decontamination only
    const currentData = cutoutCtx.getImageData(0, 0, w, h)
    decontaminateEdges(currentData.data, w, h, 4, 10, 240)
    cutoutCtx.putImageData(currentData, 0, 0)
  }

  // --- Step 1c: Add padding if subject is too close to edges ---
  // Selfie / portrait photos often have the subject too close to the edges.
  // Add symmetric padding so the crop algorithm has room to center properly.
  const paddingCheckData = cutoutCtx.getImageData(0, 0, w, h).data
  const paddingBounds = findForegroundBounds(paddingCheckData, w, h, 10)
  if (paddingBounds) {
    const topSpace = paddingBounds.minY
    const bottomSpace = h - paddingBounds.maxY
    const leftSpace = paddingBounds.minX
    const rightSpace = w - paddingBounds.maxX

    const neededTop = Math.round(h * 0.15)     // at least 15% of image height
    const neededBottom = Math.round(h * 0.08)   // at least 8% of image height
    const neededLeft = Math.round(w * 0.08)     // at least 8% of image width
    const neededRight = Math.round(w * 0.08)    // at least 8% of image width

    const addTop = Math.max(0, neededTop - topSpace)
    const addBottom = Math.max(0, neededBottom - bottomSpace)
    const addLeft = Math.max(0, neededLeft - leftSpace)
    const addRight = Math.max(0, neededRight - rightSpace)

    if (addTop > 0 || addBottom > 0 || addLeft > 0 || addRight > 0) {
      const paddedW = w + addLeft + addRight
      const paddedH = h + addTop + addBottom
      const paddedCanvas = document.createElement('canvas')
      paddedCanvas.width = paddedW
      paddedCanvas.height = paddedH
      const paddedCtx = paddedCanvas.getContext('2d', { willReadFrequently: true })!
      paddedCtx.clearRect(0, 0, paddedW, paddedH)
      paddedCtx.drawImage(cutoutCanvas, addLeft, addTop)

      // Update references for subsequent steps
      w = paddedW
      h = paddedH
      cutoutCanvas = paddedCanvas
      cutoutCtx = paddedCtx
    }
  }

  // --- Step 2: Alpha-channel analysis ---
  cb('analyze', 75, i18n.t('idphoto.analyzingFace'))
  const finalData = cutoutCtx.getImageData(0, 0, w, h).data
  let bounds = findForegroundBounds(finalData, w, h, 10)

  if (!bounds) {
    throw new Error(i18n.t('idphoto.noFace'))
  }

  // Clean isolated noise specks far from the subject (e.g. bright spots in corners)
  cleanDistantNoise(finalData, w, h, bounds, 1.0)  // tighter noise removal for ID photos
  // Re-compute bounds after noise cleanup (pixels may have been zeroed)
  const cleanedBounds = findForegroundBounds(finalData, w, h, 10)
  if (cleanedBounds) bounds = cleanedBounds

  // Re-clean with updated bounds to catch any remaining edge noise
  cleanDistantNoise(finalData, w, h, bounds, 0.9)
  const cleanedBounds2 = findForegroundBounds(finalData, w, h, 10)
  if (cleanedBounds2) bounds = cleanedBounds2

  const head = estimateHeadRegion(finalData, w, bounds, 10)

  // --- Step 3: Smart crop ---
  cb('crop', 80, i18n.t('idphoto.cropping'))
  const crop = calculateCropRegion(bounds, head, spec, w, h)

  // --- Step 4: Background replacement + crop in one pass ---
  cb('background', 85, i18n.t('idphoto.replacingBg'))

  // Create output canvas at crop resolution
  const croppedCanvas = document.createElement('canvas')
  croppedCanvas.width = crop.sw
  croppedCanvas.height = crop.sh
  const croppedCtx = croppedCanvas.getContext('2d')!

  // Fill background color
  croppedCtx.fillStyle = bgColor.hex
  croppedCtx.fillRect(0, 0, crop.sw, crop.sh)

  // Draw the cutout (transparent foreground) on top — background shows
  // through semi-transparent edge pixels, creating a natural blend.
  croppedCtx.drawImage(cutoutCanvas, crop.sx, crop.sy, crop.sw, crop.sh, 0, 0, crop.sw, crop.sh)

  // --- Step 5: Resize to spec ---
  cb('output', 90, i18n.t('idphoto.generatingSpec'))
  const photoCanvas = document.createElement('canvas')
  photoCanvas.width = spec.width
  photoCanvas.height = spec.height
  const photoCtx = photoCanvas.getContext('2d')!

  // High-quality resize
  photoCtx.imageSmoothingEnabled = true
  photoCtx.imageSmoothingQuality = 'high'
  photoCtx.drawImage(croppedCanvas, 0, 0, spec.width, spec.height)

  const photoDataUrl = photoCanvas.toDataURL('image/png')

  // --- Step 6: Optional print layout ---
  let printLayoutUrl: string | undefined
  if (wantPrint) {
    cb('output', 95, i18n.t('idphoto.generatingLayout'))
    printLayoutUrl = generatePrintLayout(photoCanvas, spec)
  }

  cb('done', 100, i18n.t('idphoto.done'))
  return {
    dataUrl: photoDataUrl,
    width: spec.width,
    height: spec.height,
    printLayoutUrl,
  }
}
