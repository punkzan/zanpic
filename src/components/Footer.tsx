import { Link, useLocation } from 'react-router-dom'
import { useSiteStore } from '../store/siteStore'
import { Info, Shield, Mail, BookOpen, ExternalLink } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { type ReactNode } from 'react'
import { SiteDirectory } from './SiteDirectory'

const IS_MOBILE = typeof navigator !== 'undefined' && /Mobi|Android|iPhone/i.test(navigator.userAgent)

export function Footer() {
  const { t } = useTranslation()
  const location = useLocation()
  const icpFilingNumber = useSiteStore((s) => s.icpFilingNumber)
  const publicSecurityFilingNumber = useSiteStore((s) => s.publicSecurityFilingNumber)
  const companyName = useSiteStore((s) => s.companyName)
  const friendLinks = useSiteStore((s) => s.friendLinks)

  const isEditor = location.pathname === '/'
  const openInNewTab = !IS_MOBILE && isEditor

  const links: { path: string; label: string; icon: typeof Info }[] = [
    { path: '/about', label: t('footer.about'), icon: Info },
    { path: '/privacy', label: t('footer.privacy'), icon: Shield },
    { path: '/contact', label: t('footer.contact'), icon: Mail },
    { path: '/blog', label: t('footer.blog'), icon: BookOpen },
  ]

  const linkClass = 'flex items-center gap-1 transition-colors hover:text-[var(--accent)]'
  const linkStyle = { color: 'inherit', textDecoration: 'none' } as const

  function renderLink(path: string, label: string, Icon: typeof Info): ReactNode {
    if (openInNewTab) {
      return (
        <a key={path} href={path} target="_blank" rel="noopener noreferrer" className={linkClass} style={linkStyle}>
          <Icon size={16} />
          {label}
        </a>
      )
    }
    return (
      <Link key={path} to={path} className={linkClass} style={linkStyle}>
        <Icon size={16} />
        {label}
      </Link>
    )
  }

  return (
    <footer
      className="flex shrink-0 flex-col border-t px-4"
      style={{
        background: 'var(--bg-secondary)',
        borderColor: 'var(--border-light)',
        color: 'var(--text-tertiary)',
      }}
    >
      {/* Site directory — categorized links to all sitemap pages */}
      <SiteDirectory isEditor={isEditor} />

      {/* Main row: copyright + page links */}
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 py-2 text-[14px]">
        <span style={{ opacity: 0.6 }}>
          © 2026 {companyName || 'Zan Pic'}
        </span>
        {links.map(({ path, label, icon }) => renderLink(path, label, icon))}
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
