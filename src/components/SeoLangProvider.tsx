import { useEffect, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import i18n from '../i18n'

function getLangFromPath(pathname: string): string {
  if (pathname === '/zh' || pathname.startsWith('/zh/')) return 'zh'
  // For non-/zh routes, respect stored i18n preference or default to en for SEO pages
  const saved = localStorage.getItem('zanpic-lang')
  if (saved) return saved
  return 'en'
}

/**
 * Syncs the i18n language with the URL pathname.
 * /zh/* routes force Chinese; other routes restore the user's stored language
 * (defaulting to English for the SEO-optimized landing pages).
 */
export function SeoLangProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()

  useEffect(() => {
    const target = getLangFromPath(pathname)
    if (i18n.language !== target) {
      i18n.changeLanguage(target)
    }
    document.documentElement.lang = target
    document.documentElement.dir = target === 'ar' ? 'rtl' : 'ltr'
  }, [pathname])

  return <>{children}</>
}
