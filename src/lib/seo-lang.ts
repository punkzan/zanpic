const SITE_URL = 'https://www.superzan.net'

export type SeoLang = 'zh' | 'en'

/**
 * Build hreflang alternate links for a page.
 * English is the default (root path), Chinese is at /zh/ prefix.
 */
export function buildAlternates(path: string): { lang: string; url: string }[] {
  // Normalize path to the English (default) version
  const enPath = path.startsWith('/zh') ? path.replace(/^\/zh/, '') || '/' : path
  const zhPath = enPath === '/' ? '/zh/' : `/zh${enPath}`
  return [
    { lang: 'en', url: `${SITE_URL}${enPath}` },
    { lang: 'zh-CN', url: `${SITE_URL}${zhPath}` },
  ]
}

/**
 * Strip /zh prefix from a path to get the canonical English path.
 */
export function stripZhPrefix(path: string): string {
  if (path === '/zh' || path === '/zh/') return '/'
  if (path.startsWith('/zh/')) return path.slice(3) || '/'
  return path
}

/**
 * Add /zh prefix to an English path.
 */
export function addZhPrefix(path: string): string {
  if (path === '/') return '/zh/'
  return `/zh${path}`
}
