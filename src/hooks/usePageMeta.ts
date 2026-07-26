import { useEffect } from 'react'
import { useSiteStore, type SeoSettings } from '../store/siteStore'

/**
 * Ensures a <meta> tag exists in <head> with the given attribute key/value.
 * Creates it if missing, updates content if it exists.
 */
function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  if (!content) return
  let el = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

/**
 * Upsert a <link rel="canonical"> tag.
 */
function upsertCanonical(href: string) {
  if (!href) return
  let el = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

const SITE_URL = 'https://zanpic.com'

interface PageMetaOptions {
  title?: string
  description?: string
  path?: string
  ogType?: string
}

/**
 * Per-page SEO meta hook. Falls back to site-level defaults from siteStore.
 * Pass overrides for page-specific title, description, and canonical URL.
 */
export function usePageMeta(options?: PageMetaOptions) {
  const seo: SeoSettings = useSiteStore((s) => s.seo)

  useEffect(() => {
    const title = options?.title || seo.title
    const description = options?.description || seo.description
    const canonical = options?.path ? `${SITE_URL}${options.path}` : `${SITE_URL}/`

    // <title>
    document.title = title

    // Basic meta tags
    upsertMeta('name', 'description', description)
    upsertMeta('name', 'keywords', seo.keywords)
    upsertMeta('name', 'author', seo.author)

    // Open Graph
    upsertMeta('property', 'og:title', title)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:type', options?.ogType || 'website')
    upsertMeta('property', 'og:site_name', 'Zan Pic')
    upsertMeta('property', 'og:url', canonical)
    if (seo.ogImage) {
      upsertMeta('property', 'og:image', seo.ogImage)
    }

    // Twitter Card
    upsertMeta('name', 'twitter:card', seo.ogImage ? 'summary_large_image' : 'summary')
    upsertMeta('name', 'twitter:title', title)
    upsertMeta('name', 'twitter:description', description)
    if (seo.ogImage) {
      upsertMeta('name', 'twitter:image', seo.ogImage)
    }

    // Robots
    upsertMeta('name', 'robots', 'index, follow')

    // Canonical
    upsertCanonical(canonical)
  }, [seo, options])
}
