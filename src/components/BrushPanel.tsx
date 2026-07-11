import { useEffect, useState } from 'react'
import { Brush, Eraser, Trash2, X, Sparkles } from 'lucide-react'
import { useEditorStore, type BrushMode } from '../store/editorStore'
import { brushMask } from '../lib/brushMask'
import { canvasManager } from '../lib/canvasManager'
import { useTranslation } from 'react-i18next'

export function BrushPanel() {
  const { t } = useTranslation()
  const brushActive = useEditorStore((s) => s.brushActive)
  const setBrushActive = useEditorStore((s) => s.setBrushActive)
  const brushMode = useEditorStore((s) => s.brushMode)
  const setBrushMode = useEditorStore((s) => s.setBrushMode)
  const brushSize = useEditorStore((s) => s.brushSize)
  const setBrushSize = useEditorStore((s) => s.setBrushSize)
  const setCutout = useEditorStore((s) => s.setCutout)
  const [hasPaint, setHasPaint] = useState(false)

  // Sync brush mode/size to the engine
  useEffect(() => {
    brushMask.setBrushMode(brushMode)
  }, [brushMode])

  useEffect(() => {
    brushMask.setBrushSize(brushSize)
  }, [brushSize])

  // Poll for paint state (lightweight, 150ms interval)
  useEffect(() => {
    if (!brushActive) return
    const interval = setInterval(() => {
      setHasPaint(brushMask.hasFgPaint())
    }, 150)
    return () => clearInterval(interval)
  }, [brushActive])

  // Keyboard shortcuts
  useEffect(() => {
    if (!brushActive) return
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return

      if (e.key === 'Escape') {
        e.preventDefault()
        handleCancel()
      } else if (e.key === 'Enter') {
        e.preventDefault()
        handleApply()
      } else if (e.key === '1') {
        setBrushMode('foreground')
      } else if (e.key === '2') {
        setBrushMode('background')
      } else if (e.key === '3') {
        setBrushMode('erase')
      } else if (e.key === '[') {
        setBrushSize(Math.max(5, brushSize - 5))
      } else if (e.key === ']') {
        setBrushSize(Math.min(120, brushSize + 5))
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [brushActive, brushSize])

  const handleCancel = () => {
    canvasManager.exitBrushMode()
    setBrushActive(false)
  }

  const handleClear = () => {
    brushMask.clear()
  }

  const handleApply = async () => {
    if (!hasPaint) return

    setCutout({ active: true, phase: 'inference', progress: 0, message: t('brush.smartSegmenting') })
    setBrushActive(false) // hide panel during processing

    const success = await canvasManager.brushCutout((phase, progress, message) => {
      setCutout({ phase, progress, message })
    })

    if (success) {
      setCutout({ active: false, phase: 'done', progress: 100, message: t('brush.done') })
    } else {
      setCutout({ active: false, phase: 'error', progress: 0, message: t('brush.failed') })
    }
  }

  if (!brushActive) return null

  const modes: { mode: BrushMode; label: string; icon: React.ReactNode; color: string }[] = [
    { mode: 'foreground', label: t('brush.keep'), icon: <Brush size={16} />, color: '#22c55e' },
    { mode: 'background', label: t('brush.erase'), icon: <Brush size={16} />, color: '#ef4444' },
    { mode: 'erase', label: t('brush.eraser'), icon: <Eraser size={16} />, color: 'var(--text-secondary)' },
  ]

  return (
    <>
      {/* Semi-transparent backdrop hint */}
      <div
        className="pointer-events-none absolute inset-0 z-40"
        style={{ background: 'rgba(0,0,0,0.15)' }}
      />

      {/* Floating toolbar */}
      <div
        className="absolute bottom-6 left-1/2 z-50 -translate-x-1/2"
        style={{ animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        <div
          className="flex items-center gap-1 rounded-2xl px-3 py-2 shadow-2xl"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-color)',
            backdropFilter: 'blur(20px) saturate(180%)',
          }}
        >
          {/* Mode buttons */}
          <div className="flex items-center gap-1">
            {modes.map(({ mode, label, icon, color }) => (
              <button
                key={mode}
                onClick={() => setBrushMode(mode)}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-all"
                style={{
                  background: brushMode === mode ? `${color}20` : 'transparent',
                  color: brushMode === mode ? color : 'var(--text-secondary)',
                  border: brushMode === mode ? `1px solid ${color}40` : '1px solid transparent',
                }}
              >
                {icon}
                <span>{label}</span>
              </button>
            ))}
          </div>

          <Divider />

          {/* Brush size */}
          <div className="flex items-center gap-2 px-1">
            <span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{t('brush.size')}</span>
            <input
              type="range"
              min={5}
              max={120}
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-20 accent-[var(--accent)]"
            />
            <span className="w-7 text-[11px] tabular-nums" style={{ color: 'var(--text-tertiary)' }}>
              {brushSize}
            </span>
          </div>

          <Divider />

          {/* Actions */}
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px] font-medium transition-all"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--bg-tertiary)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
            }}
            title={t('brush.clearBrush')}
          >
            <Trash2 size={14} />
          </button>

          <button
            onClick={handleCancel}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-all"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--bg-tertiary)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
            }}
            title={t('brush.cancel')}
          >
            <X size={14} />
            <span>{t('brush.cancel')}</span>
          </button>

          <button
            onClick={handleApply}
            disabled={!hasPaint}
            className="magnetic flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-[12px] font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: hasPaint ? 'var(--accent)' : 'var(--bg-tertiary)',
            }}
            onMouseEnter={(e) => {
              if (hasPaint) e.currentTarget.style.background = 'var(--accent-hover)'
            }}
            onMouseLeave={(e) => {
              if (hasPaint) e.currentTarget.style.background = 'var(--accent)'
            }}
            title={t('brush.apply')}
          >
            <Sparkles size={14} />
            <span>{t('brush.apply')}</span>
          </button>
        </div>

        {/* Hint text */}
        <div className="mt-2 text-center">
          <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.7)' }}>
            {t('brush.hint')}
          </span>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translate(-50%, 20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </>
  )
}

function Divider() {
  return (
    <div
      className="mx-1 h-6 w-px"
      style={{ background: 'var(--border-color)' }}
    />
  )
}
