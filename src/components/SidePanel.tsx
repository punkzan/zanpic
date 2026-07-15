import { useEditorStore, type PanelType } from '../store/editorStore'
import { AdjustPanel } from './AdjustPanel'
import { FilterPanel } from './FilterPanel'
import { CropPanel } from './CropPanel'
import { IdPhotoPanel } from './IdPhotoPanel'
import { UpscalePanel } from './UpscalePanel'
import { AdSlot } from './AdSlot'
import { SlidersHorizontal, Sparkles, Crop, ContactRound, ZoomIn, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function SidePanel() {
  const { t } = useTranslation()
  const activePanel = useEditorStore((s) => s.activePanel)
  const setActivePanel = useEditorStore((s) => s.setActivePanel)

  const panelDefs: { key: PanelType; label: string; icon: typeof SlidersHorizontal }[] = [
    { key: 'adjust', label: t('sidePanel.adjust'), icon: SlidersHorizontal },
    { key: 'filter', label: t('sidePanel.filter'), icon: Sparkles },
    { key: 'crop', label: t('sidePanel.crop'), icon: Crop },
    { key: 'idphoto', label: t('sidePanel.idphoto'), icon: ContactRound },
    { key: 'upscale', label: t('sidePanel.upscale'), icon: ZoomIn },
  ]

  return (
    <aside
      className="flex w-64 shrink-0 flex-col border-l overflow-y-auto side-panel"
      style={{
        background: 'var(--bg-secondary)',
        borderColor: 'var(--border-light)',
        width: activePanel ? 256 : 0,
        opacity: activePanel ? 1 : 0,
        transition: 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease',
        overflow: activePanel ? 'auto' : 'hidden',
      }}
    >
      {!activePanel ? null : (
        <>
          {/* Tabs */}
          <div className="flex border-b" style={{ borderColor: 'var(--border-light)' }}>
            {panelDefs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActivePanel(key)}
                title={label}
                className="flex flex-1 flex-col items-center justify-center gap-1 py-3 text-[13px] font-medium transition-colors relative"
                style={{
                  color: activePanel === key ? 'var(--accent)' : 'var(--text-tertiary)',
                }}
              >
                <Icon size={20} />
                {label}
                {activePanel === key && (
                  <span
                    className="absolute bottom-0 left-1/4 right-1/4 h-px rounded-full transition-all duration-200"
                    style={{ background: 'var(--accent)' }}
                  />
                )}
              </button>
            ))}

            <button
              onClick={() => setActivePanel(null)}
              className="flex items-center justify-center px-3"
              style={{ color: 'var(--text-tertiary)' }}
              title={t('sidePanel.close')}
            >
              <X size={16} />
            </button>
          </div>

          {/* Panel content */}
          <div className="flex-1 p-4 animate-fade-in">
            {activePanel === 'adjust' && <AdjustPanel />}
            {activePanel === 'filter' && <FilterPanel />}
            {activePanel === 'crop' && <CropPanel />}
            {activePanel === 'idphoto' && <IdPhotoPanel />}
            {activePanel === 'upscale' && <UpscalePanel />}
          </div>

          {/* Ad slot — sidebar */}
          <div className="px-3 pb-3">
            <AdSlot platform="google" slot="sidebar" className="w-full" />
          </div>
        </>
      )}
    </aside>
  )
}
