import { useTranslation } from 'react-i18next'
import { useEditorStore } from '../store/editorStore'
import { canvasManager } from '../lib/canvasManager'
import { Sun, Contrast, Droplets, RotateCcw } from 'lucide-react'

type SliderDef = {
  key: 'brightness' | 'contrast' | 'saturation'
  icon: typeof Sun
  label: string
}

const sliders: SliderDef[] = [
  { key: 'brightness', icon: Sun, label: 'adjust.brightness' },
  { key: 'contrast', icon: Contrast, label: 'adjust.contrast' },
  { key: 'saturation', icon: Droplets, label: 'adjust.saturation' },
]

export function AdjustPanel() {
  const { t } = useTranslation()
  const adjustValues = useEditorStore((s) => s.adjustValues)
  const setAdjustValues = useEditorStore((s) => s.setAdjustValues)
  const resetAdjustValues = useEditorStore((s) => s.resetAdjustValues)

  const handleChange = (key: SliderDef['key'], value: number) => {
    const newValues = { ...adjustValues, [key]: value }
    setAdjustValues({ [key]: value })
    canvasManager.applyAdjustments(newValues.brightness, newValues.contrast, newValues.saturation)
  }

  const handleReset = () => {
    resetAdjustValues()
    canvasManager.applyAdjustments(0, 0, 0)
    canvasManager.resetFilters()
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h3 className="text-[13px] font-medium" style={{ color: 'var(--text-primary)' }}>
          {t('adjust.title')}
        </h3>
        <button
          onClick={handleReset}
          className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] transition-colors duration-200"
          style={{ color: 'var(--text-tertiary)', background: 'var(--bg-secondary)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--text-primary)'
            e.currentTarget.style.background = 'var(--bg-tertiary)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-tertiary)'
            e.currentTarget.style.background = 'var(--bg-secondary)'
          }}
        >
          <RotateCcw size={12} />
          {t('adjust.reset')}
        </button>
      </div>

      {sliders.map(({ key, icon: Icon, label }) => (
        <div key={key} className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
              <Icon size={14} />
              <span className="text-[12px]">{t(label)}</span>
            </div>
            <span
              className="min-w-[36px] text-right text-[11px] tabular-nums font-medium rounded-full px-2 py-px"
              style={{
                color: adjustValues[key] === 0 ? 'var(--text-tertiary)' : 'var(--accent)',
                background: adjustValues[key] === 0 ? 'transparent' : 'var(--accent-bg)',
              }}
            >
              {adjustValues[key] > 0 ? '+' : ''}{Math.round(adjustValues[key] * 100)}
            </span>
          </div>
          <input
            type="range"
            min={-1}
            max={1}
            step={0.05}
            value={adjustValues[key]}
            onChange={(e) => handleChange(key, parseFloat(e.target.value))}
            className="slider-track"
            style={{
              background: `linear-gradient(to right, var(--bg-tertiary) 0%, var(--accent) ${(adjustValues[key] + 1) * 50}%, var(--bg-tertiary) ${(adjustValues[key] + 1) * 50}%)`,
            }}
          />
        </div>
      ))}
    </div>
  )
}
