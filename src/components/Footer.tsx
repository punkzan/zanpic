import { useEditorStore, type PageKey } from '../store/editorStore'
import { useSiteStore } from '../store/siteStore'
import { Info, Shield, Mail, BookOpen, ExternalLink } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function Footer() {
  const { t } = useTranslation()
  const setActivePage = useEditorStore((s) => s.setActivePage)
  const icpFilingNumber = useSiteStore((s) => s.icpFilingNumber)
  const publicSecurityFilingNumber = useSiteStore((s) => s.publicSecurityFilingNumber)
  const companyName = useSiteStore((s) => s.companyName)
  const friendLinks = useSiteStore((s) => s.friendLinks)

  const links: { key: PageKey; label: string; icon: typeof Info }[] = [
    { key: 'about', label: t('footer.about'), icon: Info },
    { key: 'privacy', label: t('footer.privacy'), icon: Shield },
    { key: 'contact', label: t('footer.contact'), icon: Mail },
    { key: 'blog', label: t('footer.blog'), icon: BookOpen },
  ]

  return (
    <footer
      className="flex shrink-0 flex-col border-t px-4"
      style={{
        background: 'var(--bg-secondary)',
        borderColor: 'var(--border-light)',
        color: 'var(--text-tertiary)',
      }}
    >
      {/* Main row: copyright + page links */}
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 py-2 text-[14px]">
        <span style={{ opacity: 0.6 }}>
          © 2026 {companyName || 'Zan Pic'}
        </span>
        {links.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActivePage(key)}
            className="flex items-center gap-1 transition-colors hover:text-[var(--accent)]"
            style={{ color: 'inherit' }}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {/* ICP / 备案 row */}
      {(icpFilingNumber || publicSecurityFilingNumber) && (
        <div
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 pb-1.5 text-[13px]"
          style={{ opacity: 0.55 }}
        >
          {icpFilingNumber && (
            <a
              href="https://beian.miit.gov.cn/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-[var(--accent)]"
              style={{ color: 'inherit', textDecoration: 'none' }}
            >
              {icpFilingNumber}
            </a>
          )}
          {publicSecurityFilingNumber && (
            <span>{publicSecurityFilingNumber}</span>
          )}
        </div>
      )}

      {/* Friend links row — only show if links exist */}
      {friendLinks.length > 0 && (
        <div
          className="flex flex-wrap items-center justify-center gap-x-4 gap-y-0.5 pb-2 text-[13px]"
          style={{ opacity: 0.55 }}
        >
          <span style={{ opacity: 0.7 }}>{t('footer.friendLinks')}</span>
          {friendLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 transition-colors hover:text-[var(--accent)]"
              style={{ color: 'inherit', textDecoration: 'none' }}
            >
              {link.name}
              <ExternalLink size={10} />
            </a>
          ))}
        </div>
      )}
    </footer>
  )
}
