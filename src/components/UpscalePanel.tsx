import { useState } from 'react'
import { useEditorStore } from '../store/editorStore'
import { canvasManager } from '../lib/canvasManager'
import { UPSCALE_MODELS, hasWebGPU, type UpscalePhase } from '../lib/upscaler'
import { ZoomIn, Download, Check, Loader2, AlertCircle, Cpu, Zap } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function UpscalePanel() {
  const { t } = useTranslation()
  const upscale = useEditorStore((s) => s.upscale)
  const setUpscale = useEditorStore((s) => s.setUpscale)
  const hasImage = useEditorStore((s) => s.hasImage)

  const [applied, setApplied] = useState(false)

  const handleUpscale = async () => {
    const c = canvasManager.getCanvas()
    if (!c) return

    setApplied(false)
    setUpscale({
      active: true,
      phase: 'download',
      progress: 0,
      message: t('upscale.preparing'),
      resultUrl: null,
      resultWidth: 0,
      resultHeight: 0,
    })

    const success = await canvasManager.upscaleImage(
      upscale.selectedModel,
      (phase: UpscalePhase, progress: number, message: string) => {
        setUpscale({ phase, progress, message })
      },
    )

    if (success) {
      // Get the result from canvas
      const size = canvasManager.getCanvasSize()
      const dataUrl = canvasManager.exportImage('png', 1, 1)
      setUpscale({
        active: false,
        phase: 'done',
        progress: 100,
        message: t('upscale.done'),
        resultUrl: dataUrl,
        resultWidth: size?.width || 0,
        resultHeight: size?.height || 0,
      })
    } else {
      setUpscale({
        active: false,
        phase: 'error',
        progress: 0,
        message: t('upscale.failed'),
      })
    }
  }

  const handleApply = () => {
    // Image is already loaded on canvas by canvasManager.upscaleImage()
    setApplied(true)
    setTimeout(() => setApplied(false), 2000)
  }

  const handleDownload = () => {
    if (!upscale.resultUrl) return
    const a = document.createElement('a')
    a.href = upscale.resultUrl
    a.download = `zanpic_upscaled_${upscale.resultWidth}x${upscale.resultHeight}.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const isProcessing = upscale.active
  const webgpu = hasWebGPU()

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-[13px] font-medium" style={{ color: 'var(--text-primary)' }}>
        {t('upscale.title')}
      </h3>

      {/* Backend indicator */}
      <div
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-[11px]"
        style={{
          background: webgpu ? 'rgba(34, 197, 94, 0.08)' : 'rgba(245, 158, 11, 0.08)',
          border: `1px solid ${webgpu ? 'rgba(34, 197, 94, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`,
        }}
      >
        {webgpu ? (
          <Zap size={14} style={{ color: '#22c55e' }} />
        ) : (
          <Cpu size={14} style={{ color: '#f59e0b' }} />
        )}
        <span style={{ color: 'var(--text-secondary)' }}>
          {webgpu ? t('upscale.webgpuReady') : t('upscale.wasmMode')}
        </span>
      </div>

      {/* Model selection */}
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-medium" style={{ color: 'var(--text-tertiary)' }}>
          {t('upscale.model')}
        </span>
        <div className="flex gap-1.5">
          {UPSCALE_MODELS.map((model) => (
            <button
              key={model.id}
              onClick={() => setUpscale({ selectedModel: model.id, selectedScale: model.scale })}
              disabled={isProcessing}
              className="flex-1 flex flex-col items-center gap-0.5 rounded-lg py-2 transition-all duration-200 disabled:opacity-50"
              style={{
                background: upscale.selectedModel === model.id ? 'var(--accent-bg)' : 'var(--bg-secondary)',
                border: upscale.selectedModel === model.id
                  ? '1px solid var(--accent)'
                  : '1px solid var(--border-light)',
              }}
            >
              <span
                className="text-[14px] font-bold"
                style={{
                  color: upscale.selectedModel === model.id ? 'var(--accent)' : 'var(--text-secondary)',
                }}
              >
                {model.scale}x
              </span>
              <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
                {model.sizeHint}
              </span>
            </button>
          ))}
        </div>
        <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
          {upscale.selectedModel === 'realesrgan-x4'
            ? t('upscale.x4Desc')
            : t('upscale.x2Desc')}
        </span>
      </div>

      {/* First-use hint */}
      {hasImage && !isProcessing && !upscale.resultUrl && (
        <div
          className="flex items-start gap-2 rounded-lg px-3 py-2.5 text-[11px] leading-relaxed"
          style={{
            background: 'rgba(99, 102, 241, 0.06)',
            border: '1px solid rgba(99, 102, 241, 0.15)',
            color: 'var(--text-secondary)',
          }}
        >
          <span style={{ fontSize: '13px', lineHeight: '16px', flexShrink: 0 }}>&#8505;</span>
          <span>{t('upscale.firstUseHint')}</span>
        </div>
      )}

      {/* Progress bar */}
      {isProcessing && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Loader2 size={14} className="animate-spin" style={{ color: 'var(--accent)' }} />
            <span className="text-[12px]" style={{ color: 'var(--text-secondary)' }}>
              {upscale.message}
            </span>
          </div>
          <div
            className="h-2 rounded-full overflow-hidden"
            style={{ background: 'var(--bg-tertiary)' }}
          >
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${upscale.progress}%`,
                background: 'var(--accent)',
              }}
            />
          </div>
          <span className="text-[10px] text-right" style={{ color: 'var(--text-tertiary)' }}>
            {upscale.progress.toFixed(0)}%
          </span>
        </div>
      )}

      {/* Upscale button */}
      <button
        onClick={handleUpscale}
        disabled={!hasImage || isProcessing}
        className="magnetic flex items-center justify-center gap-2 rounded-lg py-2.5 text-[13px] font-medium transition-colors disabled:opacity-35 disabled:cursor-not-allowed"
        style={{ background: 'var(--accent)', color: '#fff' }}
      >
        {isProcessing ? (
          <Loader2 size={15} className="animate-spin" />
        ) : (
          <ZoomIn size={15} />
        )}
        {isProcessing ? t('upscale.processing') : t('upscale.start')}
      </button>

      {!hasImage && (
        <p className="text-[11px] text-center" style={{ color: 'var(--text-tertiary)' }}>
          {t('upscale.pleaseImport')}
        </p>
      )}

      {/* Result preview */}
      {upscale.resultUrl && !isProcessing && (
        <div className="flex flex-col gap-3 mt-2 pt-3" style={{ borderTop: '1px solid var(--border-light)' }}>
          <span className="text-[11px] font-medium" style={{ color: 'var(--text-tertiary)' }}>
            {t('upscale.resultLabel', { w: upscale.resultWidth, h: upscale.resultHeight })}
          </span>
          <div
            className="flex justify-center rounded-xl p-4"
            style={{
              background: 'var(--bg-tertiary)',
              backgroundImage:
                'linear-gradient(45deg, var(--border-light) 25%, transparent 25%), ' +
                'linear-gradient(-45deg, var(--border-light) 25%, transparent 25%), ' +
                'linear-gradient(45deg, transparent 75%, var(--border-light) 75%), ' +
                'linear-gradient(-45deg, transparent 75%, var(--border-light) 75%)',
              backgroundSize: '16px 16px',
              backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
            }}
          >
            <img
              src={upscale.resultUrl}
              alt={t('upscale.resultAlt')}
              className="rounded shadow-lg"
              style={{
                maxHeight: 240,
                objectFit: 'contain',
              }}
            />
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleApply}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-[12px] font-medium transition-colors"
              style={{
                background: applied ? 'rgba(34, 197, 94, 0.1)' : 'var(--accent)',
                color: applied ? '#22c55e' : '#fff',
                border: applied ? '1px solid rgba(34, 197, 94, 0.3)' : 'none',
              }}
            >
              {applied ? <Check size={14} /> : <Check size={14} />}
              {applied ? t('upscale.applied') : t('upscale.applyToCanvas')}
            </button>
            <button
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-[12px] font-medium transition-colors"
              style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border-light)' }}
            >
              <Download size={14} />
              {t('upscale.download')}
            </button>
          </div>
        </div>
      )}

      {/* Error message */}
      {upscale.phase === 'error' && !isProcessing && (
        <div
          className="flex items-start gap-2 rounded-lg p-3 text-[12px]"
          style={{
            background: 'rgba(239, 68, 68, 0.08)',
            color: '#ef4444',
            border: '1px solid rgba(239, 68, 68, 0.2)',
          }}
        >
          <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>{upscale.message}</span>
        </div>
      )}
    </div>
  )
}
