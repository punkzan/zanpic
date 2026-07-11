/**
 * CropOverlay — Independent crop UI engine.
 *
 * Instead of using Fabric.js's object system (which causes z-order conflicts,
 * event interception, and splice bugs), this module creates a separate
 * <canvas> overlay positioned directly on top of the Fabric canvas wrapper.
 *
 * All crop interaction (move, resize, rotate) is handled with pure Canvas 2D
 * API + mouse/touch events. Fabric.js is completely untouched during crop mode.
 *
 * On apply, the canvas manager reads the crop geometry and extracts the region.
 */

export interface CropGeometry {
  cx: number     // center X (canvas logical coords)
  cy: number     // center Y
  w: number      // width  (unrotated)
  h: number      // height (unrotated)
  angle: number  // rotation in degrees
}

type DragMode = 'none' | 'move' | 'resize' | 'rotate'

interface DragState {
  mode: DragMode
  startMx: number
  startMy: number
  startGeo: CropGeometry
  // For resize: the world-space position of the FIXED (opposite) corner
  fixedX: number
  fixedY: number
  corner: string  // 'tl' | 'tr' | 'br' | 'bl'
}

interface HitResult {
  mode: DragMode
  corner?: string
}

export class CropOverlay {
  private overlay: HTMLCanvasElement | null = null
  private ctx: CanvasRenderingContext2D | null = null
  private container: HTMLElement | null = null
  private width = 0
  private height = 0
  private geometry: CropGeometry | null = null
  private aspectRatio = 0   // 0 = free, >0 = locked w/h
  private drag: DragState | null = null
  private active = false

  // Visual constants
  private readonly handleSize = 12
  private readonly rotHandleDist = 30
  private readonly minSize = 50

  // Bound event handlers (for easy removal)
  private _onMouseDown: ((e: MouseEvent) => void) | null = null
  private _onMouseMove: ((e: MouseEvent) => void) | null = null
  private _onMouseUp: ((e: MouseEvent) => void) | null = null
  private _onTouchStart: ((e: TouchEvent) => void) | null = null
  private _onTouchMove: ((e: TouchEvent) => void) | null = null
  private _onTouchEnd: ((e: TouchEvent) => void) | null = null
  private _onDblClick: ((e: MouseEvent) => void) | null = null

  // ── Public API ──

  /**
   * Mount the crop overlay on top of a Fabric.js canvas.
   * @param canvasEl  The Fabric.js lower-canvas element
   * @param cw        Canvas logical width
   * @param ch        Canvas logical height
   * @param ratio     'free' | '1:1' | '4:3' | etc.
   */
  enter(canvasEl: HTMLCanvasElement, cw: number, ch: number, ratio: string) {
    const container = canvasEl.parentElement // .canvas-container
    if (!container) {
      console.error('[CropOverlay] Cannot find canvas container')
      return
    }

    this.container = container
    this.width = cw
    this.height = ch

    // Parse aspect ratio
    if (ratio !== 'free') {
      const parts = ratio.split(':').map(Number)
      if (parts.length === 2 && parts[0] > 0 && parts[1] > 0) {
        this.aspectRatio = parts[0] / parts[1]
      } else {
        this.aspectRatio = 0
      }
    } else {
      this.aspectRatio = 0
    }

    // Create overlay canvas
    this.overlay = document.createElement('canvas')
    this.overlay.width = cw
    this.overlay.height = ch
    this.overlay.style.position = 'absolute'
    this.overlay.style.top = '0'
    this.overlay.style.left = '0'
    this.overlay.style.pointerEvents = 'auto'
    this.overlay.style.cursor = 'move'
    this.overlay.style.zIndex = '100'
    container.style.position = 'relative' // ensure positioning context
    container.appendChild(this.overlay)

    this.ctx = this.overlay.getContext('2d')

    // Initialize centered crop geometry
    const margin = 40
    const maxW = cw - margin * 2
    const maxH = ch - margin * 2
    let w: number, h: number

    if (this.aspectRatio > 0) {
      if (maxW / maxH > this.aspectRatio) {
        h = maxH
        w = maxH * this.aspectRatio
      } else {
        w = maxW
        h = maxW / this.aspectRatio
      }
    } else {
      w = maxW
      h = maxH
    }

    this.geometry = { cx: cw / 2, cy: ch / 2, w, h, angle: 0 }
    this.active = true
    this.bindEvents()
    this.draw()
  }

  /** Remove the overlay and clean up all event listeners. */
  exit() {
    if (!this.active) return
    this.unbindEvents()
    if (this.overlay && this.container) {
      try {
        this.container.removeChild(this.overlay)
      } catch {
        // already removed
      }
    }
    this.overlay = null
    this.ctx = null
    this.container = null
    this.geometry = null
    this.drag = null
    this.active = false
  }

  isActive(): boolean {
    return this.active
  }

  getGeometry(): CropGeometry | null {
    return this.geometry ? { ...this.geometry } : null
  }

  // ── Event Binding ──

  private bindEvents() {
    if (!this.overlay) return

    this._onMouseDown = (e: MouseEvent) => this.handlePointerDown(e.clientX, e.clientY, e)
    this._onMouseMove = (e: MouseEvent) => this.handlePointerMove(e.clientX, e.clientY)
    this._onMouseUp = () => this.handlePointerUp()
    this._onDblClick = () => {
      // Double-click to apply — emit custom event
      this.overlay?.dispatchEvent(new CustomEvent('crop:apply'))
    }

    // Touch support
    this._onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        e.preventDefault()
        this.handlePointerDown(e.touches[0].clientX, e.touches[0].clientY, e)
      }
    }
    this._onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        e.preventDefault()
        this.handlePointerMove(e.touches[0].clientX, e.touches[0].clientY)
      }
    }
    this._onTouchEnd = () => this.handlePointerUp()

    this.overlay.addEventListener('mousedown', this._onMouseDown)
    window.addEventListener('mousemove', this._onMouseMove)
    window.addEventListener('mouseup', this._onMouseUp)
    this.overlay.addEventListener('dblclick', this._onDblClick)
    this.overlay.addEventListener('touchstart', this._onTouchStart, { passive: false })
    this.overlay.addEventListener('touchmove', this._onTouchMove, { passive: false })
    this.overlay.addEventListener('touchend', this._onTouchEnd)
  }

  private unbindEvents() {
    if (this._onMouseDown && this.overlay) this.overlay.removeEventListener('mousedown', this._onMouseDown)
    if (this._onMouseMove) window.removeEventListener('mousemove', this._onMouseMove)
    if (this._onMouseUp) window.removeEventListener('mouseup', this._onMouseUp)
    if (this._onDblClick && this.overlay) this.overlay.removeEventListener('dblclick', this._onDblClick)
    if (this._onTouchStart && this.overlay) this.overlay.removeEventListener('touchstart', this._onTouchStart)
    if (this._onTouchMove && this.overlay) this.overlay.removeEventListener('touchmove', this._onTouchMove)
    if (this._onTouchEnd && this.overlay) this.overlay.removeEventListener('touchend', this._onTouchEnd)
  }

  // ── Coordinate Helpers ──

  /** Convert client coords to canvas logical coords. */
  private toCanvas(clientX: number, clientY: number): { x: number, y: number } {
    if (!this.overlay) return { x: 0, y: 0 }
    const rect = this.overlay.getBoundingClientRect()
    return {
      x: (clientX - rect.left) * (this.width / rect.width),
      y: (clientY - rect.top) * (this.height / rect.height),
    }
  }

  /** Convert a world-space point to crop-rect local space. */
  private toLocal(mx: number, my: number, geo: CropGeometry): { lx: number, ly: number } {
    const rad = (geo.angle * Math.PI) / 180
    const cos = Math.cos(rad), sin = Math.sin(rad)
    const dx = mx - geo.cx
    const dy = my - geo.cy
    return {
      lx: dx * cos + dy * sin,
      ly: -dx * sin + dy * cos,
    }
  }

  /** Get world-space position of a named corner. */
  private cornerWorld(geo: CropGeometry, corner: string): { x: number, y: number } {
    const rad = (geo.angle * Math.PI) / 180
    const cos = Math.cos(rad), sin = Math.sin(rad)
    let lx = 0, ly = 0
    switch (corner) {
      case 'tl': lx = -geo.w / 2; ly = -geo.h / 2; break
      case 'tr': lx = geo.w / 2; ly = -geo.h / 2; break
      case 'br': lx = geo.w / 2; ly = geo.h / 2; break
      case 'bl': lx = -geo.w / 2; ly = geo.h / 2; break
    }
    return { x: geo.cx + lx * cos - ly * sin, y: geo.cy + lx * sin + ly * cos }
  }

  private opposite(corner: string): string {
    return { tl: 'br', tr: 'bl', br: 'tl', bl: 'tr' }[corner] || 'br'
  }

  // ── Hit Testing ──

  private hitTest(mx: number, my: number): HitResult {
    if (!this.geometry) return { mode: 'none' }
    const geo = this.geometry
    const { lx, ly } = this.toLocal(mx, my, geo)
    const half = this.handleSize / 2 + 5

    // Rotation handle (circle above top-center)
    const rotLx = 0, rotLy = -geo.h / 2 - this.rotHandleDist
    if (Math.hypot(lx - rotLx, ly - rotLy) < half + 6) {
      return { mode: 'rotate' }
    }

    // Corner handles
    const corners: [string, number, number][] = [
      ['tl', -geo.w / 2, -geo.h / 2],
      ['tr', geo.w / 2, -geo.h / 2],
      ['br', geo.w / 2, geo.h / 2],
      ['bl', -geo.w / 2, geo.h / 2],
    ]
    for (const [name, hx, hy] of corners) {
      if (Math.abs(lx - hx) < half && Math.abs(ly - hy) < half) {
        return { mode: 'resize', corner: name }
      }
    }

    // Body — move
    if (lx >= -geo.w / 2 && lx <= geo.w / 2 && ly >= -geo.h / 2 && ly <= geo.h / 2) {
      return { mode: 'move' }
    }

    return { mode: 'none' }
  }

  // ── Pointer Handlers ──

  private handlePointerDown(clientX: number, clientY: number, e?: Event) {
    if (!this.geometry || !this.overlay) return
    const { x: mx, y: my } = this.toCanvas(clientX, clientY)
    const hit = this.hitTest(mx, my)

    if (hit.mode === 'none') return
    if (e) e.preventDefault()

    this.drag = {
      mode: hit.mode,
      startMx: mx,
      startMy: my,
      startGeo: { ...this.geometry },
      fixedX: 0,
      fixedY: 0,
      corner: hit.corner || '',
    }

    if (hit.mode === 'resize' && hit.corner) {
      const fixed = this.cornerWorld(this.geometry, this.opposite(hit.corner))
      this.drag.fixedX = fixed.x
      this.drag.fixedY = fixed.y
    }

    // Update cursor
    if (hit.mode === 'rotate') this.overlay.style.cursor = 'grabbing'
    else if (hit.mode === 'resize') this.overlay.style.cursor = 'nwse-resize'
    else this.overlay.style.cursor = 'grabbing'
  }

  private handlePointerMove(clientX: number, clientY: number) {
    if (!this.overlay) return
    const { x: mx, y: my } = this.toCanvas(clientX, clientY)

    // Update cursor on hover (when not dragging)
    if (!this.drag) {
      const hit = this.hitTest(mx, my)
      if (hit.mode === 'rotate') this.overlay.style.cursor = 'grab'
      else if (hit.mode === 'resize') this.overlay.style.cursor = 'nwse-resize'
      else if (hit.mode === 'move') this.overlay.style.cursor = 'move'
      else this.overlay.style.cursor = 'default'
      return
    }

    switch (this.drag.mode) {
      case 'move': this.doMove(mx, my); break
      case 'resize': this.doResize(mx, my); break
      case 'rotate': this.doRotate(mx, my); break
    }
    this.draw()
  }

  private handlePointerUp() {
    if (!this.drag || !this.overlay) return
    this.drag = null
    this.overlay.style.cursor = 'move'
  }

  // ── Drag Logic ──

  private doMove(mx: number, my: number) {
    if (!this.drag || !this.geometry) return
    const dx = mx - this.drag.startMx
    const dy = my - this.drag.startMy
    this.geometry.cx = this.drag.startGeo.cx + dx
    this.geometry.cy = this.drag.startGeo.cy + dy
  }

  private doResize(mx: number, my: number) {
    if (!this.drag || !this.geometry) return
    const geo = this.drag.startGeo
    const rad = (geo.angle * Math.PI) / 180
    const cos = Math.cos(rad), sin = Math.sin(rad)

    // Vector from fixed corner to mouse, in world space
    const wdx = mx - this.drag.fixedX
    const wdy = my - this.drag.fixedY

    // Rotate to local frame
    const localDx = wdx * cos + wdy * sin
    const localDy = -wdx * sin + wdy * cos

    let newW = Math.max(Math.abs(localDx), this.minSize)
    let newH = Math.max(Math.abs(localDy), this.minSize)

    // Aspect ratio lock
    if (this.aspectRatio > 0) {
      // Fit the smaller dimension
      if (newW / newH > this.aspectRatio) {
        newW = newH * this.aspectRatio
      } else {
        newH = newW / this.aspectRatio
      }
      // Re-enforce min
      if (newW < this.minSize) {
        newW = this.minSize
        newH = newW / this.aspectRatio
      }
      if (newH < this.minSize) {
        newH = this.minSize
        newW = newH * this.aspectRatio
      }
    }

    // Direction signs (which side of the fixed corner the mouse is on)
    const signX = localDx >= 0 ? 1 : -1
    const signY = localDy >= 0 ? 1 : -1

    // New center = fixed corner + (signX * newW/2, signY * newH/2) in local, rotated to world
    const halfLX = signX * newW / 2
    const halfLY = signY * newH / 2
    const worldHalfX = halfLX * cos - halfLY * sin
    const worldHalfY = halfLX * sin + halfLY * cos

    this.geometry.cx = this.drag.fixedX + worldHalfX
    this.geometry.cy = this.drag.fixedY + worldHalfY
    this.geometry.w = newW
    this.geometry.h = newH
  }

  private doRotate(mx: number, my: number) {
    if (!this.drag || !this.geometry) return
    const geo = this.geometry
    let angle = Math.atan2(my - geo.cy, mx - geo.cx) * (180 / Math.PI) + 90

    // Normalize to -180..180
    if (angle > 180) angle -= 360
    if (angle < -180) angle += 360

    // Snap to 0/90/180/270 within 5 degrees
    const snapped = Math.round(angle / 90) * 90
    if (Math.abs(angle - snapped) < 5) {
      angle = snapped
    }

    this.geometry.angle = angle
  }

  // ── Drawing ──

  private draw() {
    const ctx = this.ctx
    if (!ctx || !this.geometry) return
    const geo = this.geometry
    const rad = (geo.angle * Math.PI) / 180
    const cos = Math.cos(rad), sin = Math.sin(rad)

    ctx.clearRect(0, 0, this.width, this.height)

    // ── Mask with evenodd hole ──
    // Compute rotated corners of the crop rect
    const corners = [
      [-geo.w / 2, -geo.h / 2],
      [geo.w / 2, -geo.h / 2],
      [geo.w / 2, geo.h / 2],
      [-geo.w / 2, geo.h / 2],
    ].map(([lx, ly]) => ({
      x: geo.cx + lx * cos - ly * sin,
      y: geo.cy + lx * sin + ly * cos,
    }))

    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)'
    ctx.beginPath()
    // Outer rect (full canvas)
    ctx.rect(0, 0, this.width, this.height)
    // Inner rect (crop area) — reversed winding for evenodd
    ctx.moveTo(corners[0].x, corners[0].y)
    for (let i = 1; i < 4; i++) ctx.lineTo(corners[i].x, corners[i].y)
    ctx.closePath()
    ctx.fill('evenodd')

    // ── Crop rect border + internals (in rotated space) ──
    ctx.save()
    ctx.translate(geo.cx, geo.cy)
    ctx.rotate(rad)

    // Border
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 2
    ctx.setLineDash([8, 4])
    ctx.strokeRect(-geo.w / 2, -geo.h / 2, geo.w, geo.h)

    // Rule of thirds
    ctx.setLineDash([])
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(-geo.w / 6, -geo.h / 2); ctx.lineTo(-geo.w / 6, geo.h / 2)
    ctx.moveTo(geo.w / 6, -geo.h / 2); ctx.lineTo(geo.w / 6, geo.h / 2)
    ctx.moveTo(-geo.w / 2, -geo.h / 6); ctx.lineTo(geo.w / 2, -geo.h / 6)
    ctx.moveTo(-geo.w / 2, geo.h / 6); ctx.lineTo(geo.w / 2, geo.h / 6)
    ctx.stroke()

    // Corner handles
    const hs = this.handleSize
    const half = hs / 2
    const handleCorners: [number, number][] = [
      [-geo.w / 2, -geo.h / 2],
      [geo.w / 2, -geo.h / 2],
      [geo.w / 2, geo.h / 2],
      [-geo.w / 2, geo.h / 2],
    ]
    for (const [hx, hy] of handleCorners) {
      // White fill with accent border
      ctx.fillStyle = '#ffffff'
      ctx.strokeStyle = '#6366f1'
      ctx.lineWidth = 2
      ctx.fillRect(hx - half, hy - half, hs, hs)
      ctx.strokeRect(hx - half, hy - half, hs, hs)
    }

    // Rotation handle — line + circle above top center
    const rotY = -geo.h / 2 - this.rotHandleDist
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'
    ctx.lineWidth = 1.5
    ctx.setLineDash([])
    ctx.beginPath()
    ctx.moveTo(0, -geo.h / 2)
    ctx.lineTo(0, rotY)
    ctx.stroke()

    ctx.fillStyle = '#6366f1'
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(0, rotY, 7, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()

    ctx.restore()
  }
}

/** Shared singleton. */
export const cropOverlay = new CropOverlay()
