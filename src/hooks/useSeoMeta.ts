import { useEffect } from 'react'
import { useSiteStore } from '../store/siteStore'

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
 * Hook that syncs SEO settings from siteStore into the document <head>.
 * Call once in the root App component.
 *
 * Updates: <title>, meta description, keywords, author,
 * Open Graph tags (og:title, og:description, og:image, og:type, og:site_name),
 * Twitter Card tags (twitter:card, twitter:title, twitter:description, twitter:image),
 * and canonical link.
 */
export function useSeoMeta() {
  const seo = useSiteStore((s) => s.seo)

  useEffect(() => {
    // <title>
    if (seo.title) {
      document.title = seo.title
    }

    // Basic meta tags
    upsertMeta('name', 'description', seo.description)
    upsertMeta('name', 'keywords', seo.keywords)
    upsertMeta('name', 'author', seo.author)

    // Open Graph
    upsertMeta('property', 'og:title', seo.title)
    upsertMeta('property', 'og:description', seo.description)
    upsertMeta('property', 'og:type', 'website')
    upsertMeta('property', 'og:site_name', 'Zan Pic')
    if (seo.ogImage) {
      upsertMeta('property', 'og:image', seo.ogImage)
    }

    // Twitter Card
    upsertMeta('name', 'twitter:card', seo.ogImage ? 'summary_large_image' : 'summary')
    upsertMeta('name', 'twitter:title', seo.title)
    upsertMeta('name', 'twitter:description', seo.description)
    if (seo.ogImage) {
      upsertMeta('name', 'twitter:image', seo.ogImage)
    }

    // Robots — encourage indexing
    upsertMeta('name', 'robots', 'index, follow')
  }, [seo])
}
