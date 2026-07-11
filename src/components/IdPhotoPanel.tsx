import { useEditorStore } from '../store/editorStore'
import { canvasManager } from '../lib/canvasManager'
import { ID_PHOTO_SPECS, BG_COLORS, generateIdPhoto } from '../lib/idPhoto'
import { ContactRound, Download, Image as ImageIcon, Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function IdPhotoPanel() {
  const { t } = useTranslation()
  const idPhoto = useEditorStore((s) => s.idPhoto)
  const setIdPhoto = useEditorStore((s) => s.setIdPhoto)
  const hasImage = useEditorStore((s) => s.hasImage)

  const handleGenerate = async () => {
    const c = canvasManager.getCanvas()
    if (!c) return

    // Exit any active mode
    if (canvasManager.getIsCropMode()) canvasManager.exitCropMode()
    if (canvasManager.getIsBrushMode()) canvasManager.exitBrushMode()

    // Deselect active object
    const active = c.getActiveObject()
    if (active) c.discardActiveObject()
    c.renderAll()

    // Get source canvas
    const sourceCanvas = c.toCanvasElement(1)
    const spec = ID_PHOTO_SPECS.find((s) => s.id === idPhoto.selectedSpec)!
    const bg = BG_COLORS.find((b) => b.id === idPhoto.selectedBg)!

    setIdPhoto({
      active: true,
      phase: 'cutout',
      progress: 0,
      message: t('idphoto.preparing'),
      resultUrl: null,
      printLayoutUrl: null,
    })

    try {
      const result = await generateIdPhoto(
        sourceCanvas,
        spec,
        bg,
        { printLayout: idPhoto.wantPrint },
        (phase, progress, message) => {
          setIdPhoto({ phase, progress, message })
        },
      )

      setIdPhoto({
        active: false,
        phase: 'done',
        progress: 100,
        message: t('idphoto.done'),
        resultUrl: result.dataUrl,
        resultWidth: result.width,
        resultHeight: result.height,
        printLayoutUrl: result.printLayoutUrl ?? null,
      })
    } catch (err) {
      console.error('[IdPhotoPanel] generate failed:', err)
      setIdPhoto({
        active: false,
        phase: 'error',
        progress: 0,
        message: err instanceof Error ? err.message : t('idphoto.failed'),
      })
    }
  }

  const handleDownload = (url: string, name: string) => {
    const a = document.createElement('a')
    a.href = url
    a.download = name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const selectedSpec = ID_PHOTO_SPECS.find((s) => s.id === idPhoto.selectedSpec)!
  const isProcessing = idPhoto.active
  const specName = t(`idphoto.spec_${selectedSpec.id}`)
  const bgName = t(`idphoto.bg_${idPhoto.selectedBg}`)

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-[13px] font-medium" style={{ color: 'var(--text-primary)' }}>
        {t('idphoto.title')}
      </h3>

      {/* Spec selection */}
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-medium" style={{ color: 'var(--text-tertiary)' }}>
          {t('idphoto.spec')}
        </span>
        <div className="flex gap-1.5">
          {ID_PHOTO_SPECS.map((spec) => (
            <button
              key={spec.id}
              onClick={() => setIdPhoto({ selectedSpec: spec.id })}
              disabled={isProcessing}
              className="flex-1 flex flex-col items-center gap-0.5 rounded-lg py-2 transition-all duration-200 disabled:opacity-50"
              style={{
                background: idPhoto.selectedSpec === spec.id ? 'var(--accent-bg)' : 'var(--bg-secondary)',
                border: idPhoto.selectedSpec === spec.id
                  ? '1px solid var(--accent)'
                  : '1px solid var(--border-light)',
              }}
            >
              <span
                className="text-[12px] font-medium"
                style={{
                  color: idPhoto.selectedSpec === spec.id ? 'var(--accent)' : 'var(--text-secondary)',
                }}
              >
                {t(`idphoto.spec_${spec.id}`)}
              </span>
              <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
                {spec.width}×{spec.height}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Background color */}
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-medium" style={{ color: 'var(--text-tertiary)' }}>
          {t('idphoto.background')}
        </span>
        <div className="flex gap-2">
          {BG_COLORS.map((bg) => (
            <button
              key={bg.id}
              onClick={() => setIdPhoto({ selectedBg: bg.id })}
              disabled={isProcessing}
              className="relative flex items-center gap-2 rounded-lg px-3 py-2 transition-all duration-200 disabled:opacity-50"
              style={{
                background: idPhoto.selectedBg === bg.id ? 'var(--accent-bg)' : 'var(--bg-secondary)',
                border: idPhoto.selectedBg === bg.id
                  ? '1px solid var(--accent)'
                  : '1px solid var(--border-light)',
              }}
            >
              <span
                className="block rounded-full"
                style={{
                  width: 20,
                  height: 20,
                  background: bg.hex,
                  border: '1px solid rgba(0,0,0,0.1)',
                }}
              />
              <span
                className="text-[12px] font-medium"
                style={{
                  color: idPhoto.selectedBg === bg.id ? 'var(--accent)' : 'var(--text-secondary)',
                }}
              >
                {t(`idphoto.bg_${bg.id}`)}
              </span>
              {idPhoto.selectedBg === bg.id && (
                <Check size={14} style={{ color: 'var(--accent)' }} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Print layout option */}
      <label
        className="flex items-center gap-2 cursor-pointer select-none"
        style={{ opacity: isProcessing ? 0.5 : 1 }}
      >
        <input
          type="checkbox"
          checked={idPhoto.wantPrint}
          onChange={(e) => setIdPhoto({ wantPrint: e.target.checked })}
          disabled={isProcessing}
          className="rounded"
          style={{ accentColor: 'var(--accent)' }}
        />
        <span className="text-[12px]" style={{ color: 'var(--text-secondary)' }}>
          {t('idphoto.layoutOption', { n: selectedSpec.id === '2inch' ? 4 : 8 })}
        </span>
      </label>

      {/* Tip */}
      {hasImage && !isProcessing && (
        <div
          className="flex items-start gap-2 rounded-lg px-3 py-2.5 text-[11px] leading-relaxed"
          style={{
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.2)',
            color: 'var(--text-secondary)',
          }}
        >
          <span style={{ fontSize: '13px', lineHeight: '16px', flexShrink: 0 }}>&#9888;</span>
          <span>
            {t('idphoto.uploadHint')}
          </span>
        </div>
      )}

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={!hasImage || isProcessing}
        className="magnetic flex items-center justify-center gap-2 rounded-lg py-2.5 text-[13px] font-medium transition-colors disabled:opacity-35 disabled:cursor-not-allowed"
        style={{ background: 'var(--accent)', color: '#fff' }}
      >
        <ContactRound size={15} />
        {isProcessing ? t('idphoto.generating') : t('idphoto.generate')}
      </button>

      {!hasImage && (
        <p className="text-[11px] text-center" style={{ color: 'var(--text-tertiary)' }}>
          {t('idphoto.pleaseImport')}
        </p>
      )}

      {/* Result preview */}
      {idPhoto.resultUrl && !isProcessing && (
        <div className="flex flex-col gap-3 mt-2 pt-3" style={{ borderTop: '1px solid var(--border-light)' }}>
          <span className="text-[11px] font-medium" style={{ color: 'var(--text-tertiary)' }}>
            {t('idphoto.previewLabel', { w: idPhoto.resultWidth, h: idPhoto.resultHeight })}
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
              src={idPhoto.resultUrl}
              alt={t('idphoto.photoAlt')}
              className="rounded shadow-lg"
              style={{
                maxHeight: 240,
                objectFit: 'contain',
              }}
            />
          </div>

          {/* Download buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => handleDownload(idPhoto.resultUrl!, t('idphoto.fileName', { spec: specName, bg: bgName }))}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-[12px] font-medium transition-colors"
              style={{ background: 'var(--accent)', color: '#fff' }}
            >
              <Download size={14} />
              {t('idphoto.downloadPhoto')}
            </button>
            {idPhoto.printLayoutUrl && (
              <button
                onClick={() => handleDownload(idPhoto.printLayoutUrl!, t('idphoto.layoutFileName', { spec: specName }))}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-[12px] font-medium transition-colors"
                style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border-light)' }}
              >
                <ImageIcon size={14} />
                {t('idphoto.downloadLayout')}
              </button>
            )}
          </div>

          {/* Print layout preview */}
          {idPhoto.printLayoutUrl && (
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-medium" style={{ color: 'var(--text-tertiary)' }}>
                {t('idphoto.layoutPreview')}
              </span>
              <div
                className="flex justify-center rounded-lg p-2"
                style={{ background: 'var(--bg-tertiary)' }}
              >
                <img
                  src={idPhoto.printLayoutUrl}
                  alt={t('idphoto.layoutAlt')}
                  className="rounded shadow"
                  style={{ maxHeight: 160, objectFit: 'contain' }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error message */}
      {idPhoto.phase === 'error' && !isProcessing && (
        <div
          className="rounded-lg p-3 text-[12px] text-center"
          style={{
            background: 'rgba(239, 68, 68, 0.08)',
            color: '#ef4444',
            border: '1px solid rgba(239, 68, 68, 0.2)',
          }}
        >
          {idPhoto.message}
        </div>
      )}
    </div>
  )
}
