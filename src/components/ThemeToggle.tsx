import { Sun, Moon } from 'lucide-react'
import { useEditorStore } from '../store/editorStore'
import { useTranslation } from 'react-i18next'

export function ThemeToggle() {
  const { t } = useTranslation()
  const theme = useEditorStore((s) => s.theme)
  const toggleTheme = useEditorStore((s) => s.toggleTheme)

  return (
    <button
      onClick={toggleTheme}
      className="magnetic flex items-center justify-center rounded-lg"
      style={{
        width: 36,
        height: 36,
        color: 'var(--text-secondary)',
        background: 'transparent',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--bg-tertiary)'
        e.currentTarget.style.color = 'var(--text-primary)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent'
        e.currentTarget.style.color = 'var(--text-secondary)'
      }}
      title={theme === 'light' ? t('theme.toDark') : t('theme.toLight')}
    >
      {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  )
}
