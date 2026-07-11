import { useEditorStore } from '../store/editorStore'
import { ContactRound, Loader2, CheckCircle2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const PHASE_LABEL_KEYS: Record<string, string> = {
  cutout: 'idphoto.aiCutout',
  analyze: 'idphoto.faceDetect',
  crop: 'idphoto.smartCrop',
  background: 'idphoto.bgReplace',
  output: 'idphoto.specOutput',
  done: 'idphoto.done',
  error: 'idphoto.failed',
}

const PHASE_STEPS = ['cutout', 'analyze', 'crop', 'background', 'output']

export function IdPhotoOverlay() {
  const idPhoto = useEditorStore((s) => s.idPhoto)
  const { t } = useTranslation()

  if (!idPhoto.active) return null

  const currentStepIndex = PHASE_STEPS.indexOf(idPhoto.phase)

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
          minWidth: 380,
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
            <ContactRound size={26} color="#fff" strokeWidth={2} />
          </div>
          <h3 className="text-[16px] font-semibold" style={{ color: 'var(--text-primary)' }}>
            {t('idphoto.overlayTitle')}
          </h3>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-1 w-full justify-between px-2">
          {PHASE_STEPS.map((step, i) => {
            const isDone = currentStepIndex > i
            const isCurrent = currentStepIndex === i
            return (
              <div key={step} className="flex items-center gap-1 flex-1">
                <div
                  className="flex items-center justify-center rounded-full transition-all duration-300"
                  style={{
                    width: 24,
                    height: 24,
                    minWidth: 24,
                    background: isDone
                      ? 'var(--accent)'
                      : isCurrent
                        ? 'var(--accent-bg)'
                        : 'var(--bg-tertiary)',
                    border: isCurrent ? '2px solid var(--accent)' : '2px solid transparent',
                  }}
                >
                  {isDone ? (
                    <CheckCircle2 size={14} color="#fff" />
                  ) : isCurrent ? (
                    <Loader2 size={12} className="animate-spin" style={{ color: 'var(--accent)' }} />
                  ) : (
                    <span className="text-[10px] font-medium" style={{ color: 'var(--text-tertiary)' }}>
                      {i + 1}
                    </span>
                  )}
                </div>
                {i < PHASE_STEPS.length - 1 && (
                  <div
                    className="h-px flex-1 transition-all duration-300"
                    style={{
                      background: isDone ? 'var(--accent)' : 'var(--border-light)',
                    }}
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* Current phase label */}
        <div className="flex items-center gap-2.5">
          <Loader2 size={16} className="animate-spin" style={{ color: 'var(--accent)' }} />
          <span className="text-[13px] font-medium" style={{ color: 'var(--text-secondary)' }}>
            {t(PHASE_LABEL_KEYS[idPhoto.phase] || 'idphoto.preparing')}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full">
          <div
            className="h-2 w-full overflow-hidden rounded-full"
            style={{ background: 'var(--bg-tertiary)' }}
          >
            <div
              className="h-full rounded-full transition-all duration-300 ease-out"
              style={{
                width: `${idPhoto.progress}%`,
                background: 'var(--accent)',
              }}
            />
          </div>
          <div className="mt-1.5 flex justify-between">
            <span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
              {idPhoto.message}
            </span>
            <span className="text-[11px] font-medium" style={{ color: 'var(--text-tertiary)' }}>
              {idPhoto.progress}%
            </span>
          </div>
        </div>

        {/* Tip */}
        {idPhoto.phase === 'cutout' && idPhoto.progress < 35 && (
          <p className="text-[11px] text-center" style={{ color: 'var(--text-tertiary)' }}>
            {t('cutout.firstUseHint')}
          </p>
        )}
      </div>
    </div>
  )
}
