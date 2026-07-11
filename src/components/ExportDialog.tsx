import { useState, useMemo } from 'react'
import { X, Download, AlertCircle, Image } from 'lucide-react'
import { useEditorStore } from '../store/editorStore'
import { canvasManager } from '../lib/canvasManager'
import { downloadDataURL, formatBytes } from '../lib/utils'
import { useTranslation } from 'react-i18next'

type ExportFormat = 'png' | 'jpeg' | 'webp' | 'avif'

interface FormatInfo {
  label: string
  desc: string
  hasQuality: boolean
  ext: string
}

const FORMAT_INFO: Record<ExportFormat, FormatInfo> = {
  png: {
    label: 'PNG',
    desc: 'export.pngDesc',
    hasQuality: false,
    ext: 'png',
  },
  jpeg: {
    label: 'JPG',
    desc: 'export.jpegDesc',
    hasQuality: true,
    ext: 'jpg',
  },
  webp: {
    label: 'WebP',
    desc: 'export.webpDesc',
    hasQuality: true,
    ext: 'webp',
  },
  avif: {
    label: 'AVIF',
    desc: 'export.avifDesc',
    hasQuality: true,
    ext: 'avif',
  },
}

export function ExportDialog() {
  const { t } = useTranslation()
  const setExportOpen = useEditorStore((s) => s.setExportOpen)
  const [format, setFormat] = useState<ExportFormat>('png')
  const [quality, setQuality] = useState(0.92)
  const [multiplier, setMultiplier] = useState(1)
  const [customWidth, setCustomWidth] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)

  // Compute effective multiplier from custom width input
  const effectiveMultiplier = useMemo(() => {
    if (customWidth && customWidth !== '') {
      const size = canvasManager.getCanvasSize()
      if (size) {
        const parsed = parseInt(customWidth, 10)
        if (parsed > 0) return parsed / size.width
      }
    }
    return multiplier
  }, [customWidth, multiplier])

  // Compute output dimensions for preview
  const outputDims = useMemo(() => {
    const size = canvasManager.getCanvasSize()
    if (!size) return null
    const m = effectiveMultiplier
    return { width: Math.round(size.width * m), height: Math.round(size.height * m) }
  }, [effectiveMultiplier])

  // Rough file size estimate
  const estimatedSize = useMemo(() => {
    if (!outputDims) return null
    const px = outputDims.width * outputDims.height
    // Very rough estimates based on format
    switch (format) {
      case 'png': return px * 1.5 // ~12 bits per pixel compressed
      case 'jpeg': return px * quality * 0.6
      case 'webp': return px * quality * 0.35
      case 'avif': return px * quality * 0.22
    }
  }, [outputDims, format, quality])

  const fi = FORMAT_INFO[format]

  const handleExport = () => {
    setError(null)
    setExporting(true)

    try {
      if (format === 'avif') {
        // AVIF via HTMLCanvasElement native support
        const canvas = canvasManager.getCanvas()
        if (!canvas) throw new Error('Canvas not ready')
        const active = canvas.getActiveObject()
        if (active) canvas.discardActiveObject()
        canvas.renderAll()
        const imgCanvas = canvas.toCanvasElement(effectiveMultiplier) as HTMLCanvasElement
        const dataUrl = imgCanvas.toDataURL('image/avif', quality)
        if (active) { canvas.setActiveObject(active); canvas.renderAll() }
        downloadDataURL(dataUrl, `zan-pic-${Date.now()}.avif`)
      } else {
        const dataUrl = canvasManager.exportImage(
          format as 'png' | 'jpeg' | 'webp',
          format === 'png' ? 1 : quality,
          effectiveMultiplier,
        )
        if (!dataUrl) {
          setError(t('export.failed'))
          setExporting(false)
          return
        }
        downloadDataURL(dataUrl, `zan-pic-${Date.now()}.${fi.ext}`)
      }

      setExporting(false)
      setExportOpen(false)
    } catch (err) {
      console.error('[Export] failed:', err)
      setError(t('export.failedWithError', { error: err instanceof Error ? err.message : String(err) }))
      setExporting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)' }}
      onClick={() => setExportOpen(false)}
    >
      <div
        className="glass relative w-[500px] rounded-2xl p-7"
        style={{ boxShadow: 'var(--shadow-lg)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>
            {t('export.title')}
          </h2>
          <button
            onClick={() => setExportOpen(false)}
            className="magnetic flex items-center justify-center rounded-lg"
            style={{ width: 32, height: 32, color: 'var(--text-tertiary)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--bg-tertiary)'
              e.currentTarget.style.color = 'var(--text-primary)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = 'var(--text-tertiary)'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Format */}
        <div className="mb-5">
          <label className="mb-2 block text-[12px] font-medium" style={{ color: 'var(--text-secondary)' }}>
            {t('export.format')}
          </label>
          <div className="flex gap-2">
            {(Object.entries(FORMAT_INFO) as [ExportFormat, FormatInfo][]).map(([f, info]) => (
              <button
                key={f}
                onClick={() => {
                  setFormat(f)
                  if (f === 'png') setCustomWidth('')
                }}
                className="magnetic flex-1 flex flex-col items-center gap-0.5 rounded-lg py-2.5 transition-all duration-200"
                style={
                  format === f
                    ? { background: 'var(--accent)', color: '#fff' }
                    : { background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }
                }
              >
                <span className="text-[13px] font-medium">{info.label}</span>
                <span
                  className="text-[10px] opacity-70"
                  style={{ color: format === f ? 'rgba(255,255,255,0.7)' : 'var(--text-tertiary)' }}
                >
                  {t(info.desc)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Quality (JPEG + WebP) */}
        {fi.hasQuality && (
          <div className="mb-5">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-[12px] font-medium" style={{ color: 'var(--text-secondary)' }}>
                {t('export.quality')}
              </label>
              <span className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>
                {Math.round(quality * 100)}%
              </span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0.3}
                max={1}
                step={0.01}
                value={quality}
                onChange={(e) => setQuality(parseFloat(e.target.value))}
                className="flex-1"
                style={{ accentColor: 'var(--accent)' }}
              />
              {/* Quality presets */}
              {[0.6, 0.8, 0.92, 1].map((q) => (
                <button
                  key={q}
                  onClick={() => setQuality(q)}
                  className="text-[10px] rounded px-1.5 py-0.5"
                  style={{
                    background: quality === q ? 'var(--accent-bg)' : 'transparent',
                    color: quality === q ? 'var(--accent)' : 'var(--text-tertiary)',
                    border: quality === q ? '1px solid var(--accent)' : '1px solid transparent',
                  }}
                >
                  {Math.round(q * 100)}%
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Size / Dimensions */}
        <div className="mb-5">
          <label className="mb-2 block text-[12px] font-medium" style={{ color: 'var(--text-secondary)' }}>
            {t('export.size')}
          </label>

          {/* Quick multiplier buttons */}
          <div className="flex gap-2 mb-2">
            {[1, 2, 3].map((m) => (
              <button
                key={m}
                onClick={() => { setMultiplier(m); setCustomWidth('') }}
                className="magnetic flex-1 rounded-lg py-2 text-[13px] font-medium transition-all duration-200"
                style={
                  multiplier === m && !customWidth
                    ? { background: 'var(--accent)', color: '#fff' }
                    : { background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }
                }
              >
                {m}×
              </button>
            ))}
          </div>

          {/* Custom width input */}
          <div className="flex items-center gap-2">
            <span className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>{t('export.width')}</span>
            <input
              type="number"
              value={customWidth}
              onChange={(e) => {
                setCustomWidth(e.target.value)
                if (e.target.value) setMultiplier(0) // deselect multiplier buttons
              }}
              placeholder={t('export.customWidth')}
              min={1}
              max={10000}
              className="flex-1 rounded-lg px-3 py-1.5 text-[13px]"
              style={{
                background: 'var(--bg-tertiary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-light)',
                outline: 'none',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-light)' }}
            />
            <span className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>px</span>
          </div>
        </div>

        {/* Output preview info */}
        {outputDims && (
          <div
            className="mb-5 flex items-center gap-3 rounded-lg px-4 py-3"
            style={{ background: 'var(--bg-tertiary)' }}
          >
            <Image size={16} style={{ color: 'var(--text-tertiary)' }} />
            <div className="flex-1">
              <span className="text-[12px] font-medium" style={{ color: 'var(--text-primary)' }}>
                {outputDims.width} × {outputDims.height} px
              </span>
              <span className="text-[11px] ml-2" style={{ color: 'var(--text-tertiary)' }}>
                {format.toUpperCase()}
                {estimatedSize && <span> · {t('export.estimated', { size: formatBytes(estimatedSize) })}</span>}
              </span>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div
            className="mb-4 flex items-start gap-2 rounded-lg p-3 text-[12px]"
            style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}
          >
            <AlertCircle size={16} className="mt-px shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Actions */}
        <button
          onClick={handleExport}
          disabled={exporting}
          className="magnetic flex w-full items-center justify-center gap-2 rounded-lg py-3 text-[14px] font-medium disabled:opacity-60 transition-all duration-200"
          style={{ background: 'var(--accent)', color: '#fff' }}
          onMouseEnter={(e) => {
            if (!exporting) e.currentTarget.style.background = 'var(--accent-hover)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--accent)'
          }}
        >
          <Download size={18} />
          {exporting ? t('export.exporting') : t('export.exportBtn')}
        </button>
      </div>
    </div>
  )
}
