import { useState, useMemo, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, Download, Image, ArrowRight } from 'lucide-react'
import { useEditorStore } from '../store/editorStore'
import { canvasManager } from '../lib/canvasManager'
import { downloadDataURL, formatBytes } from '../lib/utils'
import { useTranslation } from 'react-i18next'

type ConvFormat = 'png' | 'jpeg' | 'webp' | 'avif'

interface FormatDef {
  label: string
  ext: string
  mime: string
  hasQuality: boolean
  desc: string
}

const FORMATS: Record<ConvFormat, FormatDef> = {
  png: { label: 'PNG', ext: 'png', mime: 'image/png', hasQuality: false, desc: 'convert.pngDesc' },
  jpeg: { label: 'JPEG', ext: 'jpg', mime: 'image/jpeg', hasQuality: true, desc: 'convert.jpegDesc' },
  webp: { label: 'WebP', ext: 'webp', mime: 'image/webp', hasQuality: true, desc: 'convert.webpDesc' },
  avif: { label: 'AVIF', ext: 'avif', mime: 'image/avif', hasQuality: true, desc: 'convert.avifDesc' },
}

export function FormatConvertDialog({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation()
  const hasImage = useEditorStore((s) => s.hasImage)
  const [fromFormat, setFromFormat] = useState<ConvFormat>('png')
  const [toFormat, setToFormat] = useState<ConvFormat>('webp')
  const [quality, setQuality] = useState(0.85)
  const [exporting, setExporting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const toDef = FORMATS[toFormat]
  const size = canvasManager.getCanvasSize()

  const estSize = useMemo(() => {
    if (!size) return null
    const px = size.width * size.height
    switch (toFormat) {
      case 'png': return px * 1.5
      case 'jpeg': return px * quality * 0.5
      case 'webp': return px * quality * 0.3
      case 'avif': return px * quality * 0.2
    }
  }, [size, toFormat, quality])

  const handleExport = async () => {
    setError(null)
    setExporting(true)

    try {
      const canvas = canvasManager.getCanvas()
      if (!canvas) throw new Error('Canvas not ready')

      const multiplier = 1

      // For AVIF: use HTMLCanvasElement native support (Chrome 85+, Firefox 93+)
      if (toFormat === 'avif') {
        const active = canvas.getActiveObject()
        if (active) canvas.discardActiveObject()
        canvas.renderAll()

        const imgCanvas = canvas.toCanvasElement(multiplier) as HTMLCanvasElement
        const dataUrl = imgCanvas.toDataURL(toDef.mime, quality)

        if (active) { canvas.setActiveObject(active); canvas.renderAll() }

        downloadDataURL(dataUrl, `zan-pic-${Date.now()}.${toDef.ext}`)
      } else {
        // PNG/JPEG/WebP via Fabric's built-in
        const fmt = toFormat === 'jpeg' ? 'jpeg' : toFormat as 'png' | 'webp'
        const dataUrl = canvasManager.exportImage(
          fmt,
          toDef.hasQuality ? quality : 1,
          multiplier,
        )
        if (!dataUrl) throw new Error('Export failed')
        downloadDataURL(dataUrl, `zan-pic-${Date.now()}.${toDef.ext}`)
      }

      setTimeout(() => onClose(), 300)
    } catch (err) {
      setError(t('convert.failedWithError', { error: err instanceof Error ? err.message : String(err) }))
    } finally {
      setExporting(false)
    }
  }

  if (!hasImage || !size) {
    return (
      <DialogShell onClose={onClose} title={t('convert.title')}>
        <p className="text-center py-8 text-[14px]" style={{ color: 'var(--text-tertiary)' }}>
          {t('convert.pleaseImport')}
        </p>
      </DialogShell>
    )
  }

  return (
    <DialogShell onClose={onClose} title={t('convert.title')}>
      {/* Source format (informational) */}
      <div className="mb-4">
        <label className="block mb-1.5 text-[12px] font-medium" style={{ color: 'var(--text-secondary)' }}>{t('convert.currentFormat')}</label>
        <div className="flex gap-2">
          {(['png', 'jpeg', 'webp'] as ConvFormat[]).map((f) => (
            <button
              key={f}
              onClick={() => setFromFormat(f)}
              className="flex-1 rounded-lg py-2 text-[13px] font-medium transition-colors"
              style={{
                background: fromFormat === f ? 'var(--accent)' : 'var(--bg-tertiary)',
                color: fromFormat === f ? '#fff' : 'var(--text-secondary)',
              }}
            >
              {FORMATS[f].label}
            </button>
          ))}
        </div>
      </div>

      {/* Arrow */}
      <div className="flex justify-center mb-4">
        <ArrowRight size={20} style={{ color: 'var(--accent)' }} />
      </div>

      {/* Target format */}
      <div className="mb-4">
        <label className="block mb-1.5 text-[12px] font-medium" style={{ color: 'var(--text-secondary)' }}>{t('convert.targetFormat')}</label>
        <div className="flex gap-2">
          {(Object.entries(FORMATS) as [ConvFormat, FormatDef][]).map(([key, def]) => (
            <button
              key={key}
              onClick={() => setToFormat(key)}
              className="flex-1 flex flex-col items-center gap-0.5 rounded-lg py-2.5 transition-colors"
              style={{
                background: toFormat === key ? 'var(--accent)' : 'var(--bg-tertiary)',
                color: toFormat === key ? '#fff' : 'var(--text-secondary)',
              }}
            >
              <span className="text-[13px] font-medium">{def.label}</span>
              <span className="text-[9px] opacity-70" style={{ color: toFormat === key ? 'rgba(255,255,255,0.7)' : 'var(--text-tertiary)' }}>{t(def.desc)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quality (lossy formats) */}
      {toDef.hasQuality && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[12px] font-medium" style={{ color: 'var(--text-secondary)' }}>{t('convert.quality')}</label>
            <span className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>{Math.round(quality * 100)}%</span>
          </div>
          <input
            type="range" min={0.1} max={1} step={0.01} value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="w-full" style={{ accentColor: 'var(--accent)' }}
          />
        </div>
      )}

      {/* Preview */}
      <div className="mb-4 rounded-lg p-3" style={{ background: 'var(--bg-tertiary)' }}>
        <div className="flex items-center gap-2">
          <Image size={15} style={{ color: 'var(--text-tertiary)' }} />
          <span className="text-[12px] font-medium" style={{ color: 'var(--text-primary)' }}>
            {size.width} × {size.height} px
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>
            {toDef.label}
          </span>
          {estSize && (
            <span className="text-[12px]" style={{ color: 'var(--text-secondary)' }}>
              {t('convert.estimated', { size: formatBytes(estSize) })}
            </span>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-3 rounded-lg p-2.5 text-[12px]" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
          {error}
        </div>
      )}

      {/* Convert button */}
      <div className="flex gap-2.5 mt-5">
        <button
          onClick={onClose}
          className="flex-1 rounded-lg py-3 text-[14px] font-medium transition-colors"
          style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-secondary)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-tertiary)' }}
        >
          {t('convert.cancel')}
        </button>
        <button
          onClick={handleExport}
          disabled={exporting || fromFormat === toFormat}
          className="magnetic flex flex-1 items-center justify-center gap-2 rounded-lg py-3 text-[15px] font-semibold transition-all duration-200 disabled:opacity-60"
          style={{ background: fromFormat === toFormat ? 'var(--bg-tertiary)' : 'var(--accent)', color: fromFormat === toFormat ? 'var(--text-tertiary)' : '#fff' }}
        >
          <Download size={18} />
          {exporting ? t('convert.converting') : fromFormat === toFormat ? t('convert.sameFormat') : t('convert.convertBtn', { format: toDef.label })}
        </button>
      </div>
    </DialogShell>
  )
}

function DialogShell({ onClose, title, children }: { onClose: () => void; title: string; children: React.ReactNode }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="glass relative w-[460px] rounded-2xl p-6 max-h-[88vh] overflow-y-auto"
        style={{ boxShadow: 'var(--shadow-lg)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</h2>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-tertiary)'; e.currentTarget.style.color = 'var(--text-primary)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)' }}
          >
            <X size={17} />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  )
}
