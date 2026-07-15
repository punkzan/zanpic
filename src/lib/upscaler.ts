/**
 * AI Upscaler Engine — Real-ESRGAN via ONNX Runtime Web
 *
 * Uses pre-converted ONNX models from HuggingFace (SceneWorks/real-esrgan-onnx).
 * Supports WebGPU → WASM fallback, tiling for large images, and IndexedDB model caching.
 *
 * Model input:  [1, 3, H, W] float32, RGB, normalized [0, 1]
 * Model output: [1, 3, H*scale, W*scale] float32, RGB, values ~[0, 1]
 */

import * as ort from 'onnxruntime-web'
import { clamp } from './utils'

// ── Model Configuration ──────────────────────────────────────────────

export interface UpscaleModel {
  id: string
  name: string
  url: string
  scale: number
  sizeHint: string
  tileThreshold: number  // max input dimension before tiling kicks in
}

export const UPSCALE_MODELS: UpscaleModel[] = [
  {
    id: 'realesrgan-x4',
    name: 'RealESRGAN x4 (General)',
    url: 'https://huggingface.co/SceneWorks/real-esrgan-onnx/resolve/main/real_esrgan_x4.onnx',
    scale: 4,
    sizeHint: '~67 MB',
    tileThreshold: 512,
  },
  {
    id: 'realesrgan-x2',
    name: 'RealESRGAN x2 (General)',
    url: 'https://huggingface.co/SceneWorks/real-esrgan-onnx/resolve/main/real_esrgan_x2.onnx',
    scale: 2,
    sizeHint: '~67 MB',
    tileThreshold: 768,
  },
]

export function getModelById(id: string): UpscaleModel | undefined {
  return UPSCALE_MODELS.find((m) => m.id === id)
}

// ── Progress Callback ────────────────────────────────────────────────

export type UpscalePhase = 'download' | 'inference' | 'done' | 'error'
export type UpscaleProgressFn = (phase: UpscalePhase, progress: number, message: string) => void

// ── ORT Environment Setup ────────────────────────────────────────────

let ortInitialized = false

async function ensureOrtReady() {
  if (ortInitialized) return

  // Configure WASM paths to CDN — avoids Vite bundling issues with .wasm files
  const ortVersion = '1.21.0'
  ort.env.wasm.wasmPaths = `https://cdn.jsdelivr.net/npm/onnxruntime-web@${ortVersion}/dist/`

  // Disable proxy mode (not needed in browser)
  ort.env.wasm.proxy = false

  ortInitialized = true
}

/** Detect best available execution provider */
async function getExecutionProviders(): Promise<string[]> {
  const providers: string[] = []

  // WebGPU
  if (typeof navigator !== 'undefined' && 'gpu' in navigator) {
    providers.push('webgpu')
  }

  // WASM is always available as fallback
  providers.push('wasm')

  return providers
}

// ── IndexedDB Model Cache ────────────────────────────────────────────

const DB_NAME = 'zanpic-upscaler-cache'
const STORE_NAME = 'models'
const DB_VERSION = 1

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function getCachedModel(key: string): Promise<ArrayBuffer | null> {
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly')
      const req = tx.objectStore(STORE_NAME).get(key)
      req.onsuccess = () => resolve(req.result || null)
      req.onerror = () => reject(req.error)
    })
  } catch {
    return null
  }
}

async function cacheModel(key: string, data: ArrayBuffer): Promise<void> {
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      tx.objectStore(STORE_NAME).put(data, key)
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  } catch {
    // Cache failure is non-fatal
  }
}

// ── Model Download ───────────────────────────────────────────────────

async function downloadModel(
  url: string,
  modelId: string,
  onProgress?: UpscaleProgressFn,
): Promise<ArrayBuffer> {
  // Check cache first
  const cached = await getCachedModel(modelId)
  if (cached) {
    onProgress?.('download', 100, 'Model loaded from cache')
    return cached
  }

  onProgress?.('download', 0, 'Downloading AI model...')

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Model download failed: ${response.status} ${response.statusText}`)
  }

  const contentLength = parseInt(response.headers.get('content-length') || '0', 10)
  const reader = response.body?.getReader()

  if (!reader || !contentLength) {
    // No streaming — download as single blob
    const buffer = await response.arrayBuffer()
    await cacheModel(modelId, buffer)
    onProgress?.('download', 100, 'Model downloaded')
    return buffer
  }

  // Stream with progress
  const chunks: Uint8Array[] = []
  let received = 0
  let lastReport = 0

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    chunks.push(value)
    received += value.length

    // Throttle progress updates to avoid UI spam
    const now = Date.now()
    if (now - lastReport > 200) {
      const pct = (received / contentLength) * 100
      onProgress?.('download', pct, `Downloading AI model... ${pct.toFixed(0)}%`)
      lastReport = now
    }
  }

  onProgress?.('download', 100, 'Model downloaded, initializing...')

  // Assemble chunks into single ArrayBuffer
  const total = chunks.reduce((sum, c) => sum + c.length, 0)
  const buffer = new ArrayBuffer(total)
  const view = new Uint8Array(buffer)
  let offset = 0
  for (const chunk of chunks) {
    view.set(chunk, offset)
    offset += chunk.length
  }

  // Cache for next time
  await cacheModel(modelId, buffer)

  return buffer
}

// ── ORT Session Management ───────────────────────────────────────────

const sessionCache = new Map<string, ort.InferenceSession>()

async function getSession(
  model: UpscaleModel,
  onProgress?: UpscaleProgressFn,
): Promise<ort.InferenceSession> {
  // Return cached session if available
  const cached = sessionCache.get(model.id)
  if (cached) return cached

  await ensureOrtReady()

  const modelData = await downloadModel(model.url, model.id, onProgress)

  const providers = await getExecutionProviders()
  onProgress?.('inference', 0, `Initializing ${providers[0].toUpperCase()} backend...`)

  const session = await ort.InferenceSession.create(modelData, {
    executionProviders: providers,
    graphOptimizationLevel: 'all',
  })

  sessionCache.set(model.id, session)
  return session
}

// ── Tensor Conversion ────────────────────────────────────────────────

/**
 * Convert RGBA ImageData to NCHW float32 tensor [1, 3, H, W].
 * Normalizes pixel values to [0, 1].
 * Alpha channel is ignored (handled separately).
 */
function rgbaToNCHW(imageData: ImageData): Float32Array {
  const { width, height, data } = imageData
  const pixelCount = width * height
  const tensor = new Float32Array(3 * pixelCount)

  for (let i = 0; i < pixelCount; i++) {
    tensor[0 * pixelCount + i] = data[i * 4 + 0] / 255  // R
    tensor[1 * pixelCount + i] = data[i * 4 + 1] / 255  // G
    tensor[2 * pixelCount + i] = data[i * 4 + 2] / 255  // B
  }

  return tensor
}

/**
 * Convert NCHW float32 tensor [1, 3, H, W] to RGBA Uint8ClampedArray.
 * Clamps values to [0, 255].
 */
function nchwToRGBA(
  tensor: Float32Array,
  width: number,
  height: number,
  alphaSource?: Uint8ClampedArray,
): Uint8ClampedArray {
  const pixelCount = width * height
  const rgba = new Uint8ClampedArray(pixelCount * 4)

  for (let i = 0; i < pixelCount; i++) {
    rgba[i * 4 + 0] = clamp(tensor[0 * pixelCount + i] * 255, 0, 255)  // R
    rgba[i * 4 + 1] = clamp(tensor[1 * pixelCount + i] * 255, 0, 255)  // G
    rgba[i * 4 + 2] = clamp(tensor[2 * pixelCount + i] * 255, 0, 255)  // B
    rgba[i * 4 + 3] = alphaSource ? alphaSource[i * 4 + 3] : 255       // A
  }

  return rgba
}

// ── Tiling Engine ────────────────────────────────────────────────────

interface TileInfo {
  sx: number      // source x in input image
  sy: number      // source y in input image
  sw: number      // source width
  sh: number      // source height
  dx: number      // destination x in output image (after scale)
  dy: number      // destination y in output image (after scale)
  dw: number      // destination width (after scale, without overlap)
  dh: number      // destination height (after scale, without overlap)
}

/**
 * Calculate tile grid for an image.
 * Each tile has `overlap` pixels of padding on each side (from neighbors).
 * The padding is cropped from the output to avoid seam artifacts.
 */
function calculateTiles(
  width: number,
  height: number,
  tileSize: number,
  overlap: number,
  scale: number,
): TileInfo[] {
  const tiles: TileInfo[] = []
  const step = tileSize - overlap * 2  // effective tile size after removing overlap

  // Handle images smaller than tile size — single tile
  if (width <= tileSize && height <= tileSize) {
    tiles.push({
      sx: 0, sy: 0, sw: width, sh: height,
      dx: 0, dy: 0, dw: width * scale, dh: height * scale,
    })
    return tiles
  }

  // Calculate tile positions
  const xPositions: number[] = []
  const yPositions: number[] = []

  for (let x = 0; x < width; x += step) {
    xPositions.push(Math.min(x, Math.max(0, width - tileSize))
    )
    if (x + step >= width) break
  }
  // Ensure we cover the right edge
  if (xPositions.length === 0 || xPositions[xPositions.length - 1] + tileSize < width) {
    xPositions.push(Math.max(0, width - tileSize))
  }

  for (let y = 0; y < height; y += step) {
    yPositions.push(Math.min(y, Math.max(0, height - tileSize))
    )
    if (y + step >= height) break
  }
  if (yPositions.length === 0 || yPositions[yPositions.length - 1] + tileSize < height) {
    yPositions.push(Math.max(0, height - tileSize))
  }

  // Deduplicate positions (can happen with small images)
  const uniqueX = [...new Set(xPositions)]
  const uniqueY = [...new Set(yPositions)]

  for (const sy of uniqueY) {
    for (const sx of uniqueX) {
      const sw = Math.min(tileSize, width - sx)
      const sh = Math.min(tileSize, height - sy)

      // Calculate the core region — the non-overlap portion of this tile.
      // Each tile has `overlap` padding on sides that face a neighbor.
      // Edge sides (no neighbor) have no overlap, so the core extends to the edge.
      // This ensures seamless coverage with NO gaps between adjacent tiles.
      const leftOverlap = sx > 0 ? overlap : 0
      const rightOverlap = (sx + sw < width) ? overlap : 0
      const topOverlap = sy > 0 ? overlap : 0
      const bottomOverlap = (sy + sh < height) ? overlap : 0

      const coreX = sx + leftOverlap
      const coreY = sy + topOverlap
      const coreW = sw - leftOverlap - rightOverlap
      const coreH = sh - topOverlap - bottomOverlap

      tiles.push({
        sx, sy, sw, sh,
        dx: coreX * scale,
        dy: coreY * scale,
        dw: coreW * scale,
        dh: coreH * scale,
      })
    }
  }

  return tiles
}

// ── Alpha Channel Handling ───────────────────────────────────────────

/**
 * Check if an image has meaningful alpha (non-fully-opaque pixels).
 */
function hasAlpha(imageData: ImageData): boolean {
  const { data } = imageData
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] < 255) return true
  }
  return false
}

/**
 * Upscale alpha channel using bilinear interpolation via canvas drawImage.
 * Returns just the alpha channel as a Uint8ClampedArray (RGBA format, only A matters).
 */
function upscaleAlpha(
  sourceCanvas: HTMLCanvasElement,
  targetWidth: number,
  targetHeight: number,
): Uint8ClampedArray | null {
  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = targetWidth
  tempCanvas.height = targetHeight
  const ctx = tempCanvas.getContext('2d')!
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(sourceCanvas, 0, 0, targetWidth, targetHeight)

  const imgData = ctx.getImageData(0, 0, targetWidth, targetHeight)
  return imgData.data  // RGBA, we only care about the A channel
}

// ── Main Upscale Function ────────────────────────────────────────────

// Browser canvas hard limits (conservative value that works across Chromium, Safari, Firefox)
const MAX_CANVAS_DIMENSION = 16384
const MAX_CANVAS_PIXELS = MAX_CANVAS_DIMENSION * MAX_CANVAS_DIMENSION

/** Build a human-readable size string */
function sizeStr(w: number, h: number): string {
  return `${w}×${h}px`
}

/**
 * Upscale an image using Real-ESRGAN via ONNX Runtime Web.
 *
 * @param sourceCanvas  Input canvas element with the image
 * @param modelId       Model ID (e.g. 'realesrgan-x4')
 * @param onProgress    Progress callback
 * @returns             Object with result canvas and dimensions
 */
export async function upscaleImage(
  sourceCanvas: HTMLCanvasElement,
  modelId: string,
  onProgress?: UpscaleProgressFn,
): Promise<{ canvas: HTMLCanvasElement; width: number; height: number }> {
  const model = getModelById(modelId)
  if (!model) {
    throw new Error(`UPSCALE_UNKNOWN_MODEL: ${modelId}`)
  }

  const scale = model.scale
  const srcW = sourceCanvas.width
  const srcH = sourceCanvas.height
  const outW = srcW * scale
  const outH = srcH * scale

  // Guard against browser Canvas size limits before allocating memory
  if (outW > MAX_CANVAS_DIMENSION || outH > MAX_CANVAS_DIMENSION) {
    throw new Error(
      `UPSCALE_SIZE_LIMIT_EXCEEDED: Output size ${sizeStr(outW, outH)} exceeds the browser ` +
        `canvas limit of ${MAX_CANVAS_DIMENSION}px per side. Try the 2× model, or crop/resize the image first.`,
    )
  }
  const totalOutPixels = outW * outH
  if (totalOutPixels > MAX_CANVAS_PIXELS) {
    throw new Error(
      `UPSCALE_SIZE_LIMIT_EXCEEDED: Output size ${sizeStr(outW, outH)} (` +
        `${(totalOutPixels / 1e6).toFixed(1)}M pixels) exceeds the browser canvas pixel limit. ` +
        `Try the 2× model, or crop/resize the image first.`,
    )
  }
  if (srcW === 0 || srcH === 0) {
    throw new Error(`UPSCALE_INVALID_INPUT: Source image has zero width or height (${sizeStr(srcW, srcH)}).`)
  }

  // Get source image data
  let srcCtx: CanvasRenderingContext2D
  let srcImageData: ImageData
  try {
    srcCtx = sourceCanvas.getContext('2d', { willReadFrequently: true })!
    srcImageData = srcCtx.getImageData(0, 0, srcW, srcH)
  } catch (err) {
    throw new Error(
      `UPSCALE_READ_FAILED: Could not read source image pixels (${sizeStr(srcW, srcH)}). ` +
        (err instanceof Error ? err.message : String(err)),
    )
  }

  // Check for alpha channel
  const imageHasAlpha = hasAlpha(srcImageData)
  let upscaledAlpha: Uint8ClampedArray | null = null
  if (imageHasAlpha) {
    onProgress?.('inference', 0, 'Processing transparency...')
    upscaledAlpha = upscaleAlpha(sourceCanvas, outW, outH)
  }

  // Load model and create session
  onProgress?.('inference', 0, 'Loading AI model...')
  let session: ort.InferenceSession
  try {
    session = await getSession(model, onProgress)
  } catch (err) {
    throw new Error(
      `UPSCALE_MODEL_LOAD_FAILED: ${err instanceof Error ? err.message : String(err)}`,
    )
  }

  // Determine tiling parameters
  const useTiling = Math.max(srcW, srcH) > model.tileThreshold
  const isWebGPU = typeof navigator !== 'undefined' && 'gpu' in navigator
  const tileSize = useTiling ? (isWebGPU ? 128 : 64) : Math.max(srcW, srcH)
  const overlap = useTiling ? 12 : 0

  // Create output canvas
  const outCanvas = document.createElement('canvas')
  outCanvas.width = outW
  outCanvas.height = outH
  const outCtx = outCanvas.getContext('2d')!

  if (useTiling) {
    // ── Tiled processing ──
    const tiles = calculateTiles(srcW, srcH, tileSize, overlap, scale)
    const totalTiles = tiles.length

    onProgress?.('inference', 0, `Processing ${totalTiles} tiles...`)

    for (let i = 0; i < totalTiles; i++) {
      const tile = tiles[i]

      // Validate tile core dimensions to avoid zero/negative draws
      if (tile.dw <= 0 || tile.dh <= 0) {
        throw new Error(
          `UPSCALE_TILE_INVALID: Tile ${i + 1}/${totalTiles} has invalid core size ` +
            `${tile.dw}×${tile.dh} at position (${tile.sx}, ${tile.sy}).`,
        )
      }

      // Extract tile region from source
      const tileCanvas = document.createElement('canvas')
      tileCanvas.width = tile.sw
      tileCanvas.height = tile.sh
      const tileCtx = tileCanvas.getContext('2d', { willReadFrequently: true })!
      const tileImageData = tileCtx.createImageData(tile.sw, tile.sh)

      // Copy pixels from source
      const srcData = srcImageData.data
      const tileData = tileImageData.data
      for (let row = 0; row < tile.sh; row++) {
        const srcOffset = ((tile.sy + row) * srcW + tile.sx) * 4
        const dstOffset = row * tile.sw * 4
        const length = tile.sw * 4
        tileData.set(srcData.subarray(srcOffset, srcOffset + length), dstOffset)
      }

      // Run inference on this tile
      let tileResult: Uint8ClampedArray
      try {
        tileResult = await runInference(session, tile.sw, tile.sh, tileImageData, upscaledAlpha ? true : false)
      } catch (err) {
        throw new Error(
          `UPSCALE_INFERENCE_FAILED: Tile ${i + 1}/${totalTiles} (${sizeStr(tile.sw, tile.sh)}) failed. ` +
            (err instanceof Error ? err.message : String(err)),
        )
      }

      // Calculate the core region in the tile output (excluding overlap)
      const coreOffsetX = tile.sx > 0 ? overlap : 0
      const coreOffsetY = tile.sy > 0 ? overlap : 0
      const coreW = Math.floor(tile.dw / scale)
      const coreH = Math.floor(tile.dh / scale)

      // Create a temp canvas for the tile output
      const tileOutCanvas = document.createElement('canvas')
      tileOutCanvas.width = tile.sw * scale
      tileOutCanvas.height = tile.sh * scale
      const tileOutCtx = tileOutCanvas.getContext('2d')!

      try {
        const tileOutImageData = tileOutCtx.createImageData(tile.sw * scale, tile.sh * scale)
        tileOutImageData.data.set(tileResult)
        tileOutCtx.putImageData(tileOutImageData, 0, 0)
      } catch (err) {
        throw new Error(
          `UPSCALE_TILE_OUTPUT_FAILED: Could not create tile ${i + 1} output canvas (${sizeStr(tile.sw * scale, tile.sh * scale)}). ` +
            (err instanceof Error ? err.message : String(err)),
        )
      }

      // Draw the core region onto the output canvas
      try {
        outCtx.drawImage(
          tileOutCanvas,
          coreOffsetX * scale, coreOffsetY * scale, // source x, y
          coreW * scale, coreH * scale,              // source w, h
          tile.dx, tile.dy,                          // dest x, y
          coreW * scale, coreH * scale,              // dest w, h
        )
      } catch (err) {
        throw new Error(
          `UPSCALE_TILE_DRAW_FAILED: Could not composite tile ${i + 1} onto output. ` +
            (err instanceof Error ? err.message : String(err)),
        )
      }

      // Update progress
      const pct = ((i + 1) / totalTiles) * 100
      onProgress?.('inference', pct, `Processing tile ${i + 1}/${totalTiles}...`)

      // Yield to UI thread
      await new Promise((r) => setTimeout(r, 0))
    }
  } else {
    // ── Whole image processing ──
    onProgress?.('inference', 10, 'Running AI inference...')
    let result: Uint8ClampedArray
    try {
      result = await runInference(session, srcW, srcH, srcImageData, imageHasAlpha)
    } catch (err) {
      throw new Error(
        `UPSCALE_INFERENCE_FAILED: ${err instanceof Error ? err.message : String(err)}`,
      )
    }

    try {
      const outImageData = outCtx.createImageData(outW, outH)
      outImageData.data.set(result)
      outCtx.putImageData(outImageData, 0, 0)
    } catch (err) {
      throw new Error(
        `UPSCALE_OUTPUT_FAILED: Could not create output canvas (${sizeStr(outW, outH)}). ` +
          (err instanceof Error ? err.message : String(err)),
      )
    }
  }

  // Apply upscaled alpha if needed
  if (upscaledAlpha) {
    onProgress?.('inference', 95, 'Applying transparency...')
    const finalData = outCtx.getImageData(0, 0, outW, outH)
    for (let i = 3; i < finalData.data.length; i += 4) {
      finalData.data[i] = upscaledAlpha[i]
    }
    outCtx.putImageData(finalData, 0, 0)
  }

  onProgress?.('done', 100, 'Upscaling complete')

  return { canvas: outCanvas, width: outW, height: outH }
}

// ── ORT Inference ────────────────────────────────────────────────────

/**
 * Run ORT inference on a single tile or whole image.
 * Returns RGBA Uint8ClampedArray.
 */
async function runInference(
  session: ort.InferenceSession,
  width: number,
  height: number,
  imageData: ImageData,
  _hasAlpha: boolean,
): Promise<Uint8ClampedArray> {
  // Prepare input tensor [1, 3, H, W]
  const inputData = rgbaToNCHW(imageData)
  const inputTensor = new ort.Tensor('float32', inputData, [1, 3, height, width])

  // Run inference
  const feeds: Record<string, ort.Tensor> = {}
  feeds[session.inputNames[0]] = inputTensor
  const results = await session.run(feeds)

  // Extract output tensor [1, 3, H*scale, W*scale]
  const output = results[session.outputNames[0]]
  const outData = output.data as Float32Array
  const outW = output.dims[3] as number
  const outH = output.dims[2] as number

  // Convert back to RGBA
  return nchwToRGBA(outData, outW, outH)
}

// ── Cleanup ──────────────────────────────────────────────────────────

/** Release all cached ORT sessions to free memory */
export function releaseSessions() {
  for (const session of sessionCache.values()) {
    session.release()
  }
  sessionCache.clear()
}

/** Check if WebGPU is available */
export function hasWebGPU(): boolean {
  return typeof navigator !== 'undefined' && 'gpu' in navigator
}
