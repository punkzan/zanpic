import { useState, useMemo, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, Image, FileDown } from 'lucide-react'
import { useEditorStore } from '../store/editorStore'
import { canvasManager } from '../lib/canvasManager'
import { downloadDataURL, formatBytes } from '../lib/utils'
import { useTranslation } from 'react-i18next'

type CompressFormat = 'jpeg' | 'webp'

export function CompressDialog({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation()
  const hasImage = useEditorStore((s) => s.hasImage)

  const [format, setFormat] = useState<CompressFormat>('webp')
  const [quality, setQuality] = useState(0.7)
  const [maxWidth, setMaxWidth] = useState('')
  const [maxHeight, setMaxHeight] = useState('')
  const [exporting, setExporting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const size = canvasManager.getCanvasSize()

  // Calculate effective multiplier from max dimensions
  const effectiveMultiplier = useMemo(() => {
    if (!size) return 1
    let scale = 1
    if (maxWidth && Number(maxWidth) > 0) {
      scale = Math.min(scale, Number(maxWidth) / size.width)
    }
    if (maxHeight && Number(maxHeight) > 0) {
      scale = Math.min(scale, Number(maxHeight) / size.height)
    }
    return Math.min(scale, 1)
  }, [size, maxWidth, maxHeight])

  const outputDims = useMemo(() => {
    if (!size) return null
    return {
      width: Math.round(size.width * effectiveMultiplier),
      height: Math.round(size.height * effectiveMultiplier),
    }
  }, [size, effectiveMultiplier])

  // File size estimates
  const estimatedSize = useMemo(() => {
    if (!outputDims) return null
    const px = outputDims.width * outputDims.height
    const coeff = format === 'webp' ? 0.35 : 0.6
    return px * quality * coeff
  }, [outputDims, format, quality])

  const originalEstimate = useMemo(() => {
    if (!size) return null
    return size.width * size.height * 1.5 // PNG estimate
  }, [size])

  const compressionRatio = useMemo(() => {
    if (!originalEstimate || !estimatedSize) return null
    if (estimatedSize === 0) return 0
    return Math.round((1 - estimatedSize / originalEstimate) * 100)
  }, [originalEstimate, estimatedSize])

  const handleExport = () => {
    setError(null)
    setExporting(true)
    try {
      const ext = format === 'webp' ? 'webp' : 'jpg'
      const dataUrl = canvasManager.exportImage(format, quality, effectiveMultiplier)
      if (!dataUrl) {
        setError(t('compress.failed'))
        setExporting(false)
        return
      }
      downloadDataURL(dataUrl, `zan-pic-compressed-${Date.now()}.${ext}`)
      setExporting(false)
      onClose()
    } catch (err) {
      setError(t('compress.failedWithError', { error: err instanceof Error ? err.message : String(err) }))
      setExporting(false)
    }
  }

  if (!hasImage || !size) {
    return (
      <DialogShell onClose={onClose} title={t('compress.title')}>
        <p className="text-center py-8 text-[14px]" style={{ color: 'var(--text-tertiary)' }}>
          {t('compress.pleaseImport')}
        </p>
      </DialogShell>
    )
  }

  return (
    <DialogShell onClose={onClose} title={t('compress.title')}>
      {/* Format */}
      <div className="mb-4">
        <label className="block mb-1.5 text-[12px] font-medium" style={{ color: 'var(--text-secondary)' }}>{t('compress.outputFormat')}</label>
        <div className="flex gap-2">
          {([
            { key: 'webp' as CompressFormat, label: 'WebP', desc: 'compress.webpDesc' },
            { key: 'jpeg' as CompressFormat, label: 'JPEG', desc: 'compress.jpegDesc' },
          ]).map(({ key, label, desc }) => (
            <button
              key={key}
              onClick={() => setFormat(key)}
              className="flex-1 flex flex-col items-center gap-0.5 rounded-lg py-2.5 transition-colors"
              style={{
                background: format === key ? 'var(--accent)' : 'var(--bg-tertiary)',
                color: format === key ? '#fff' : 'var(--text-secondary)',
              }}
            >
              <span className="text-[13px] font-medium">{label}</span>
              <span className="text-[10px] opacity-70" style={{ color: format === key ? 'rgba(255,255,255,0.7)' : 'var(--text-tertiary)' }}>{t(desc)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quality */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[12px] font-medium" style={{ color: 'var(--text-secondary)' }}>{t('compress.quality')}</label>
          <span className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>{Math.round(quality * 100)}%</span>
        </div>
        <input
          type="range" min={0.1} max={1} step={0.01} value={quality}
          onChange={(e) => setQuality(Number(e.target.value))}
          className="w-full" style={{ accentColor: 'var(--accent)' }}
        />
        <div className="flex gap-1 mt-1">
          {[0.3, 0.5, 0.7, 0.9].map((q) => (
            <button
              key={q}
              onClick={() => setQuality(q)}
              className="text-[10px] rounded px-1.5 py-0.5"
              style={{
                background: Math.abs(quality - q) < 0.005 ? 'var(--accent-bg)' : 'transparent',
                color: Math.abs(quality - q) < 0.005 ? 'var(--accent)' : 'var(--text-tertiary)',
                border: Math.abs(quality - q) < 0.005 ? '1px solid var(--accent)' : '1px solid transparent',
              }}
            >
              {Math.round(q * 100)}%
            </button>
          ))}
        </div>
      </div>

      {/* Max dimensions */}
      <div className="mb-4">
        <label className="block mb-1.5 text-[12px] font-medium" style={{ color: 'var(--text-secondary)' }}>{t('compress.maxSize')}</label>
        <div className="flex items-center gap-2">
          <input
            type="number" value={maxWidth} onChange={(e) => setMaxWidth(e.target.value)}
            placeholder={t('compress.widthPlaceholder', { w: size.width })} min={1} max={10000}
            className="flex-1 rounded-lg px-3 py-2 text-[13px]"
            style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-light)', outline: 'none' }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent)' }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-light)' }}
          />
          <span className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>×</span>
          <input
            type="number" value={maxHeight} onChange={(e) => setMaxHeight(e.target.value)}
            placeholder={t('compress.heightPlaceholder', { h: size.height })} min={1} max={10000}
            className="flex-1 rounded-lg px-3 py-2 text-[13px]"
            style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-light)', outline: 'none' }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent)' }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-light)' }}
          />
        </div>
      </div>

      {/* Output preview */}
      {outputDims && (
        <div className="mb-4 rounded-lg p-3" style={{ background: 'var(--bg-tertiary)' }}>
          <div className="flex items-center gap-2 mb-1">
            <Image size={15} style={{ color: 'var(--text-tertiary)' }} />
            <span className="text-[12px] font-medium" style={{ color: 'var(--text-primary)' }}>
              {outputDims.width} × {outputDims.height} px
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>
              {format === 'webp' ? 'WebP' : 'JPEG'}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            {estimatedSize && (
              <span className="text-[12px]" style={{ color: 'var(--text-secondary)' }}>
                {t('compress.estimated', { size: formatBytes(estimatedSize) })}
              </span>
            )}
            {compressionRatio !== null && compressionRatio > 0 && (
              <span className="text-[11px]" style={{ color: '#16a34a' }}>
                {t('compress.reduced', { ratio: compressionRatio })}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-3 rounded-lg p-2.5 text-[12px]" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
          {error}
        </div>
      )}

      {/* Export */}
      <div className="flex gap-2.5 mt-5">
        <button
          onClick={onClose}
          className="flex-1 rounded-lg py-3 text-[14px] font-medium transition-colors"
          style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-secondary)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-tertiary)' }}
        >
          {t('compress.cancel')}
        </button>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="magnetic flex flex-1 items-center justify-center gap-2 rounded-lg py-3 text-[15px] font-semibold transition-all duration-200 disabled:opacity-60"
          style={{ background: 'var(--accent)', color: '#fff' }}
        >
          <FileDown size={18} />
          {exporting ? t('compress.processing') : t('compress.download')}
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
