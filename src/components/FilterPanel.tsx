import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { canvasManager, CanvasManager } from '../lib/canvasManager'
import {
  Image, Sun, Moon, Droplets, Contrast,
  Waves, CircleDot, Sparkles,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  grayscale: CircleDot,
  sepia: Sun,
  warm: Sun,
  cool: Moon,
  vivid: Sparkles,
  fade: Waves,
  sharpen: Contrast,
  blur: Droplets,
  invert: Image,
}

const filterKeyMap: Record<string, string> = {
  grayscale: 'filter.grayscale',
  sepia: 'filter.vintage',
  warm: 'filter.warm',
  cool: 'filter.cool',
  vivid: 'filter.vivid',
  fade: 'filter.faded',
  sharpen: 'filter.sharpen',
  blur: 'filter.blur',
  invert: 'filter.invert',
}

export function FilterPanel() {
  const { t } = useTranslation()
  const [activeName, setActiveName] = useState<string | null>(null)
  const presets = CanvasManager.presets

  const handleApply = (preset: (typeof presets)[number]) => {
    if (activeName === preset.name) {
      // Tap again = reset to original
      canvasManager.clearPresets()
      setActiveName(null)
    } else {
      canvasManager.applyPreset(preset)
      setActiveName(preset.name)
    }
  }

  const handleReset = () => {
    canvasManager.clearPresets()
    setActiveName(null)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[13px] font-medium" style={{ color: 'var(--text-primary)' }}>
          {t('filter.title')}
        </h3>
        <button
          onClick={handleReset}
          disabled={!activeName}
          className="rounded-md px-2 py-1 text-[11px] transition-colors disabled:opacity-30"
          style={{ color: 'var(--text-tertiary)', background: 'var(--bg-secondary)' }}
        >
          {t('filter.original')}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {presets.map((preset) => {
          const Icon = iconMap[preset.name] || Image
          const isActive = activeName === preset.name

          return (
            <button
              key={preset.name}
              onClick={() => handleApply(preset)}
              className="magnetic flex flex-col items-center justify-center gap-1 rounded-xl py-3 px-2 transition-all duration-200"
              style={{
                background: isActive ? 'var(--accent-bg)' : 'var(--bg-secondary)',
                border: isActive
                  ? '1px solid var(--accent)'
                  : '1px solid var(--border-light)',
                color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
              }}
            >
              <Icon size={18} />
              <span className="text-[11px] leading-none">{t(filterKeyMap[preset.name] || preset.name)}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
