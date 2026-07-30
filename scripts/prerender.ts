/**
 * Build-time pre-rendering script for SEO.
 *
 * After `vite build`, this script reads the SPA's index.html template and
 * creates static HTML files for each content route with injected SEO content:
 *   - page-specific <title> and <meta> tags
 *   - JSON-LD structured data
 *   - visible HTML fallback for crawlers (noscript + seo-fallback)
 *
 * Vercel serves these static files directly (filesystem > rewrites priority),
 * so Googlebot gets fully-rendered content on the first crawl.
 */

import * as fs from 'node:fs'
import * as path from 'node:path'
import {
  STATIC_PAGES_SEO,
  BLOG_POSTS_SEO,
  TOOL_PAGES_SEO,
  SITE_URL,
  BRAND,
  buildMetaTags,
  buildJsonLdScript,
  buildBlogPostJsonLd,
} from '../src/seo/seo-data.js'

const DIST_DIR = path.resolve(import.meta.dirname, '..', 'dist')
const TEMPLATE_PATH = path.join(DIST_DIR, 'index.html')

// ── helpers ──

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

function readTemplate(): string {
  if (!fs.existsSync(TEMPLATE_PATH)) {
    console.error(`ERROR: template not found at ${TEMPLATE_PATH}`)
    console.error('Did you run "vite build" first?')
    process.exit(1)
  }
  return fs.readFileSync(TEMPLATE_PATH, 'utf-8')
}

/**
 * Replace the SPA shell's default <title> with page-specific one,
 * and inject SEO meta / JSON-LD / noscript content.
 */
function injectSEO(template: string, options: {
  title: string
  description: string
  canonicalPath: string
  ogType?: string
  jsonLd?: object | object[]
  noscriptHtml?: string
}): string {
  let html = template

  // 1. Replace <title>...</title>
  html = html.replace(
    /<title>[\s\S]*?<\/title>/,
    `<title>${escapeHtml(options.title)}</title>`,
  )

  // 2. Replace existing meta tags and inject page-specific ones
  const metaBlock = buildMetaTags({
    path: options.canonicalPath,
    title: options.title,
    description: options.description,
    ogType: options.ogType,
  })
  // Strip <title> from metaBlock since title is already replaced above.
  // We only need the <meta> and <link> tags.
  const metaBlockSansTitle = metaBlock.replace(/<title>[\s\S]*?<\/title>\n?/, '')

  // Remove old meta tags that we're replacing (title already done above)
  html = html.replace(/<meta name="description"[^>]*>\s*/g, '')
  html = html.replace(/<meta name="keywords"[^>]*>\s*/g, '')
  html = html.replace(/<meta name="author"[^>]*>\s*/g, '')
  html = html.replace(/<meta name="robots"[^>]*>\s*/g, '')
  html = html.replace(/<meta property="og:title"[^>]*>\s*/g, '')
  html = html.replace(/<meta property="og:description"[^>]*>\s*/g, '')
  html = html.replace(/<meta property="og:type"[^>]*>\s*/g, '')
  html = html.replace(/<meta property="og:url"[^>]*>\s*/g, '')
  html = html.replace(/<meta property="og:site_name"[^>]*>\s*/g, '')
  html = html.replace(/<meta name="twitter:card"[^>]*>\s*/g, '')
  html = html.replace(/<meta name="twitter:title"[^>]*>\s*/g, '')
  html = html.replace(/<meta name="twitter:description"[^>]*>\s*/g, '')
  html = html.replace(/<link rel="canonical"[^>]*>\s*/g, '')

  // Insert new meta tags after charset — use RegExp for $1 backreference
  html = html.replace(
    /(<meta charset="UTF-8" \/>)/,
    `$1\n  ${metaBlockSansTitle.trim()}`,
  )

  // 3. Inject JSON-LD
  if (options.jsonLd) {
    const jsonLdScript = buildJsonLdScript(options.jsonLd)
    html = html.replace('</head>', `  ${jsonLdScript}\n</head>`)
  }

  // 4. Inject visible fallback before <div id="root">
  if (options.noscriptHtml) {
    const fallbackHtml = options.noscriptHtml.trim()
    html = html.replace(
      '<div id="root"></div>',
      `${fallbackHtml}\n    <div id="root"></div>`,
    )
  }

  return html
}

// ── main ──

function main() {
  const template = readTemplate()
  let count = 0

  // --- Static content pages ---
  for (const page of STATIC_PAGES_SEO) {
    const html = injectSEO(template, {
      title: page.title,
      description: page.description,
      canonicalPath: page.path,
      ogType: page.ogType,
      jsonLd: page.jsonLd,
      noscriptHtml: page.noscriptHtml,
    })

    const dir = path.join(DIST_DIR, ...page.path.split('/').filter(Boolean))
    ensureDir(dir)
    fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf-8')
    console.log(`  ✓ ${page.path}`)
    count++
  }

  // --- Tool landing pages ---
  for (const page of TOOL_PAGES_SEO) {
    const html = injectSEO(template, {
      title: page.title,
      description: page.description,
      canonicalPath: page.path,
      ogType: page.ogType,
      jsonLd: page.jsonLd,
      noscriptHtml: page.noscriptHtml,
    })

    const dir = path.join(DIST_DIR, ...page.path.split('/').filter(Boolean))
    ensureDir(dir)
    fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf-8')
    console.log(`  ✓ ${page.path}`)
    count++
  }

  // --- Blog post pages ---
  for (const post of BLOG_POSTS_SEO) {
    const postPath = `/blog/${post.slug}`
    const postTitle = `${post.title} - ${BRAND}`
    const jsonLd = buildBlogPostJsonLd(post)

    // Generate a simple noscript teaser for the blog post
    const noscriptHtml = `
<div id="seo-fallback" style="max-width:768px;margin:0 auto;padding:24px 20px;font-family:sans-serif;color:#333;line-height:1.8">
  <p style="display:inline-block;padding:2px 10px;background:#e8f0fe;border-radius:4px;font-size:12px;color:#1a73e8;margin-bottom:12px">${escapeHtml(post.category)}</p>
  <p style="font-size:13px;color:#888;margin-bottom:8px">${post.date}</p>
  <h1 style="font-size:22px;font-weight:700;margin-bottom:16px;line-height:1.3">${escapeHtml(post.title)}</h1>
  <p style="color:#555">${escapeHtml(post.excerpt)}</p>
  <p style="margin-top:20px"><a href="${SITE_URL}" style="color:#1a73e8">${BRAND} - 免费在线图片编辑器</a></p>
</div>`

    const html = injectSEO(template, {
      title: postTitle,
      description: post.excerpt,
      canonicalPath: postPath,
      ogType: 'article',
      jsonLd,
      noscriptHtml,
    })

    const dir = path.join(DIST_DIR, 'blog', post.slug)
    ensureDir(dir)
    fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf-8')
    console.log(`  ✓ ${postPath}`)
    count++
  }

  console.log(`\n  → Pre-rendered ${count} pages (${STATIC_PAGES_SEO.length} static + ${TOOL_PAGES_SEO.length} tools + ${BLOG_POSTS_SEO.length} blog posts)`)
}

// ── run ──

try {
  main()
} catch (err) {
  console.error('Pre-render failed:', err)
  process.exit(1)
}

// ── utility ──

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
