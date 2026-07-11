import { useEffect, useRef } from 'react'
import { canvasManager } from '../lib/canvasManager'
import { useEditorStore } from '../store/editorStore'

export function EditorCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const setHistory = useEditorStore((s) => s.setHistory)
  const setHasImage = useEditorStore((s) => s.setHasImage)

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return

    const container = containerRef.current
    const width = Math.min(container.clientWidth - 64, 960)
    const height = Math.min(container.clientHeight - 64, 680)

    canvasManager.init(canvasRef.current, width, height)
    canvasManager.onHistoryChange = setHistory
    canvasManager.onImageChange = setHasImage

    // Fabric.js wraps the canvas in a .canvas-container — add checkerboard bg
    const wrapper = canvasRef.current.parentElement
    wrapper?.classList.add('checkerboard', 'rounded-lg', 'shadow-lg')

    return () => {
      canvasManager.dispose()
    }
  }, [setHistory, setHasImage])

  return (
    <div
      ref={containerRef}
      className="flex flex-1 items-center justify-center overflow-auto p-8"
    >
      <canvas ref={canvasRef} />
    </div>
  )
}
