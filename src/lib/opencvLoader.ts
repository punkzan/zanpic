/**
 * OpenCV.js dynamic loader — singleton Promise pattern.
 *
 * Loads OpenCV.js from CDN at runtime (not bundled), polls for wasm runtime
 * readiness, and resolves with the global `cv` object.
 *
 * GrabCut is the key algorithm used for interactive brush-based cutout:
 *   cv.grabCut(img, mask, rect, bgdModel, fgdModel, iterCount, mode)
 *
 * Mask values:
 *   cv.GC_BGD     = 0  (definite background)
 *   cv.GC_FGD     = 1  (definite foreground)
 *   cv.GC_PR_BGD  = 2  (probable background)
 *   cv.GC_PR_FGD  = 3  (probable foreground)
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

const OPENCV_CDN = 'https://docs.opencv.org/4.10.0/opencv.js'

let cvPromise: Promise<any> | null = null

/**
 * Load OpenCV.js and resolve with the `cv` global.
 * Subsequent calls return the cached promise.
 */
export function loadOpenCV(): Promise<any> {
  // Already loaded?
  const existing = (window as any).cv
  if (existing && existing.Mat) {
    return Promise.resolve(existing)
  }

  // In-flight?
  if (cvPromise) return cvPromise

  cvPromise = new Promise<any>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = OPENCV_CDN
    script.async = true
    script.onload = () => {
      // Poll for runtime readiness — cv.Mat may not be available immediately
      const cv = (window as any).cv
      if (!cv) {
        reject(new Error('OpenCV.js loaded but cv object not found'))
        return
      }

      // Some builds support onRuntimeInitialized callback
      if (cv.Mat) {
        resolve(cv)
        return
      }

      if (typeof cv.onRuntimeInitialized === 'function') {
        const orig = cv.onRuntimeInitialized
        cv.onRuntimeInitialized = () => {
          orig?.()
          resolve(cv)
        }
      }

      // Fallback: poll every 100ms for up to 30 seconds
      let elapsed = 0
      const interval = setInterval(() => {
        if (cv.Mat) {
          clearInterval(interval)
          resolve(cv)
        } else if ((elapsed += 100) > 30000) {
          clearInterval(interval)
          reject(new Error('OpenCV.js runtime initialization timed out'))
        }
      }, 100)
    }
    script.onerror = () => {
      cvPromise = null // allow retry
      reject(new Error('Failed to load OpenCV.js from CDN'))
    }
    document.head.appendChild(script)
  })

  return cvPromise
}

/** Type helper for OpenCV.js grabCut mask constants. */
export const GC = {
  BGD: 0,
  FGD: 1,
  PR_BGD: 2,
  PR_FGD: 3,
} as const
