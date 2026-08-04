import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

export type SeoLang = 'zh' | 'en'

/**
 * Detect the SEO language from the URL pathname.
 * /zh/... routes serve Chinese content, everything else serves English (default).
 */
export function useSeoLang(): SeoLang {
  const { pathname } = useLocation()
  return useMemo(() => {
    if (pathname === '/zh' || pathname.startsWith('/zh/')) return 'zh'
    return 'en'
  }, [pathname])
}

/**
 * Non-hook version for use outside React components (e.g. data helpers, prerender).
 */
export function getSeoLangFromPath(path: string): SeoLang {
  if (path === '/zh' || path.startsWith('/zh/')) return 'zh'
  return 'en'
}
