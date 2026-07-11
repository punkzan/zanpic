import { useEditorStore } from '../store/editorStore'
import { Wand2, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function CutoutOverlay() {
  const cutout = useEditorStore((s) => s.cutout)
  const { t } = useTranslation()

  if (!cutout.active) return null

  const phaseLabel =
    cutout.phase === 'download' ? t('cutout.downloadRuntime') :
    cutout.phase === 'inference' ? t('cutout.segmenting') :
    cutout.phase === 'error' ? t('cutout.error') : t('cutout.processing')

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(8px)' }}
    >
      <div
        className="flex flex-col items-center gap-5 rounded-2xl px-10 py-8"
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
          minWidth: 340,
        }}
      >
        {/* Icon + Title */}
        <div className="flex flex-col items-center gap-2">
          <div
            className="flex items-center justify-center rounded-xl"
            style={{
              width: 56,
              height: 56,
              background: 'var(--accent)',
            }}
          >
            {cutout.phase === 'error' ? (
              <span style={{ color: '#fff', fontSize: 24 }}>!</span>
            ) : (
              <Wand2 size={26} color="#fff" strokeWidth={2} />
            )}
          </div>
          <h3 className="text-[16px] font-semibold" style={{ color: 'var(--text-primary)' }}>
            {t('cutout.title')}
          </h3>
        </div>

        {/* Spinner + Phase */}
        <div className="flex items-center gap-2.5">
          {cutout.phase !== 'error' && (
            <Loader2 size={16} className="animate-spin" style={{ color: 'var(--accent)' }} />
          )}
          <span className="text-[13px] font-medium" style={{ color: 'var(--text-secondary)' }}>
            {phaseLabel}
          </span>
        </div>

        {/* Progress bar */}
        {cutout.phase !== 'error' && (
          <div className="w-full">
            <div
              className="h-2 w-full overflow-hidden rounded-full"
              style={{ background: 'var(--bg-tertiary)' }}
            >
              <div
                className="h-full rounded-full transition-all duration-300 ease-out"
                style={{
                  width: `${cutout.progress}%`,
                  background: 'var(--accent)',
                }}
              />
            </div>
            <div className="mt-1.5 flex justify-between">
              <span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
                {cutout.message}
              </span>
              <span className="text-[11px] font-medium" style={{ color: 'var(--text-tertiary)' }}>
                {cutout.progress}%
              </span>
            </div>
          </div>
        )}

        {/* Error message */}
        {cutout.phase === 'error' && (
          <p className="text-[13px] text-center" style={{ color: 'var(--text-secondary)' }}>
            {cutout.message || t('cutout.failed')}
          </p>
        )}

        {/* Tip */}
        {cutout.phase === 'download' && cutout.progress < 100 && (
          <p className="text-[11px] text-center" style={{ color: 'var(--text-tertiary)' }}>
            {t('cutout.firstUseHint')}
          </p>
        )}
        {cutout.phase === 'inference' && (
          <p className="text-[11px] text-center" style={{ color: 'var(--text-tertiary)' }}>
            {t('cutout.analyzing')}
          </p>
        )}
      </div>
    </div>
  )
}
