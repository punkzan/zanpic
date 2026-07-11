/**
 * BrushMask — Interactive brush painting engine for cutout.
 *
 * Creates an independent <canvas> overlay (like CropOverlay) on top of the
 * Fabric canvas. The user paints with two brushes:
 *
 *   - Foreground brush (green): marks pixels to KEEP
 *   - Background brush (red):   marks pixels to REMOVE
 *   - Eraser: removes paint strokes from either mask
 *
 * Internally maintains two offscreen canvases (fgCanvas, bgCanvas) that store
 * the raw paint strokes. The visible overlay composites both for display.
 *
 * On apply, the canvas manager reads fgCanvas & bgCanvas, converts to a
 * GrabCut mask, and runs OpenCV.js grabCut to produce a refined alpha mask.
 */

export type BrushMode = 'foreground' | 'background' | 'erase'

export class BrushMask {
  private overlay: HTMLCanvasElement | null = null
  private ctx: CanvasRenderingContext2D | null = null
  private container: HTMLElement | null = null

  // Offscreen mask canvases — store raw paint strokes
  private fgCanvas: HTMLCanvasElement | null = null
  private bgCanvas: HTMLCanvasElement | null = null
  private fgCtx: CanvasRenderingContext2D | null = null
  private bgCtx: CanvasRenderingContext2D | null = null

  private width = 0
  private height = 0
  private active = false

  // Brush settings
  private brushMode: BrushMode = 'foreground'
  private brushSize = 40

  // Drawing state
  private isDrawing = false
  private lastX = 0
  private lastY = 0

  // Bound handlers
  private _onMouseDown: ((e: MouseEvent) => void) | null = null
  private _onMouseMove: ((e: MouseEvent) => void) | null = null
  private _onMouseUp: (() => void) | null = null
  private _onTouchStart: ((e: TouchEvent) => void) | null = null
  private _onTouchMove: ((e: TouchEvent) => void) | null = null
  private _onTouchEnd: (() => void) | null = null

  // Cursor preview
  private cursorX = -100
  private cursorY = -100
  private showCursor = false

  // ── Public API ──

  /**
   * Mount the brush overlay on top of a Fabric.js canvas.
   * @param canvasEl  The Fabric.js lower-canvas element
   * @param cw        Canvas logical width
   * @param ch        Canvas logical height
   */
  enter(canvasEl: HTMLCanvasElement, cw: number, ch: number) {
    const container = canvasEl.parentElement
    if (!container) {
      console.error('[BrushMask] Cannot find canvas container')
      return false
    }

    console.log('[BrushMask] enter called', { cw, ch, containerClass: container.className })

    this.container = container
    this.width = cw
    this.height = ch

    // Create visible overlay (captures pointer events)
    this.overlay = document.createElement('canvas')
    this.overlay.width = cw
    this.overlay.height = ch
    this.overlay.style.position = 'absolute'
    this.overlay.style.top = '0'
    this.overlay.style.left = '0'
    this.overlay.style.width = '100%'
    this.overlay.style.height = '100%'
    this.overlay.style.pointerEvents = 'auto'
    this.overlay.style.cursor = 'none' // custom cursor
    this.overlay.style.zIndex = '1000'
    container.style.position = 'relative'
    container.appendChild(this.overlay)

    this.ctx = this.overlay.getContext('2d')

    console.log('[BrushMask] overlay mounted, dimensions:', {
      w: this.overlay.width,
      h: this.overlay.height,
      cssW: this.overlay.style.width,
      cssH: this.overlay.style.height,
    })

    // Create offscreen mask canvases
    this.fgCanvas = document.createElement('canvas')
    this.fgCanvas.width = cw
    this.fgCanvas.height = ch
    this.fgCtx = this.fgCanvas.getContext('2d')

    this.bgCanvas = document.createElement('canvas')
    this.bgCanvas.width = cw
    this.bgCanvas.height = ch
    this.bgCtx = this.bgCanvas.getContext('2d')

    this.active = true
    this.bindEvents()
    this.composite()
    return true
  }

  /** Remove overlay and clean up. */
  exit() {
    if (!this.active) return
    this.unbindEvents()
    if (this.overlay && this.container) {
      try {
        this.container.removeChild(this.overlay)
      } catch {
        /* already removed */
      }
    }
    this.overlay = null
    this.ctx = null
    this.fgCanvas = null
    this.bgCanvas = null
    this.fgCtx = null
    this.bgCtx = null
    this.container = null
    this.active = false
  }

  isActive(): boolean {
    return this.active
  }

  /** Get the foreground mask canvas (green strokes) for GrabCut. */
  getFgCanvas(): HTMLCanvasElement | null {
    return this.fgCanvas
  }

  /** Get the background mask canvas (red strokes) for GrabCut. */
  getBgCanvas(): HTMLCanvasElement | null {
    return this.bgCanvas
  }

  /** Set brush mode. */
  setBrushMode(mode: BrushMode) {
    this.brushMode = mode
  }

  getBrushMode(): BrushMode {
    return this.brushMode
  }

  /** Set brush size in pixels. */
  setBrushSize(size: number) {
    this.brushSize = Math.max(5, Math.min(120, size))
    if (this.showCursor) this.composite()
  }

  getBrushSize(): number {
    return this.brushSize
  }

  /** Clear all paint strokes. */
  clear() {
    this.fgCtx?.clearRect(0, 0, this.width, this.height)
    this.bgCtx?.clearRect(0, 0, this.width, this.height)
    this.composite()
  }

  /** Check if any foreground strokes have been painted. */
  hasFgPaint(): boolean {
    if (!this.fgCtx) return false
    const data = this.fgCtx.getImageData(0, 0, this.width, this.height).data
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] > 0) return true
    }
    return false
  }

  // ── Event Binding ──

  private bindEvents() {
    if (!this.overlay) return

    this._onMouseDown = (e: MouseEvent) => {
      const { x, y } = this.toCanvas(e.clientX, e.clientY)
      this.isDrawing = true
      this.lastX = x
      this.lastY = y
      this.paintDot(x, y)
    }
    this._onMouseMove = (e: MouseEvent) => {
      const { x, y } = this.toCanvas(e.clientX, e.clientY)
      this.cursorX = x
      this.cursorY = y
      this.showCursor = true
      if (this.isDrawing) {
        this.paintLine(this.lastX, this.lastY, x, y)
        this.lastX = x
        this.lastY = y
      } else {
        this.composite()
      }
    }
    this._onMouseUp = () => {
      this.isDrawing = false
    }

    this._onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        e.preventDefault()
        const { x, y } = this.toCanvas(e.touches[0].clientX, e.touches[0].clientY)
        this.isDrawing = true
        this.lastX = x
        this.lastY = y
        this.paintDot(x, y)
      }
    }
    this._onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        e.preventDefault()
        const { x, y } = this.toCanvas(e.touches[0].clientX, e.touches[0].clientY)
        if (this.isDrawing) {
          this.paintLine(this.lastX, this.lastY, x, y)
          this.lastX = x
          this.lastY = y
        }
      }
    }
    this._onTouchEnd = () => {
      this.isDrawing = false
    }

    this.overlay.addEventListener('mousedown', this._onMouseDown)
    window.addEventListener('mousemove', this._onMouseMove)
    window.addEventListener('mouseup', this._onMouseUp)
    this.overlay.addEventListener('touchstart', this._onTouchStart, { passive: false })
    this.overlay.addEventListener('touchmove', this._onTouchMove, { passive: false })
    this.overlay.addEventListener('touchend', this._onTouchEnd)

    // Hide cursor when leaving overlay
    this.overlay.addEventListener('mouseleave', () => {
      this.showCursor = false
      this.composite()
    })
    this.overlay.addEventListener('mouseenter', () => {
      this.showCursor = true
    })
  }

  private unbindEvents() {
    if (this._onMouseDown && this.overlay) this.overlay.removeEventListener('mousedown', this._onMouseDown)
    if (this._onMouseMove) window.removeEventListener('mousemove', this._onMouseMove)
    if (this._onMouseUp) window.removeEventListener('mouseup', this._onMouseUp)
    if (this._onTouchStart && this.overlay) this.overlay.removeEventListener('touchstart', this._onTouchStart)
    if (this._onTouchMove && this.overlay) this.overlay.removeEventListener('touchmove', this._onTouchMove)
    if (this._onTouchEnd && this.overlay) this.overlay.removeEventListener('touchend', this._onTouchEnd)
  }

  // ── Coordinate Helper ──

  private toCanvas(clientX: number, clientY: number): { x: number, y: number } {
    if (!this.overlay) return { x: 0, y: 0 }
    const rect = this.overlay.getBoundingClientRect()
    return {
      x: (clientX - rect.left) * (this.width / rect.width),
      y: (clientY - rect.top) * (this.height / rect.height),
    }
  }

  // ── Painting ──

  private paintDot(x: number, y: number) {
    const r = this.brushSize / 2

    if (this.brushMode === 'erase') {
      this.eraseAt(this.fgCtx, x, y, r)
      this.eraseAt(this.bgCtx, x, y, r)
    } else {
      const ctx = this.brushMode === 'foreground' ? this.fgCtx : this.bgCtx
      const color = this.brushMode === 'foreground'
        ? 'rgba(0, 255, 80, 0.45)'
        : 'rgba(255, 50, 50, 0.45)'
      this.drawDot(ctx, x, y, r, color)
    }

    this.composite()
  }

  private paintLine(x1: number, y1: number, x2: number, y2: number) {
    const r = this.brushSize / 2

    if (this.brushMode === 'erase') {
      this.eraseLine(this.fgCtx, x1, y1, x2, y2, r)
      this.eraseLine(this.bgCtx, x1, y1, x2, y2, r)
    } else {
      const ctx = this.brushMode === 'foreground' ? this.fgCtx : this.bgCtx
      const color = this.brushMode === 'foreground'
        ? 'rgba(0, 255, 80, 0.45)'
        : 'rgba(255, 50, 50, 0.45)'
      this.drawLine(ctx, x1, y1, x2, y2, r, color)
    }

    this.composite()
  }

  private drawDot(ctx: CanvasRenderingContext2D | null, x: number, y: number, r: number, color: string) {
    if (!ctx) return
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }

  private drawLine(ctx: CanvasRenderingContext2D | null, x1: number, y1: number, x2: number, y2: number, r: number, color: string) {
    if (!ctx) return
    ctx.strokeStyle = color
    ctx.lineWidth = r * 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
  }

  private eraseAt(ctx: CanvasRenderingContext2D | null, x: number, y: number, r: number) {
    if (!ctx) return
    ctx.save()
    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  private eraseLine(ctx: CanvasRenderingContext2D | null, x1: number, y1: number, x2: number, y2: number, r: number) {
    if (!ctx) return
    ctx.save()
    ctx.globalCompositeOperation = 'destination-out'
    ctx.lineWidth = r * 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
    ctx.restore()
  }

  // ── Compositing ──

  private composite() {
    const ctx = this.ctx
    if (!ctx) return

    ctx.clearRect(0, 0, this.width, this.height)

    // Draw paint strokes
    if (this.fgCanvas) ctx.drawImage(this.fgCanvas, 0, 0)
    if (this.bgCanvas) ctx.drawImage(this.bgCanvas, 0, 0)

    // Draw cursor preview
    if (this.showCursor && this.cursorX >= 0) {
      const r = this.brushSize / 2
      ctx.save()

      // Outer ring (mode color)
      const ringColor = this.brushMode === 'foreground'
        ? 'rgba(0, 255, 80, 0.9)'
        : this.brushMode === 'background'
          ? 'rgba(255, 50, 50, 0.9)'
          : 'rgba(255, 255, 255, 0.9)'

      ctx.strokeStyle = ringColor
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(this.cursorX, this.cursorY, r, 0, Math.PI * 2)
      ctx.stroke()

      // Inner dot
      ctx.fillStyle = ringColor
      ctx.beginPath()
      ctx.arc(this.cursorX, this.cursorY, 2, 0, Math.PI * 2)
      ctx.fill()

      ctx.restore()
    }
  }
}

/** Shared singleton. */
export const brushMask = new BrushMask()
