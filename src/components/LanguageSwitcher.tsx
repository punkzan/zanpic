import { useState, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Globe, Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { SUPPORTED_LANGUAGES } from '../i18n'
import i18nInstance from '../i18n'

export function LanguageSwitcher() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)

  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === i18nInstance.language) || SUPPORTED_LANGUAGES[1]

  const changeLang = useCallback((code: string) => {
    i18nInstance.changeLanguage(code).then(() => {
      // languageChanged event will trigger re-render via useTranslation
    }).catch((err) => {
      console.error('[i18n] Failed to change language to', code, err)
    })
    setOpen(false)
  }, [])

  // Compute dropdown position from button's bounding rect
  const getDropdownStyle = (): React.CSSProperties => {
    if (!btnRef.current) return {}
    const rect = btnRef.current.getBoundingClientRect()
    return {
      position: 'fixed',
      top: rect.bottom + 8,
      right: window.innerWidth - rect.right,
      zIndex: 9999,
    }
  }

  return (
    <div className="relative">
      <button
        ref={btnRef}
        onClick={() => setOpen(!open)}
        className="magnetic flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition-colors"
        style={{ color: 'var(--text-secondary)' }}
        title={currentLang.name}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--bg-tertiary)'
          e.currentTarget.style.color = 'var(--text-primary)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.color = 'var(--text-secondary)'
        }}
      >
        <Globe size={16} />
        <span className="hidden sm:inline">{currentLang.flag}</span>
      </button>

      {open && createPortal(
        <>
          {/* Backdrop — closes dropdown when clicking outside */}
          <div
            onClick={() => setOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 9998 }}
          />
          {/* Dropdown menu — positioned near the button */}
          <div style={getDropdownStyle()}>
            <div
              className="lang-menu"
              style={{
                minWidth: 200,
                overflow: 'hidden',
                borderRadius: 16,
                boxShadow: '0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px var(--border-color)',
                background: 'var(--bg-elevated)',
                backdropFilter: 'blur(20px) saturate(180%)',
                animation: 'dropIn 0.18s ease-out',
              }}
            >
              <div
                className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider"
                style={{ color: 'var(--text-tertiary)', borderBottom: '1px solid var(--border-color)' }}
              >
                {t('lang.label')}
              </div>
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isActive = i18nInstance.language === lang.code
                return (
                  <button
                    key={lang.code}
                    onClick={(e) => {
                      e.stopPropagation()
                      changeLang(lang.code)
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-[14px] transition-colors"
                    style={{
                      color: isActive ? 'var(--accent)' : 'var(--text-primary)',
                      background: isActive ? 'var(--accent-bg)' : 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'var(--bg-tertiary)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'transparent'
                      }
                    }}
                  >
                    <span className="text-[18px]">{lang.flag}</span>
                    <span className="flex-1">{lang.name}</span>
                    {isActive && (
                      <Check size={16} style={{ color: 'var(--accent)' }} />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </>,
        document.body,
      )}
    </div>
  )
}
