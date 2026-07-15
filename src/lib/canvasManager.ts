import * as fabric from 'fabric'
import { clamp } from './utils'
import { cropOverlay } from './cropOverlay'
import { brushMask } from './brushMask'
import { removeBackground } from '@imgly/background-removal'
import {
  refineMask,
  applyAlpha,
} from './maskRefine'
import { upscaleImage as runUpscale, type UpscaleProgressFn } from './upscaler'
import i18n from '../i18n'

type HistoryCallback = (canUndo: boolean, canRedo: boolean) => void
type ImageCallback = (hasImage: boolean) => void

/** Load an HTMLImageElement from a URL (blob or data URL). */
function loadImageElement(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = (e) => reject(new Error('Image load failed: ' + e))
    img.src = url
  })
}

/**
 * Extract a grayscale mask from RGBA pixel data.
 * AI mask PNGs may store the mask in the alpha channel OR as grayscale RGB.
 * This function auto-detects: if alpha varies, use alpha; otherwise use red channel.
 */
function extractMaskChannel(rgba: Uint8ClampedArray, width: number, height: number): Uint8Array {
  const total = width * height
  // Check if alpha channel has variation
  let alphaVaries = false
  const firstAlpha = rgba[3]
  for (let i = 0; i < total; i++) {
    if (rgba[i * 4 + 3] !== firstAlpha) {
      alphaVaries = true
      break
    }
  }

  const mask = new Uint8Array(total)
  if (alphaVaries) {
    for (let i = 0; i < total; i++) mask[i] = rgba[i * 4 + 3]
  } else {
    // Grayscale PNG — use red channel (R=G=B in grayscale)
    for (let i = 0; i < total; i++) mask[i] = rgba[i * 4]
  }
  return mask
}

/** Preset filter definitions using Fabric.js ColorMatrix */
interface PresetFilter {
  name: string
  label: string
  filters: fabric.filters.BaseFilter<string, Record<string, unknown>>[]
}

/**
 * CanvasManager — wraps Fabric.js v6 Canvas with history (undo/redo),
 * image loading, filters, crop, and export. Singleton shared across components.
 */
export class CanvasManager {
  private canvas: fabric.Canvas | null = null
  private history: string[] = []
  private historyIndex = -1
  private isRestoring = false
  private maxHistory = 50

  // Crop mode — delegated to independent CropOverlay engine
  private isCropMode = false

  // Brush mode — delegated to independent BrushMask engine
  private isBrushMode = false

  // Store initial/default canvas dimensions for reset after crop
  private defaultWidth = 0
  private defaultHeight = 0

  onHistoryChange?: HistoryCallback
  onImageChange?: ImageCallback

  /** Initialize the Fabric canvas on a <canvas> element. */
  init(element: HTMLCanvasElement, width: number, height: number) {
    // Clean up any existing instance first (handles React StrictMode double-mount)
    if (this.canvas) {
      try {
        this.canvas.dispose()
      } catch {
        /* ignore dispose errors during re-init */
      }
      this.canvas = null
    }

    // If the element was previously wrapped by Fabric (.canvas-container),
    // unwrap it to restore the original DOM structure before re-initializing.
    const parent = element.parentElement
    if (parent?.classList?.contains('canvas-container')) {
      parent.parentNode?.insertBefore(element, parent)
      parent.remove()
    }

    this.defaultWidth = width
    this.defaultHeight = height

    this.canvas = new fabric.Canvas(element, {
      width,
      height,
      backgroundColor: 'transparent',
      preserveObjectStacking: true,
      selection: true,
      controlsAboveOverlay: true,
    })

    // Track modifications for history
    this.canvas.on('object:modified', () => {
      if (!this.isRestoring) this.saveHistory()
    })
    this.canvas.on('object:added', () => {
      if (!this.isRestoring) this.saveHistory()
    })
    this.canvas.on('object:removed', () => {
      if (!this.isRestoring) this.saveHistory()
    })

    this.saveHistory()
  }

  /** Tear down the canvas and reset state. */
  dispose() {
    this.canvas?.dispose()
    this.canvas = null
    this.history = []
    this.historyIndex = -1
    this.isRestoring = false
  }

  /** Serialize current canvas state into the history stack. */
  private saveHistory() {
    if (!this.canvas) return

    // Drop any "future" states after current index
    this.history = this.history.slice(0, this.historyIndex + 1)

    const json = JSON.stringify(this.canvas.toJSON())
    this.history.push(json)

    // Enforce max history size
    if (this.history.length > this.maxHistory) {
      this.history.shift()
    } else {
      this.historyIndex++
    }

    this.notifyHistory()
  }

  private notifyHistory() {
    this.onHistoryChange?.(
      this.historyIndex > 0,
      this.historyIndex < this.history.length - 1,
    )
  }

  /** Step backwards in history. */
  async undo() {
    if (this.historyIndex <= 0 || !this.canvas) return
    this.historyIndex--
    await this.restoreFromHistory()
  }

  /** Step forwards in history. */
  async redo() {
    if (this.historyIndex >= this.history.length - 1 || !this.canvas) return
    this.historyIndex++
    await this.restoreFromHistory()
  }

  /** Load a specific history state into the canvas. */
  private async restoreFromHistory() {
    if (!this.canvas) return
    this.isRestoring = true
    const json = this.history[this.historyIndex]
    await this.canvas.loadFromJSON(JSON.parse(json))
    this.canvas.renderAll()
    this.isRestoring = false
    this.notifyHistory()
  }

  /** Load an image from a URL onto the canvas, scaled to fit. */
  async loadImage(url: string) {
    if (!this.canvas) {
      console.error('[CanvasManager] loadImage: canvas not initialized')
      return
    }

    // Exit crop mode if active
    if (this.isCropMode) {
      this.exitCropMode()
    }

    // Restore default canvas dimensions (in case crop resized it)
    if (this.defaultWidth > 0 && this.defaultHeight > 0) {
      this.canvas.setWidth(this.defaultWidth)
      this.canvas.setHeight(this.defaultHeight)
    }

    this.isRestoring = true
    try {
      this.canvas.clear()
      this.canvas.backgroundColor = 'transparent'

      const img = await fabric.FabricImage.fromURL(url, { crossOrigin: 'anonymous' })

      if (!img || !img.width || !img.height) {
        console.error('[CanvasManager] loadImage: image loaded but has no dimensions')
        this.isRestoring = false
        return
      }

      const cw = this.canvas.getWidth()
      const ch = this.canvas.getHeight()
      const scale = clamp(
        Math.min(cw / img.width, ch / img.height, 1),
        0.01,
        1,
      )

      img.scale(scale)
      img.set({
        left: (cw - img.width * scale) / 2,
        top: (ch - img.height * scale) / 2,
      })

      this.canvas.add(img)
      this.canvas.setActiveObject(img)
      this.canvas.renderAll()

      this.saveHistory()
      this.onImageChange?.(true)
    } catch (err) {
      console.error('[CanvasManager] loadImage failed:', err)
    } finally {
      this.isRestoring = false
    }
  }

  /** Remove all objects and reset the canvas to default size. */
  clearAll() {
    if (!this.canvas) return

    // Exit crop mode if active
    if (this.isCropMode) {
      this.exitCropMode()
    }

    this.isRestoring = true
    this.canvas.clear()
    this.canvas.backgroundColor = 'transparent'

    // Restore default canvas dimensions
    if (this.defaultWidth > 0 && this.defaultHeight > 0) {
      this.canvas.setWidth(this.defaultWidth)
      this.canvas.setHeight(this.defaultHeight)
    }

    this.canvas.renderAll()
    this.isRestoring = false

    this.history = []
    this.historyIndex = -1
    this.saveHistory()
    this.onImageChange?.(false)
  }

  // ───────── Filters ─────────

  /** Get the first FabricImage on the canvas (for filter operations). */
  private getActiveImage(): fabric.FabricImage | null {
    if (!this.canvas) return null
    const objects = this.canvas.getObjects()
    for (const obj of objects) {
      if (obj instanceof fabric.FabricImage) return obj
    }
    return null
  }

  /**
   * Apply brightness, contrast, and saturation adjustments to the active image.
   * Values: -1 to 1. Zero = no change.
   */
  applyAdjustments(brightness: number, contrast: number, saturation: number) {
    const img = this.getActiveImage()
    if (!img) return

    const filters: fabric.filters.BaseFilter<string, Record<string, unknown>>[] = []

    if (brightness !== 0) {
      filters.push(new fabric.filters.Brightness({ brightness: brightness * 0.5 }))
    }
    if (contrast !== 0) {
      filters.push(new fabric.filters.Contrast({ contrast: contrast * 0.5 }))
    }
    if (saturation !== 0) {
      filters.push(new fabric.filters.Saturation({ saturation: saturation * 0.5 }))
    }

    // Preserve non-adjustment filters (e.g. preset filters)
    img.filters = [
      ...(img.filters ?? []).filter(
        (f) => !(f instanceof fabric.filters.Brightness) &&
                !(f instanceof fabric.filters.Contrast) &&
                !(f instanceof fabric.filters.Saturation),
      ),
      ...filters,
    ]

    img.applyFilters()
    this.canvas?.renderAll()
  }

  /** Reset all filters on the active image. */
  resetFilters() {
    const img = this.getActiveImage()
    if (!img) return
    img.filters = []
    img.applyFilters()
    this.canvas?.renderAll()
    this.saveHistory()
  }

  // ───────── Preset Filters ─────────

  /** Available preset filter definitions. */
  static readonly presets: PresetFilter[] = [
    {
      name: 'grayscale',
      label: '黑白',
      filters: [new fabric.filters.Grayscale()],
    },
    {
      name: 'sepia',
      label: '复古',
      filters: [new fabric.filters.ColorMatrix({
        matrix: [0.393, 0.769, 0.189, 0, 0, 0.349, 0.686, 0.168, 0, 0, 0.272, 0.534, 0.131, 0, 0, 0, 0, 0, 1, 0],
      })],
    },
    {
      name: 'warm',
      label: '暖色',
      filters: [new fabric.filters.ColorMatrix({
        matrix: [1.3, 0, 0, 0, -0.1, 0, 1.2, 0, 0, -0.05, 0, 0, 1, 0, 0.05, 0, 0, 0, 1, 0],
      })],
    },
    {
      name: 'cool',
      label: '冷色',
      filters: [new fabric.filters.ColorMatrix({
        matrix: [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1.3, 0, -0.08, 0, 0, 0, 1, 0],
      })],
    },
    {
      name: 'vivid',
      label: '鲜艳',
      filters: [
        new fabric.filters.Contrast({ contrast: 0.2 }),
        new fabric.filters.Saturation({ saturation: 0.3 }),
      ],
    },
    {
      name: 'fade',
      label: '褪色',
      filters: [
        new fabric.filters.Contrast({ contrast: -0.2 }),
        new fabric.filters.Brightness({ brightness: 0.1 }),
        new fabric.filters.Saturation({ saturation: -0.3 }),
      ],
    },
    {
      name: 'sharpen',
      label: '锐化',
      filters: [new fabric.filters.Convolute({
        matrix: [0, -1, 0, -1, 5, -1, 0, -1, 0],
      })],
    },
    {
      name: 'blur',
      label: '模糊',
      filters: [new fabric.filters.Blur({ blur: 0.25 })],
    },
    {
      name: 'invert',
      label: '反转',
      filters: [new fabric.filters.Invert()],
    },
  ]

  /** Apply a preset filter (replaces any existing preset, retains adjustments). */
  applyPreset(preset: PresetFilter) {
    const img = this.getActiveImage()
    if (!img) return

    // Keep adjustment filters, replace preset filters
    const adjFilters = (img.filters ?? []).filter(
      (f) =>
        f instanceof fabric.filters.Brightness ||
        f instanceof fabric.filters.Contrast ||
        f instanceof fabric.filters.Saturation,
    )
    img.filters = [...preset.filters, ...adjFilters]
    img.applyFilters()
    this.canvas?.renderAll()
    this.saveHistory()
  }

  /** Remove only preset filters (keep adjustments). */
  clearPresets() {
    const img = this.getActiveImage()
    if (!img) return
    img.filters = (img.filters ?? []).filter(
      (f) =>
        f instanceof fabric.filters.Brightness ||
        f instanceof fabric.filters.Contrast ||
        f instanceof fabric.filters.Saturation,
    )
    img.applyFilters()
    this.canvas?.renderAll()
    this.saveHistory()
  }

  // ───────── Crop Mode ─────────
  //
  // Crop UI is handled by an independent overlay canvas (cropOverlay.ts).
  // Fabric.js objects are NOT touched during crop — no z-order issues,
  // no event interception, no splice bugs.

  /** Enter crop mode: mount the crop overlay on top of the Fabric canvas. */
  enterCropMode(ratio: string = 'free') {
    const c = this.canvas
    if (!c || this.isCropMode) return

    // Exit brush mode if active
    if (this.isBrushMode) this.exitBrushMode()

    // Deselect any active Fabric object so selection handles don't show through
    c.discardActiveObject()
    c.renderAll()

    const canvasEl = c.getElement()
    cropOverlay.enter(canvasEl, c.getWidth(), c.getHeight(), ratio)
    this.isCropMode = true
  }

  /** Exit crop mode without applying. */
  exitCropMode() {
    if (!this.isCropMode) return
    cropOverlay.exit()
    this.isCropMode = false
  }

  /** Apply crop: extract the region defined by the overlay, resize canvas, re-import at 1:1. */
  async applyCrop() {
    const c = this.canvas
    if (!c || !this.isCropMode) return

    const geo = cropOverlay.getGeometry()
    if (!geo) {
      this.exitCropMode()
      return
    }

    // Exit overlay first so it doesn't appear in export
    cropOverlay.exit()
    this.isCropMode = false

    const w = Math.round(geo.w)
    const h = Math.round(geo.h)
    if (w < 10 || h < 10) return

    // Deselect active object for clean export
    c.discardActiveObject()
    c.renderAll()

    // Extract crop region BEFORE resizing canvas
    let dataUrl: string

    if (Math.abs(geo.angle) < 0.5) {
      // ── Non-rotated: direct region export ──
      const x = Math.round(geo.cx - geo.w / 2)
      const y = Math.round(geo.cy - geo.h / 2)
      dataUrl = c.toDataURL({
        format: 'png',
        left: x,
        top: y,
        width: w,
        height: h,
        multiplier: 1,
      } as any)
    } else {
      // ── Rotated: extract via offscreen canvas ──
      const fullCanvas = c.toCanvasElement(1) as HTMLCanvasElement
      const offscreen = document.createElement('canvas')
      offscreen.width = w
      offscreen.height = h
      const ctx = offscreen.getContext('2d')!
      const rad = (geo.angle * Math.PI) / 180

      // Translate to offscreen center, reverse-rotate, draw full canvas offset
      ctx.translate(w / 2, h / 2)
      ctx.rotate(-rad)
      ctx.drawImage(fullCanvas, -geo.cx, -geo.cy)

      dataUrl = offscreen.toDataURL('image/png')
    }

    // Resize canvas to match cropped dimensions (so export matches content)
    c.setWidth(w)
    c.setHeight(h)

    await this._loadCroppedImage(dataUrl)
  }

  /** Helper: clear canvas and load the cropped image at 1:1 (canvas already resized to match). */
  private async _loadCroppedImage(dataUrl: string) {
    const c = this.canvas!
    this.isRestoring = true
    try {
      c.clear()
      c.backgroundColor = 'transparent'

      const img = await fabric.FabricImage.fromURL(dataUrl)
      if (!img || !img.width || !img.height) {
        console.error('[CanvasManager] _loadCroppedImage: invalid image')
        return
      }

      // Place at origin with 1:1 scale — canvas has been resized to match crop dimensions
      img.scale(1)
      img.set({ left: 0, top: 0 })

      c.add(img)
      c.setActiveObject(img)
      c.renderAll()

      this.saveHistory()
      this.onImageChange?.(true)
    } catch (err) {
      console.error('[CanvasManager] _loadCroppedImage failed:', err)
    } finally {
      this.isRestoring = false
    }
  }

  /** Whether crop mode is active. */
  getIsCropMode(): boolean {
    return this.isCropMode
  }

  // ───────── Brush Cutout (GrabCut) ─────────

  /** Enter brush painting mode for interactive cutout. */
  enterBrushMode() {
    const c = this.canvas
    if (!c || this.isBrushMode) return false

    // Exit crop mode if active
    if (this.isCropMode) this.exitCropMode()

    try {
      this.isBrushMode = true
      c.discardActiveObject()
      c.selection = false
      c.renderAll()

      // Disable Fabric.js upper-canvas pointer events so our overlay gets all input
      const upper = (c as any).upperCanvasEl as HTMLCanvasElement | undefined
      if (upper) {
        upper.style.pointerEvents = 'none'
        console.log('[CanvasManager] Disabled upper-canvas pointer events')
      }

      const canvasEl = c.getElement()
      if (!canvasEl) {
        console.error('[CanvasManager] getElement() returned null')
        this.isBrushMode = false
        return false
      }

      const ok = brushMask.enter(canvasEl, c.getWidth(), c.getHeight())
      if (!ok) {
        console.error('[CanvasManager] brushMask.enter failed')
        this.isBrushMode = false
        if (upper) upper.style.pointerEvents = ''
        return false
      }

      console.log('[CanvasManager] Brush mode entered successfully')
      return true
    } catch (err) {
      console.error('[CanvasManager] enterBrushMode error:', err)
      this.isBrushMode = false
      const upper = (c as any).upperCanvasEl as HTMLCanvasElement | undefined
      if (upper) upper.style.pointerEvents = ''
      return false
    }
  }

  /** Exit brush mode without applying. */
  exitBrushMode() {
    if (!this.isBrushMode) return
    brushMask.exit()

    const c = this.canvas
    if (c) {
      // Restore upper-canvas pointer events
      const upper = (c as any).upperCanvasEl as HTMLCanvasElement | undefined
      if (upper) upper.style.pointerEvents = ''
      c.selection = true
      c.renderAll()
    }
    this.isBrushMode = false
  }

  /** Whether brush mode is active. */
  getIsBrushMode(): boolean {
    return this.isBrushMode
  }

  /**
   * Apply brush cutout — AI-assisted mode with Flood Fill fallback.
   *
   * Primary path: AI model (IS-Net) generates initial mask, user's green/red
   * strokes refine it, then edge refinement produces smooth portrait edges.
   * Fallback path: Flood Fill color segmentation (no model download needed).
   *
   * @param onProgress callback for progress updates
   * @returns true on success, false on failure
   */
  async brushCutout(
    onProgress: (phase: 'download' | 'inference', progress: number, message: string) => void,
  ): Promise<boolean> {
    const c = this.canvas
    if (!c || !brushMask.isActive()) return false

    const fgCanvas = brushMask.getFgCanvas()
    const bgCanvas = brushMask.getBgCanvas()
    if (!fgCanvas || !bgCanvas) return false

    if (!brushMask.hasFgPaint()) {
      console.error('[CanvasManager] brushCutout: no foreground paint')
      return false
    }

    try {
      // Export current canvas image (filters baked in)
      onProgress('inference', 0, i18n.t('cutout.preparingImage'))
      const active = c.getActiveObject()
      if (active) c.discardActiveObject()
      c.renderAll()

      const imgCanvas = c.toCanvasElement(1) as HTMLCanvasElement

      // Try AI-assisted cutout first (much better for portraits/hair)
      try {
        return await this._aiBrushCutout(imgCanvas, fgCanvas, bgCanvas, onProgress)
      } catch (aiErr) {
        console.warn('[CanvasManager] AI brush cutout failed, falling back to Flood Fill:', aiErr)
        onProgress('inference', 0, i18n.t('cutout.fallbackAlgorithm'))
        return await this._floodFillCutout(imgCanvas, fgCanvas, bgCanvas, onProgress)
      }
    } catch (err) {
      console.error('[CanvasManager] brushCutout failed:', err)
      return false
    }
  }

  /**
   * AI-assisted brush cutout: AI mask + user stroke refinement + edge feathering.
   * Produces professional portrait quality — handles hair, fur, and complex edges.
   */
  private async _aiBrushCutout(
    imgCanvas: HTMLCanvasElement,
    fgCanvas: HTMLCanvasElement,
    bgCanvas: HTMLCanvasElement,
    onProgress: (phase: 'download' | 'inference', progress: number, message: string) => void,
  ): Promise<boolean> {
    const w = imgCanvas.width
    const h = imgCanvas.height
    const origCtx = imgCanvas.getContext('2d', { willReadFrequently: true })!
    const origImageData = origCtx.getImageData(0, 0, w, h)

    // 1. Run AI background removal → get mask
    onProgress('download', 0, i18n.t('toolbar.aiPreparing'))
    const hasWebGPU = typeof navigator !== 'undefined' && 'gpu' in navigator

    const dataUrl = imgCanvas.toDataURL('image/png')
    const resp = await fetch(dataUrl)
    const blob = await resp.blob()

    const maskBlob = await removeBackground(blob, {
      device: hasWebGPU ? ('gpu' as const) : ('cpu' as const),
      output: { format: 'image/png' },
      progress: (key: string, current: number, total: number) => {
        const pct = total > 0 ? Math.round((current / total) * 100) : 0
        if (key.startsWith('fetch') || key.startsWith('download')) {
          onProgress('download', pct, i18n.t('cutout.downloadingModel', { pct: pct }))
        } else if (key.startsWith('compute') || key.startsWith('inference')) {
          onProgress('inference', pct, i18n.t('cutout.aiInferring', { pct: pct }))
        }
      },
    })

    // 2. Parse mask at original resolution
    onProgress('inference', 80, i18n.t('cutout.parsingMask'))
    const maskUrl = URL.createObjectURL(maskBlob)
    const maskImg = await loadImageElement(maskUrl)
    URL.revokeObjectURL(maskUrl)

    const maskProc = document.createElement('canvas')
    maskProc.width = w
    maskProc.height = h
    const maskProcCtx = maskProc.getContext('2d', { willReadFrequently: true })!
    maskProcCtx.drawImage(maskImg, 0, 0, w, h)
    const maskData = maskProcCtx.getImageData(0, 0, w, h).data

    const aiMask = extractMaskChannel(maskData, w, h)

    // 3. Apply user stroke corrections (green=keep, red=remove)
    onProgress('inference', 88, i18n.t('cutout.applyingBrushFix'))
    const fgCtx = fgCanvas.getContext('2d', { willReadFrequently: true })!
    const fgData = fgCtx.getImageData(0, 0, w, h).data
    const bgCtx = bgCanvas.getContext('2d', { willReadFrequently: true })!
    const bgData = bgCtx.getImageData(0, 0, w, h).data

    for (let i = 0; i < w * h; i++) {
      if (fgData[i * 4 + 3] > 10) aiMask[i] = 255  // green → force keep
      if (bgData[i * 4 + 3] > 10) aiMask[i] = 0    // red → force remove
    }

    // 4. Edge refinement — morphological cleanup + gaussian feather + contrast
    onProgress('inference', 92, i18n.t('cutout.refiningEdge'))
    const refined = refineMask(aiMask, w, h, {
      closeRadius: 1,
      openRadius: 1,
      blurRadius: 2,
      contrast: 1.6,
    })

    // 5. Apply mask to original image (preserve RGB, replace alpha)
    onProgress('inference', 96, i18n.t('cutout.generatingResult'))
    applyAlpha(origImageData.data, refined)
    origCtx.putImageData(origImageData, 0, 0)

    const resultUrl = imgCanvas.toDataURL('image/png')

    // 6. Exit brush mode and load result
    this.exitBrushMode()
    await this.loadImage(resultUrl)

    onProgress('inference', 100, i18n.t('cutout.done'))
    return true
  }

  /**
   * Fallback: Flood Fill color segmentation (no AI model needed).
   * Used when AI model is unavailable or fails to load.
   */
  private async _floodFillCutout(
    imgCanvas: HTMLCanvasElement,
    fgCanvas: HTMLCanvasElement,
    bgCanvas: HTMLCanvasElement,
    onProgress: (phase: 'download' | 'inference', progress: number, message: string) => void,
  ): Promise<boolean> {
    try {
      const w = imgCanvas.width
      const h = imgCanvas.height

      // Resize for performance (max 512px on longest side)
      const maxSize = 512
      const scale = Math.min(1, maxSize / Math.max(w, h))
      const sw = Math.max(4, Math.round(w * scale))
      const sh = Math.max(4, Math.round(h * scale))

      // 3. Get image data at processing resolution
      onProgress('inference', 10, i18n.t('brush.analyzingBrush'))
      const procCanvas = document.createElement('canvas')
      procCanvas.width = sw
      procCanvas.height = sh
      const procCtx = procCanvas.getContext('2d', { willReadFrequently: true })!
      procCtx.drawImage(imgCanvas, 0, 0, sw, sh)
      const imgData = procCtx.getImageData(0, 0, sw, sh)
      const px = imgData.data  // RGBA Uint8ClampedArray

      // 4. Get brush masks at processing resolution
      const fgSmall = document.createElement('canvas')
      fgSmall.width = sw
      fgSmall.height = sh
      fgSmall.getContext('2d')!.drawImage(fgCanvas, 0, 0, sw, sh)
      const fgData = fgSmall.getContext('2d', { willReadFrequently: true })!.getImageData(0, 0, sw, sh).data

      const bgSmall = document.createElement('canvas')
      bgSmall.width = sw
      bgSmall.height = sh
      bgSmall.getContext('2d')!.drawImage(bgCanvas, 0, 0, sw, sh)
      const bgData = bgSmall.getContext('2d', { willReadFrequently: true })!.getImageData(0, 0, sw, sh).data

      // 5. Build seed masks + opacity map
      //    mask values: 0 = unknown, 1 = definite FG, 2 = definite BG
      const totalPixels = sw * sh
      const seedMask = new Uint8Array(totalPixels)
      const isOpaque = new Uint8Array(totalPixels)  // 1 if pixel alpha > 128
      const fgSeeds: number[] = []  // pixel indices for flood fill start
      const bgSeeds: number[] = []

      for (let i = 0; i < totalPixels; i++) {
        const fi = i * 4
        // Track opaque pixels — flood fill must NOT expand into transparent areas
        if (px[fi + 3] > 128) isOpaque[i] = 1

        if (fgData[fi + 3] > 10 && isOpaque[i]) {
          seedMask[i] = 1
          fgSeeds.push(i)
        }
        if (bgData[fi + 3] > 10 && isOpaque[i]) {
          seedMask[i] = 2
          bgSeeds.push(i)
        }
      }

      if (fgSeeds.length === 0) {
        console.error('[CanvasManager] No foreground seeds on opaque pixels')
        return false
      }

      // 5b. Auto-generate background seeds from image edges if user didn't paint red
      if (bgSeeds.length === 0) {
        onProgress('inference', 15, i18n.t('brush.detectingBg'))
        const step = Math.max(1, Math.floor(Math.min(sw, sh) / 40))
        for (let x = 0; x < sw; x += step) {
          const top = x
          const bottom = (sh - 1) * sw + x
          if (isOpaque[top] && seedMask[top] === 0) { seedMask[top] = 2; bgSeeds.push(top) }
          if (isOpaque[bottom] && seedMask[bottom] === 0) { seedMask[bottom] = 2; bgSeeds.push(bottom) }
        }
        for (let y = 0; y < sh; y += step) {
          const left = y * sw
          const right = y * sw + sw - 1
          if (isOpaque[left] && seedMask[left] === 0) { seedMask[left] = 2; bgSeeds.push(left) }
          if (isOpaque[right] && seedMask[right] === 0) { seedMask[right] = 2; bgSeeds.push(right) }
        }
      }

      // 6. Calculate color models for foreground and background
      onProgress('inference', 20, i18n.t('brush.calcColor'))
      let avgR = 0, avgG = 0, avgB = 0
      for (const idx of fgSeeds) {
        const fi = idx * 4
        avgR += px[fi]
        avgG += px[fi + 1]
        avgB += px[fi + 2]
      }
      avgR /= fgSeeds.length
      avgG /= fgSeeds.length
      avgB /= fgSeeds.length

      // Foreground color variance
      let variance = 0
      for (const idx of fgSeeds) {
        const fi = idx * 4
        const dr = px[fi] - avgR
        const dg = px[fi + 1] - avgG
        const db = px[fi + 2] - avgB
        variance += dr * dr + dg * dg + db * db
      }
      variance = Math.sqrt(variance / fgSeeds.length)

      // Background color model (from red strokes or auto edge samples)
      let avgBgR = 0, avgBgG = 0, avgBgB = 0
      let bgVariance = 0
      if (bgSeeds.length > 0) {
        for (const idx of bgSeeds) {
          const fi = idx * 4
          avgBgR += px[fi]
          avgBgG += px[fi + 1]
          avgBgB += px[fi + 2]
        }
        avgBgR /= bgSeeds.length
        avgBgG /= bgSeeds.length
        avgBgB /= bgSeeds.length

        for (const idx of bgSeeds) {
          const fi = idx * 4
          const dr = px[fi] - avgBgR
          const dg = px[fi + 1] - avgBgG
          const db = px[fi + 2] - avgBgB
          bgVariance += dr * dr + dg * dg + db * db
        }
        bgVariance = Math.sqrt(bgVariance / bgSeeds.length)
      }

      // Tighter adaptive tolerance — clamped to [25, 55] to prevent over-expansion
      const fgTol = variance * 2 + 15
      const bgTol = bgSeeds.length > 0 ? bgVariance * 1.5 + 10 : 0
      const tolerance = clamp(Math.round(Math.max(fgTol, bgTol)), 25, 55)
      const tolSq = tolerance * tolerance

      // 7. Flood Fill from foreground seeds
      //    KEY FIXES:
      //    a) Only expand through opaque pixels (prevents black squares on transparent areas)
      //    b) Tight tolerance [25,55] + compare fg distance vs bg distance
      //    c) Use distance to fg average (not to current pixel) to prevent gradient creep
      onProgress('inference', 30, i18n.t('brush.expandSelection'))
      const result = new Uint8Array(totalPixels)  // 0 = background, 255 = foreground
      const visited = new Uint8Array(totalPixels)
      const queue: number[] = [...fgSeeds]

      // Mark seeds as visited and result
      for (const idx of fgSeeds) {
        visited[idx] = 1
        result[idx] = 255
      }

      // Mark background seeds as visited (barrier — don't expand through them)
      for (const idx of bgSeeds) {
        visited[idx] = 1
        result[idx] = 0
      }

      // BFS Flood Fill
      let head = 0
      const dirs = [-sw, 1, sw, -1]  // up, right, down, left

      while (head < queue.length) {
        // Update progress periodically
        if (head % 50000 === 0) {
          const pct = 30 + Math.round((head / queue.length) * 50)
          onProgress('inference', Math.min(pct, 80), i18n.t('brush.expandSelection'))
          if (head % 200000 === 0) {
            await new Promise(r => setTimeout(r, 0))
          }
        }

        const curIdx = queue[head++]

        for (const delta of dirs) {
          const nextIdx = curIdx + delta
          if (nextIdx < 0 || nextIdx >= totalPixels) continue
          if (visited[nextIdx]) continue

          // ★ KEY FIX: skip transparent pixels — prevents black squares
          if (!isOpaque[nextIdx]) continue

          // Row boundary check for left/right wrapping
          const curRow = Math.floor(curIdx / sw)
          const nextRow = Math.floor(nextIdx / sw)
          if (curRow !== nextRow && Math.abs(delta) === 1) continue

          visited[nextIdx] = 1

          const nfi = nextIdx * 4

          // Distance to foreground average color (NOT to current pixel — prevents gradient creep)
          const drFg = px[nfi] - avgR
          const dgFg = px[nfi + 1] - avgG
          const dbFg = px[nfi + 2] - avgB
          const distFgSq = drFg * drFg + dgFg * dgFg + dbFg * dbFg

          // Must be within tight foreground tolerance
          if (distFgSq >= tolSq) continue

          // If we have background model, pixel must be closer to fg than bg
          if (bgSeeds.length > 0) {
            const drBg = px[nfi] - avgBgR
            const dgBg = px[nfi + 1] - avgBgG
            const dbBg = px[nfi + 2] - avgBgB
            const distBgSq = drBg * drBg + dgBg * dgBg + dbBg * dbBg
            if (distBgSq <= distFgSq) continue  // closer to background → don't expand
          }

          result[nextIdx] = 255
          queue.push(nextIdx)
        }
      }

      // 8. Background flood fill — remove foreground pixels closer to bg color
      onProgress('inference', 82, i18n.t('brush.optimizeMask'))
      if (bgSeeds.length > 0) {
        const bgVisited = new Uint8Array(totalPixels)
        const bgQueue: number[] = [...bgSeeds]
        for (const idx of bgSeeds) {
          bgVisited[idx] = 1
          result[idx] = 0
        }

        let bgHead = 0
        while (bgHead < bgQueue.length) {
          const curIdx = bgQueue[bgHead++]
          for (const delta of dirs) {
            const nextIdx = curIdx + delta
            if (nextIdx < 0 || nextIdx >= totalPixels) continue
            if (bgVisited[nextIdx]) continue
            if (!isOpaque[nextIdx]) continue  // skip transparent

            const curRow = Math.floor(curIdx / sw)
            const nextRow = Math.floor(nextIdx / sw)
            if (curRow !== nextRow && Math.abs(delta) === 1) continue

            bgVisited[nextIdx] = 1
            if (result[nextIdx] === 255) {
              // If pixel is closer to background than foreground, remove it
              const nfi = nextIdx * 4
              const drBg = px[nfi] - avgBgR
              const dgBg = px[nfi + 1] - avgBgG
              const dbBg = px[nfi + 2] - avgBgB
              const distBgSq = drBg * drBg + dgBg * dgBg + dbBg * dbBg

              const drFg = px[nfi] - avgR
              const dgFg = px[nfi + 1] - avgG
              const dbFg = px[nfi + 2] - avgB
              const distFgSq = drFg * drFg + dgFg * dgFg + dbFg * dbFg

              if (distBgSq < distFgSq) {
                result[nextIdx] = 0
                bgQueue.push(nextIdx)
              }
            }
          }
        }
      }

      // 9. Edge feathering — smooth alpha at boundaries
      onProgress('inference', 90, i18n.t('brush.featherEdge'))
      const feathered = new Uint8ClampedArray(totalPixels)
      const featherRadius = 2
      for (let y = 0; y < sh; y++) {
        for (let x = 0; x < sw; x++) {
          const idx = y * sw + x
          if (result[idx] === 255) {
            // Check if this is an edge pixel
            let isEdge = false
            for (let dy = -featherRadius; dy <= featherRadius && !isEdge; dy++) {
              for (let dx = -featherRadius; dx <= featherRadius && !isEdge; dx++) {
                const ny = y + dy
                const nx = x + dx
                if (ny < 0 || ny >= sh || nx < 0 || nx >= sw) continue
                if (result[ny * sw + nx] === 0) isEdge = true
              }
            }
            feathered[idx] = isEdge ? 128 : 255
          } else {
            feathered[idx] = 0
          }
        }
      }

      // 10. Upscale mask to original resolution
      onProgress('inference', 95, i18n.t('cutout.generatingResult'))
      const maskCanvas = document.createElement('canvas')
      maskCanvas.width = sw
      maskCanvas.height = sh
      const maskCtx = maskCanvas.getContext('2d')!
      const maskImageData = maskCtx.createImageData(sw, sh)
      for (let i = 0; i < totalPixels; i++) {
        maskImageData.data[i * 4] = feathered[i]
        maskImageData.data[i * 4 + 1] = feathered[i]
        maskImageData.data[i * 4 + 2] = feathered[i]
        maskImageData.data[i * 4 + 3] = 255
      }
      maskCtx.putImageData(maskImageData, 0, 0)

      // Upscale mask to full resolution
      const fullMaskCanvas = document.createElement('canvas')
      fullMaskCanvas.width = w
      fullMaskCanvas.height = h
      const fullMaskCtx = fullMaskCanvas.getContext('2d')!
      fullMaskCtx.imageSmoothingEnabled = true
      fullMaskCtx.imageSmoothingQuality = 'high'
      fullMaskCtx.drawImage(maskCanvas, 0, 0, w, h)
      const fullMaskData = fullMaskCtx.getImageData(0, 0, w, h).data

      // 11. Apply mask to original image → transparent PNG
      //     KEY FIX: respect original alpha — transparent areas stay transparent
      //     (prevents black squares where canvas background was transparent)
      const outputCanvas = document.createElement('canvas')
      outputCanvas.width = w
      outputCanvas.height = h
      const outputCtx = outputCanvas.getContext('2d')!
      const outputImageData = outputCtx.createImageData(w, h)
      const origCtx = imgCanvas.getContext('2d')!
      const origData = origCtx.getImageData(0, 0, w, h).data

      for (let i = 0; i < w * h; i++) {
        const fi = i * 4
        outputImageData.data[fi] = origData[fi]
        outputImageData.data[fi + 1] = origData[fi + 1]
        outputImageData.data[fi + 2] = origData[fi + 2]
        // Take min of original alpha and mask alpha:
        // - Original transparent → result transparent (no black squares)
        // - Original opaque + mask=fg → result opaque
        // - Original opaque + mask=bg → result transparent
        // - Original opaque + mask=edge → result semi-transparent (feathered)
        outputImageData.data[fi + 3] = Math.min(origData[fi + 3], fullMaskData[fi])
      }
      outputCtx.putImageData(outputImageData, 0, 0)

      const dataUrl = outputCanvas.toDataURL('image/png')

      // Exit brush mode and load result
      this.exitBrushMode()
      await this.loadImage(dataUrl)

      onProgress('inference', 100, i18n.t('cutout.done'))
      return true
    } catch (err) {
      console.error('[CanvasManager] _floodFillCutout failed:', err)
      return false
    }
  }

  // ───────── AI Background Removal ─────────

  /**
   * Remove image background using @imgly/background-removal (IS-Net ONNX in-browser).
   *
   * Enhanced pipeline:
   * 1. AI model outputs a grayscale MASK (not foreground) for maximum control
   * 2. GPU (WebGPU) acceleration when available
   * 3. Edge refinement: morphological cleanup + gaussian feather + contrast sharpen
   *
   * @param onProgress callback for progress updates (phase, 0-100, message)
   * @returns true on success, false on failure
   */
  async removeBackground(
    onProgress: (phase: 'download' | 'inference', progress: number, message: string) => void,
  ): Promise<boolean> {
    const c = this.canvas
    if (!c) return false

    // Exit crop mode if active
    if (this.isCropMode) this.exitCropMode()
    if (this.isBrushMode) this.exitBrushMode()

    try {
      // Export original canvas (image + filters baked in)
      const active = c.getActiveObject()
      if (active) c.discardActiveObject()
      c.renderAll()

      const imgCanvas = c.toCanvasElement(1) as HTMLCanvasElement
      const w = imgCanvas.width
      const h = imgCanvas.height
      const origCtx = imgCanvas.getContext('2d', { willReadFrequently: true })!
      const origImageData = origCtx.getImageData(0, 0, w, h)

      // Convert to blob for AI input
      const dataUrl = c.toDataURL({ format: 'png', multiplier: 1 } as any)
      const resp = await fetch(dataUrl)
      const blob = await resp.blob()

      // Run AI background removal — output MASK for edge refinement control
      onProgress('download', 0, i18n.t('toolbar.aiPreparing'))
      const hasWebGPU = typeof navigator !== 'undefined' && 'gpu' in navigator

      const maskBlob = await removeBackground(blob, {
        device: hasWebGPU ? ('gpu' as const) : ('cpu' as const),
        output: { format: 'image/png' },
        progress: (key: string, current: number, total: number) => {
          const pct = total > 0 ? Math.round((current / total) * 100) : 0
          if (key.startsWith('fetch') || key.startsWith('download')) {
            onProgress('download', pct, i18n.t('cutout.downloadingModel', { pct: pct }))
          } else if (key.startsWith('compute') || key.startsWith('inference')) {
            onProgress('inference', pct, i18n.t('cutout.aiInferring', { pct: pct }))
          }
        },
      })

      // Parse mask image
      onProgress('inference', 85, i18n.t('cutout.parsingMask'))
      const maskUrl = URL.createObjectURL(maskBlob)
      const maskImg = await loadImageElement(maskUrl)
      URL.revokeObjectURL(maskUrl)

      // Draw mask at original resolution
      const maskCanvas = document.createElement('canvas')
      maskCanvas.width = w
      maskCanvas.height = h
      const maskCtx = maskCanvas.getContext('2d', { willReadFrequently: true })!
      maskCtx.drawImage(maskImg, 0, 0, w, h)
      const maskData = maskCtx.getImageData(0, 0, w, h).data

      // Extract mask channel (auto-detect alpha vs grayscale)
      const alpha = extractMaskChannel(maskData, w, h)

      // Edge refinement — morphological cleanup + gaussian feather + contrast sharpen
      onProgress('inference', 90, i18n.t('cutout.refiningEdge'))
      const refined = refineMask(alpha, w, h, {
        closeRadius: 1,
        openRadius: 1,
        blurRadius: 2,
        contrast: 1.8,
      })

      // Apply refined mask to original image (preserve original RGB, replace alpha only)
      applyAlpha(origImageData.data, refined)
      origCtx.putImageData(origImageData, 0, 0)

      // Load result back to canvas
      const resultUrl = imgCanvas.toDataURL('image/png')
      onProgress('inference', 100, i18n.t('cutout.generatingResult'))
      await this.loadImage(resultUrl)

      return true
    } catch (err) {
      console.error('[CanvasManager] removeBackground failed:', err)
      return false
    }
  }

  exportImage(format: 'png' | 'jpeg' | 'webp', quality = 0.92, multiplier = 1): string | null {
    if (!this.canvas) {
      console.error('[CanvasManager] exportImage: canvas not initialized')
      return null
    }

    // Deselect active object so selection handles aren't in the export
    const active = this.canvas.getActiveObject()
    if (active) {
      this.canvas.discardActiveObject()
      this.canvas.renderAll()
    }

    // JPEG and WebP don't support transparency — temporarily set a white background
    const originalBg = this.canvas.backgroundColor
    if (format === 'jpeg' || format === 'webp') {
      this.canvas.backgroundColor = '#ffffff'
      this.canvas.renderAll()
    }

    try {
      const dataUrl = this.canvas.toDataURL({
        format,
        quality,
        multiplier,
      })
      return dataUrl
    } catch (err) {
      console.error('[CanvasManager] toDataURL failed:', err)
      return null
    } finally {
      // Restore background and selection
      this.canvas.backgroundColor = originalBg
      this.canvas.renderAll()
      if (active) {
        this.canvas.setActiveObject(active)
        this.canvas.renderAll()
      }
    }
  }

  /** Get current canvas pixel dimensions. */
  getCanvasSize(): { width: number; height: number } | null {
    if (!this.canvas) return null
    return {
      width: this.canvas.getWidth(),
      height: this.canvas.getHeight(),
    }
  }

  /** Get the underlying Fabric canvas (for advanced operations). */
  getCanvas(): fabric.Canvas | null {
    return this.canvas
  }

  /** Check whether the canvas has any objects. */
  hasObjects(): boolean {
    return (this.canvas?.getObjects().length ?? 0) > 0
  }

  /**
   * AI Upscale — run Real-ESRGAN on the current canvas image.
   * Loads the result back onto the canvas.
   */
  async upscaleImage(
    modelId: string,
    onProgress?: UpscaleProgressFn,
  ): Promise<void> {
    if (!this.canvas) {
      console.error('[CanvasManager] upscaleImage: canvas not initialized')
      throw new Error('Canvas not initialized')
    }

    const c = this.canvas

    // Exit any active mode
    if (this.isCropMode) this.exitCropMode()
    if (this.isBrushMode) this.exitBrushMode()

    // Deselect active object
    const active = c.getActiveObject()
    if (active) c.discardActiveObject()
    c.renderAll()

    // Export full canvas at 1:1 scale
    const fullCanvas = c.toCanvasElement(1) as HTMLCanvasElement

    // Crop to image region — avoids processing transparent canvas borders
    // (which the model would interpret as black, producing black edges)
    const img = this.getActiveImage()
    let sourceCanvas: HTMLCanvasElement

    if (img) {
      const bounds = img.getBoundingRect()
      const cropX = Math.max(0, Math.round(bounds.left))
      const cropY = Math.max(0, Math.round(bounds.top))
      const cropW = Math.min(fullCanvas.width - cropX, Math.round(bounds.width))
      const cropH = Math.min(fullCanvas.height - cropY, Math.round(bounds.height))

      if (cropW > 0 && cropH > 0) {
        sourceCanvas = document.createElement('canvas')
        sourceCanvas.width = cropW
        sourceCanvas.height = cropH
        const srcCtx = sourceCanvas.getContext('2d')!
        srcCtx.drawImage(
          fullCanvas,
          cropX, cropY, cropW, cropH,
          0, 0, cropW, cropH,
        )
      } else {
        // Fallback: use full canvas if bounds are invalid
        sourceCanvas = fullCanvas
      }
    } else {
      // No image object found — use full canvas
      sourceCanvas = fullCanvas
    }

    try {
      const result = await runUpscale(sourceCanvas, modelId, onProgress)

      // Convert result canvas to data URL and load back
      const dataUrl = result.canvas.toDataURL('image/png')
      this.isRestoring = true
      await this.loadImage(dataUrl)

      onProgress?.('done', 100, i18n.t('upscale.done'))
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      console.error('[CanvasManager] upscaleImage failed:', err)
      onProgress?.('error', 0, i18n.t('upscale.failed'))
      throw new Error(message)
    } finally {
      this.isRestoring = false
    }
  }
}

/** Shared singleton instance. */
export const canvasManager = new CanvasManager()
