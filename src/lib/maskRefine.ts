/**
 * MaskRefine — Pure-Canvas alpha mask post-processing for cutout quality.
 *
 * After AI background removal or Flood Fill, the resulting alpha mask often has
 * jagged edges, isolated noise pixels, and harsh transitions. This module
 * provides morphological operations + gaussian feathering to produce smooth,
 * professional-grade edges — especially important for portrait cutouts where
 * hair strands require semi-transparent alpha values.
 *
 * All functions operate on a flat Uint8Array (one byte per pixel, 0–255).
 */

// ─────────────────────────────────────────────
//  Morphological Operations
// ─────────────────────────────────────────────

/**
 * Dilate — each pixel becomes the MAX of its neighborhood.
 * Expands white regions, fills small holes.
 */
export function dilate(
  mask: Uint8Array,
  width: number,
  height: number,
  radius: number,
): Uint8Array {
  if (radius <= 0) return mask.slice()
  const out = new Uint8Array(mask.length)
  const r2 = radius * radius

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let maxVal = 0
      const yStart = Math.max(0, y - radius)
      const yEnd = Math.min(height - 1, y + radius)
      const xStart = Math.max(0, x - radius)
      const xEnd = Math.min(width - 1, x + radius)

      for (let dy = yStart; dy <= yEnd; dy++) {
        for (let dx = xStart; dx <= xEnd; dx++) {
          const ddx = dx - x
          const ddy = dy - y
          if (ddx * ddx + ddy * ddy > r2) continue
          const v = mask[dy * width + dx]
          if (v > maxVal) maxVal = v
        }
      }
      out[y * width + x] = maxVal
    }
  }
  return out
}

/**
 * Erode — each pixel becomes the MIN of its neighborhood.
 * Shrinks white regions, removes thin protrusions and noise.
 */
export function erode(
  mask: Uint8Array,
  width: number,
  height: number,
  radius: number,
): Uint8Array {
  if (radius <= 0) return mask.slice()
  const out = new Uint8Array(mask.length)
  const r2 = radius * radius

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let minVal = 255
      const yStart = Math.max(0, y - radius)
      const yEnd = Math.min(height - 1, y + radius)
      const xStart = Math.max(0, x - radius)
      const xEnd = Math.min(width - 1, x + radius)

      for (let dy = yStart; dy <= yEnd; dy++) {
        for (let dx = xStart; dx <= xEnd; dx++) {
          const ddx = dx - x
          const ddy = dy - y
          if (ddx * ddx + ddy * ddy > r2) continue
          const v = mask[dy * width + dx]
          if (v < minVal) minVal = v
        }
      }
      out[y * width + x] = minVal
    }
  }
  return out
}

/**
 * Morphological opening = erode then dilate.
 * Removes small foreground noise without changing large region boundaries.
 */
export function morphOpen(
  mask: Uint8Array,
  width: number,
  height: number,
  radius: number,
): Uint8Array {
  const eroded = erode(mask, width, height, radius)
  return dilate(eroded, width, height, radius)
}

/**
 * Morphological closing = dilate then erode.
 * Fills small holes in foreground without changing boundaries.
 */
export function morphClose(
  mask: Uint8Array,
  width: number,
  height: number,
  radius: number,
): Uint8Array {
  const dilated = dilate(mask, width, height, radius)
  return erode(dilated, width, height, radius)
}

// ─────────────────────────────────────────────
//  Gaussian Blur (separable, for performance)
// ─────────────────────────────────────────────

/**
 * 1D Gaussian kernel generator.
 */
function gaussianKernel(radius: number, sigma: number): Float32Array {
  const size = radius * 2 + 1
  const kernel = new Float32Array(size)
  const s2 = 2 * sigma * sigma
  let sum = 0
  for (let i = 0; i < size; i++) {
    const x = i - radius
    kernel[i] = Math.exp(-(x * x) / s2)
    sum += kernel[i]
  }
  for (let i = 0; i < size; i++) kernel[i] /= sum
  return kernel
}

/**
 * Separable Gaussian blur on a Uint8 mask.
 * Horizontal pass then vertical pass — O(n*r) instead of O(n*r²).
 */
export function gaussianBlur(
  mask: Uint8Array,
  width: number,
  height: number,
  radius: number,
  sigma?: number,
): Uint8Array {
  if (radius <= 0) return mask.slice()
  const s = sigma ?? radius * 0.5
  const kernel = gaussianKernel(radius, s)

  // Horizontal pass
  const temp = new Float32Array(mask.length)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let acc = 0
      for (let k = -radius; k <= radius; k++) {
        const sx = Math.min(width - 1, Math.max(0, x + k))
        acc += mask[y * width + sx] * kernel[k + radius]
      }
      temp[y * width + x] = acc
    }
  }

  // Vertical pass
  const out = new Uint8Array(mask.length)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let acc = 0
      for (let k = -radius; k <= radius; k++) {
        const sy = Math.min(height - 1, Math.max(0, y + k))
        acc += temp[sy * width + x] * kernel[k + radius]
      }
      out[y * width + x] = Math.round(acc)
    }
  }
  return out
}

// ─────────────────────────────────────────────
//  Alpha Contrast Adjustment
// ─────────────────────────────────────────────

/**
 * Adjust alpha contrast: pushes mid-values toward 0 or 255 while
 * preserving existing 0s and 255s. This sharpens soft edges without
 * destroying semi-transparent hair regions.
 *
 * contrast > 1 → sharper edges
 * contrast < 1 → softer edges
 */
export function adjustContrast(
  mask: Uint8Array,
  contrast: number,
  pivot: number = 128,
): Uint8Array {
  const out = new Uint8Array(mask.length)
  for (let i = 0; i < mask.length; i++) {
    const v = mask[i]
    // Don't touch pure background (0) — preserves clean transparency
    if (v === 0) {
      out[i] = 0
      continue
    }
    const adjusted = pivot + (v - pivot) * contrast
    out[i] = Math.max(0, Math.min(255, Math.round(adjusted)))
  }
  return out
}

// ─────────────────────────────────────────────
//  Connected Component — remove small islands
// ─────────────────────────────────────────────

/**
 * Remove small isolated foreground islands (noise) from a mask.
 * Uses flood-fill labeling. Any component smaller than minSize is zeroed.
 *
 * Unlike a naive binary approach, this preserves the original alpha values
 * of surviving components — semi-transparent pixels (hair, feathers) keep
 * their original alpha instead of being clamped to 255.
 *
 * @param threshold  pixels with alpha > threshold are considered foreground (default 128)
 */
export function removeSmallIslands(
  mask: Uint8Array,
  width: number,
  height: number,
  minSize: number,
  threshold: number = 128,
): Uint8Array {
  const total = width * height
  const labels = new Int32Array(total).fill(-1)
  // Preserve original alpha — don't binarize
  const out = mask.slice()

  const dirs = [-width, 1, width, -1]
  let nextLabel = 0
  const componentSizes: number[] = []
  const componentPixels: number[][] = []

  for (let start = 0; start < total; start++) {
    if (labels[start] !== -1) continue
    if (out[start] <= threshold) {
      labels[start] = -2 // background, labeled
      continue
    }

    // BFS this component
    const label = nextLabel++
    const pixels: number[] = []
    const queue: number[] = [start]
    labels[start] = label
    let head = 0

    while (head < queue.length) {
      const idx = queue[head++]
      pixels.push(idx)
      const x = idx % width
      for (const delta of dirs) {
        const ni = idx + delta
        if (ni < 0 || ni >= total) continue
        if (labels[ni] !== -1) continue
        // row boundary for left/right
        if (Math.abs(delta) === 1) {
          const nx = ni % width
          if (Math.abs(nx - x) > 1) continue
        }
        if (out[ni] > threshold) {
          labels[ni] = label
          queue.push(ni)
        } else {
          labels[ni] = -2
        }
      }
    }

    componentSizes.push(pixels.length)
    componentPixels.push(pixels)
  }

  // Zero out small components
  for (let l = 0; l < componentPixels.length; l++) {
    if (componentSizes[l] < minSize) {
      for (const idx of componentPixels[l]) {
        out[idx] = 0
      }
    }
  }

  return out
}

// ─────────────────────────────────────────────
//  Main: refineMask
// ─────────────────────────────────────────────

/**
 * Full edge refinement pipeline for portrait cutout quality.
 *
 * Steps:
 * 1. Morphological close — fill small holes in foreground (hair gaps)
 * 2. Morphological open — remove small foreground noise specks
 * 3. Remove small islands — drop isolated pixel clusters
 * 4. Gaussian blur — feather edges for smooth alpha transition
 * 5. Contrast boost — sharpen feathered edges back, preserving hair
 *
 * @param mask     Input alpha mask (Uint8Array, one byte per pixel)
 * @param width    Mask width
 * @param height   Mask height
 * @param options  Fine-tuning parameters
 * @returns Refined alpha mask
 */
export function refineMask(
  mask: Uint8Array,
  width: number,
  height: number,
  options?: {
    closeRadius?: number    // default 1 — fill tiny holes
    openRadius?: number     // default 1 — remove tiny specks
    blurRadius?: number     // default 2 — edge feathering
    contrast?: number       // default 1.8 — edge sharpening
    minIslandSize?: number  // default 30 — remove islands smaller than this
    islandThreshold?: number // default 128 — alpha threshold for connectivity
  },
): Uint8Array {
  const closeR = options?.closeRadius ?? 1
  const openR = options?.openRadius ?? 1
  const blurR = options?.blurRadius ?? 2
  const contrast = options?.contrast ?? 1.8
  const minIsland = options?.minIslandSize ?? Math.max(20, Math.floor((width * height) / 5000))
  const islandTh = options?.islandThreshold ?? 128

  let m = mask

  // Step 1: Close — fill small holes
  if (closeR > 0) {
    m = morphClose(m, width, height, closeR)
  }

  // Step 2: Open — remove small specks
  if (openR > 0) {
    m = morphOpen(m, width, height, openR)
  }

  // Step 3: Remove small islands (skip if minIsland <= 0)
  if (minIsland > 0) {
    m = removeSmallIslands(m, width, height, minIsland, islandTh)
  }

  // Step 4: Gaussian blur — feather
  if (blurR > 0) {
    m = gaussianBlur(m, width, height, blurR)
  }

  // Step 5: Contrast boost — sharpen
  if (contrast !== 1) {
    m = adjustContrast(m, contrast)
  }

  return m
}

/**
 * Extract alpha channel from an RGBA ImageData as a standalone Uint8Array.
 */
export function extractAlpha(rgba: Uint8ClampedArray): Uint8Array {
  const total = rgba.length / 4
  const alpha = new Uint8Array(total)
  for (let i = 0; i < total; i++) {
    alpha[i] = rgba[i * 4 + 3]
  }
  return alpha
}

// ─────────────────────────────────────────────
//  Color Decontamination — removes background spill from edge pixels
// ─────────────────────────────────────────────

/**
 * Decontaminate edge pixels: replace the RGB of semi-transparent pixels
 * with colors sampled from nearby fully-opaque foreground pixels.
 *
 * After AI background removal, semi-transparent edge pixels still carry
 * the original background color in their RGB channels. When placed on a
 * new solid-colour background (e.g. red/white/blue for ID photos), this
 * creates visible colour fringing — especially noticeable on casual
 * clothing with soft, irregular edges.
 *
 * This function searches outward from each semi-transparent pixel to find
 * the nearest opaque foreground and replaces RGB with that colour.
 *
 * @param rgba      RGBA pixel data (modified in-place)
 * @param width     Image width
 * @param height    Image height
 * @param searchRadius  Max search distance in pixels (default 8)
 * @param alphaLow  Pixels with alpha below this are ignored (pure bg)
 * @param alphaHigh Pixels with alpha above this are already opaque enough
 */
export function decontaminateEdges(
  rgba: Uint8ClampedArray,
  width: number,
  height: number,
  searchRadius: number = 8,
  alphaLow: number = 15,
  alphaHigh: number = 230,
): void {
  const total = width * height
  // Pre-compute opaque pixel positions for fast nearest-neighbor lookup
  // using a distance transform approach: for each pixel, store the offset
  // to the nearest opaque foreground pixel.

  // For performance on large images, use a two-pass distance transform.
  // We only need to fix semi-transparent pixels, but we still need to
  // find the nearest opaque pixel for each of them.

  // Simplified approach: spiral search per candidate pixel, but with
  // early termination using pre-computed nearest-opaque cache.

  // Build a boolean mask of opaque pixels (alpha >= alphaHigh)
  const opaqueMask = new Uint8Array(total)
  for (let i = 0; i < total; i++) {
    opaqueMask[i] = rgba[i * 4 + 3] >= alphaHigh ? 1 : 0
  }

  // Distance-transform: for each pixel, find nearest opaque pixel
  // (Manhattan distance is sufficient for colour sampling)
  const nearestDist = new Int32Array(total).fill(1 << 24)
  const nearestIdx = new Int32Array(total).fill(-1)

  // Forward pass (top-left to bottom-right)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x
      if (opaqueMask[i]) {
        nearestDist[i] = 0
        nearestIdx[i] = i
        continue
      }
      // Check left neighbor
      if (x > 0) {
        const ni = i - 1
        if (nearestDist[ni] + 1 < nearestDist[i]) {
          nearestDist[i] = nearestDist[ni] + 1
          nearestIdx[i] = nearestIdx[ni]
        }
      }
      // Check top neighbor
      if (y > 0) {
        const ni = i - width
        if (nearestDist[ni] + 1 < nearestDist[i]) {
          nearestDist[i] = nearestDist[ni] + 1
          nearestIdx[i] = nearestIdx[ni]
        }
      }
    }
  }

  // Backward pass (bottom-right to top-left)
  for (let y = height - 1; y >= 0; y--) {
    for (let x = width - 1; x >= 0; x--) {
      const i = y * width + x
      // Check right neighbor
      if (x < width - 1) {
        const ni = i + 1
        if (nearestDist[ni] + 1 < nearestDist[i]) {
          nearestDist[i] = nearestDist[ni] + 1
          nearestIdx[i] = nearestIdx[ni]
        }
      }
      // Check bottom neighbor
      if (y < height - 1) {
        const ni = i + width
        if (nearestDist[ni] + 1 < nearestDist[i]) {
          nearestDist[i] = nearestDist[ni] + 1
          nearestIdx[i] = nearestIdx[ni]
        }
      }
    }
  }

  // Apply decontamination to semi-transparent pixels within search radius
  let fixedCount = 0
  for (let i = 0; i < total; i++) {
    const a = rgba[i * 4 + 3]
    if (a <= alphaLow || a >= alphaHigh) continue // fully transparent or opaque
    if (nearestDist[i] > searchRadius) continue   // too far from foreground

    const srcIdx = nearestIdx[i]
    if (srcIdx < 0) continue

    // Blend: closer to foreground = more decontamination
    const blendFactor = Math.min(1, 1 - nearestDist[i] / searchRadius)
    const srcR = rgba[srcIdx * 4]
    const srcG = rgba[srcIdx * 4 + 1]
    const srcB = rgba[srcIdx * 4 + 2]

    rgba[i * 4]     = Math.round(rgba[i * 4]     * (1 - blendFactor) + srcR * blendFactor)
    rgba[i * 4 + 1] = Math.round(rgba[i * 4 + 1] * (1 - blendFactor) + srcG * blendFactor)
    rgba[i * 4 + 2] = Math.round(rgba[i * 4 + 2] * (1 - blendFactor) + srcB * blendFactor)
    fixedCount++
  }

  // If we found hardly any edge pixels, the image might have very clean
  // cutout edges (formal wear) — that's fine, nothing to do.
  if (fixedCount > 0) {
    console.log(`[decontaminateEdges] fixed ${fixedCount} edge pixels`)
  }
}

// ─────────────────────────────────────────────
//  Edge Smoothing — wider feather for rough edges
// ─────────────────────────────────────────────

/**
 * Detect edge roughness by measuring the average alpha gradient magnitude.
 * High roughness indicates casual clothing with irregular edges that need
 * more aggressive feathering. Low roughness means clean formal-wear edges.
 *
 * @returns roughness score (0–1), higher = rougher edges
 */
export function detectEdgeRoughness(
  mask: Uint8Array,
  width: number,
  height: number,
): number {
  let totalGradient = 0
  let edgePixelCount = 0

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const i = y * width + x
      const a = mask[i]
      // Only consider edge pixels (alpha between 20 and 235)
      if (a <= 20 || a >= 235) continue

      // Sobel-like gradient magnitude
      const gx = Math.abs(mask[i - 1] - mask[i + 1])
      const gy = Math.abs(mask[i - width] - mask[i + width])
      const mag = gx + gy
      totalGradient += mag
      edgePixelCount++
    }
  }

  if (edgePixelCount === 0) return 0
  // Normalize: average gradient / max possible gradient (~510)
  const avgGradient = totalGradient / edgePixelCount
  return Math.min(1, avgGradient / 200)
}

/**
 * Smooth the alpha mask at edges by applying a wider Gaussian blur
 * specifically to the edge transition zone, then blending back.
 *
 * This preserves fine details in fully opaque/transparent regions
 * while creating a smoother gradient at the boundary — critical for
 * casual clothing where AI cutout produces rough, jagged edges.
 *
 * @param mask       Alpha mask
 * @param width      Image width
 * @param height     Image height
 * @param blurRadius Wider blur radius for edge zones (default 3)
 */
export function smoothAlphaEdges(
  mask: Uint8Array,
  width: number,
  height: number,
  blurRadius: number = 3,
): Uint8Array {
  if (blurRadius <= 0) return mask.slice()

  // Blur the entire mask with wider radius
  const blurred = gaussianBlur(mask, width, height, blurRadius, blurRadius * 0.6)

  // Create edge-zone weight map: 1.0 in edge transition, 0 in solid regions
  const weight = new Float32Array(mask.length)
  for (let i = 0; i < mask.length; i++) {
    const a = mask[i]
    if (a <= 5 || a >= 250) {
      weight[i] = 0 // solid region: keep original
    } else {
      // Edge transition zone: weight based on proximity to mid-alpha
      // Peak at alpha=128, fading to 0 at alpha=5 and alpha=250
      const distFromMid = Math.abs(a - 128) / 123
      weight[i] = Math.max(0, 1 - distFromMid)
    }
  }

  // Blend: keep original in solid regions, use blurred in edge zones
  const out = new Uint8Array(mask.length)
  for (let i = 0; i < mask.length; i++) {
    const w = weight[i]
    out[i] = Math.round(mask[i] * (1 - w) + blurred[i] * w)
  }

  return out
}

/**
 * Apply a refined alpha mask back to RGBA image data.
 * Preserves original RGB, replaces only the alpha channel.
 */
export function applyAlpha(
  rgba: Uint8ClampedArray,
  alpha: Uint8Array,
): void {
  const total = alpha.length
  for (let i = 0; i < total; i++) {
    rgba[i * 4 + 3] = alpha[i]
  }
}
