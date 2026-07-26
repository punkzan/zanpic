import { type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Image as ImageIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../hooks/useTheme'
import { ThemeToggle } from './ThemeToggle'
import { LanguageSwitcher } from './LanguageSwitcher'
import { Footer } from './Footer'

/**
 * Shared layout for standalone content pages (about, privacy, contact, blog).
 * Provides: header (logo + back-to-editor + theme/lang toggles), scrollable
 * content area, and footer.
 */
export function ContentLayout({ children }: { children: ReactNode }) {
  useTheme()
  const { t } = useTranslation()

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <header
        className="flex items-center justify-between border-b px-4 py-3"
        style={{
          background: 'var(--bg-secondary)',
          borderColor: 'var(--border-light)',
        }}
      >
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-[var(--accent)]"
            style={{ color: 'var(--text-secondary)' }}
          >
            <ArrowLeft size={18} />
            {t('footer.backToEditor', { defaultValue: '返回编辑器' })}
          </Link>
        </div>

        <Link to="/" className="flex items-center gap-2">
          <div
            className="flex items-center justify-center rounded-lg"
            style={{ width: 28, height: 28, background: 'var(--accent)' }}
          >
            <ImageIcon size={16} color="#fff" strokeWidth={2.2} />
          </div>
          <span className="font-medium tracking-tight" style={{ color: 'var(--text-primary)', fontSize: '15px' }}>
            Zan Pic
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="page-modal-body" style={{ maxWidth: '768px', margin: '0 auto' }}>
          {children}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
