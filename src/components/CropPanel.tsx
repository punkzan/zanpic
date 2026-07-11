import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useEditorStore, type CropRatio } from '../store/editorStore'
import { canvasManager } from '../lib/canvasManager'
import { Crop, Check, X } from 'lucide-react'

const ratios: { value: CropRatio; label: string }[] = [
  { value: 'free', label: '' },
  { value: '1:1', label: '1:1' },
  { value: '4:3', label: '4:3' },
  { value: '3:4', label: '3:4' },
  { value: '16:9', label: '16:9' },
  { value: '9:16', label: '9:16' },
  { value: '3:2', label: '3:2' },
]

export function CropPanel() {
  const { t } = useTranslation()
  const cropActive = useEditorStore((s) => s.cropActive)
  const setCropActive = useEditorStore((s) => s.setCropActive)
  const cropRatio = useEditorStore((s) => s.cropRatio)
  const setCropRatio = useEditorStore((s) => s.setCropRatio)

  // Cleanup crop mode when panel unmounts (user switches panels)
  useEffect(() => {
    return () => {
      if (canvasManager.getIsCropMode()) {
        canvasManager.exitCropMode()
      }
    }
  }, [])

  const handleEnterCrop = () => {
    canvasManager.enterCropMode(cropRatio)
    setCropActive(true)
  }

  const handleCancel = () => {
    canvasManager.exitCropMode()
    setCropActive(false)
  }

  const handleApply = () => {
    canvasManager.applyCrop()
    setCropActive(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-[13px] font-medium" style={{ color: 'var(--text-primary)' }}>
        {t('crop.title')}
      </h3>

      {!cropActive ? (
        <>
          {/* Ratio picker */}
          <div className="flex flex-wrap gap-1.5">
            {ratios.map((r) => (
              <button
                key={r.value}
                onClick={() => setCropRatio(r.value)}
                className="rounded-lg px-3 py-1.5 text-[12px] transition-all duration-200"
                style={{
                  background: cropRatio === r.value ? 'var(--accent-bg)' : 'var(--bg-secondary)',
                  color: cropRatio === r.value ? 'var(--accent)' : 'var(--text-secondary)',
                  border: cropRatio === r.value
                    ? '1px solid var(--accent)'
                    : '1px solid var(--border-light)',
                }}
              >
                {r.value === 'free' ? t('crop.free') : r.label}
              </button>
            ))}
          </div>

          {/* Enter crop button */}
          <button
            onClick={handleEnterCrop}
            className="magnetic flex items-center justify-center gap-2 rounded-lg py-2.5 text-[13px] font-medium transition-colors"
            style={{ background: 'var(--accent)', color: '#fff' }}
          >
            <Crop size={15} />
            {t('crop.start')}
          </button>
        </>
      ) : (
        <>
          <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
            {t('crop.hint')}
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-[13px] font-medium transition-colors"
              style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
            >
              <X size={15} />
              {t('crop.cancel')}
            </button>
            <button
              onClick={handleApply}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-[13px] font-medium transition-colors"
              style={{ background: 'var(--accent)', color: '#fff' }}
            >
              <Check size={15} />
              {t('crop.confirm')}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
