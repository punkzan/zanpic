/**
 * Shared SEO data layer.
 *
 * Used by both the build-time pre-render script (scripts/prerender.ts)
 * and the client-side usePageMeta hook to keep SEO content consistent.
 */

export const SITE_URL = 'https://www.superzan.net'
export const BRAND = 'Zan Pic'

/* ================================================================
   Types
   ================================================================ */

export interface SeoPageData {
  path: string
  title: string
  description: string
  ogType?: string
  /** Injected into <head> as <script type="application/ld+json"> */
  jsonLd?: object | object[]
  /** Visible HTML fallback for crawlers (before React hydration) */
  noscriptHtml?: string
}

/* ================================================================
   Static content pages
   ================================================================ */

export const STATIC_PAGES_SEO: SeoPageData[] = [
  {
    path: '/about',
    title: `关于我们 - ${BRAND}`,
    description: `${BRAND} 是一款纯前端图片编辑工具，所有处理均在浏览器本地完成，图片不会上传到任何服务器。我们相信，好用的图片工具不需要牺牲你的隐私。`,
    ogType: 'website',
    noscriptHtml: `
<div id="seo-fallback" style="max-width:768px;margin:0 auto;padding:24px 20px;font-family:sans-serif;color:#333;line-height:1.8">
  <h1 style="font-size:24px;font-weight:700;margin-bottom:20px">关于我们</h1>
  <p>${BRAND} 是一款纯前端图片编辑工具，所有处理均在浏览器本地完成，图片不会上传到任何服务器。我们相信，好用的图片工具不需要牺牲你的隐私。</p>
  <h3>功能一览</h3>
  <ul>
    <li>基础调整 — 亮度、对比度、饱和度三轴滑块，实时预览</li>
    <li>预设滤镜 — 黑白、复古、暖色、冷色、鲜艳、褪色、锐化、模糊等 8 种风格</li>
    <li>智能裁剪 — 自由裁剪 + 六种固定比例，支持旋转与三分线辅助</li>
    <li>AI 智能抠图 — 基于 IS-Net 模型自动识别主体，WebGPU 加速，边缘形态学精修</li>
    <li>证件照生成 — AI 抠图 + 智能裁剪 + 红白蓝背景替换，支持 1寸/2寸/小2寸及6寸排版</li>
    <li>图片压缩 — 质量滑块 + 尺寸约束 + 文件大小预估</li>
    <li>格式转换 — PNG / JPEG / WebP / AVIF 互转</li>
    <li>自定义水印 — 文字水印或图片水印，8 种位置自由选择</li>
    <li>多格式导出 — PNG / JPEG / WebP / AVIF，质量与尺寸可控</li>
  </ul>
  <p style="margin-top:20px;padding:16px;background:#f5f5f5;border-radius:8px">无需注册，无需安装，打开即用。你的图片始终留在你的设备上。</p>
</div>`,
  },
  {
    path: '/privacy',
    title: `隐私政策 - ${BRAND}`,
    description: '简而言之：您的图片永远不会离开您的设备。',
    ogType: 'website',
    noscriptHtml: `
<div id="seo-fallback" style="max-width:768px;margin:0 auto;padding:24px 20px;font-family:sans-serif;color:#333;line-height:1.8">
  <h1 style="font-size:24px;font-weight:700;margin-bottom:20px">隐私政策</h1>
  <p style="padding:12px;background:#f0f7ff;border-radius:8px"><strong>简而言之：您的图片永远不会离开您的设备。</strong></p>
  <h3>1. 数据处理方式</h3>
  <p>${BRAND} 是一款纯前端应用，所有图片编辑、AI 抠图、证件照生成等操作均在您的浏览器本地完成。我们不收集、不存储、不上传您的任何图片数据。</p>
  <h3>2. AI 模型运行</h3>
  <p>AI 抠图功能使用 ONNX Runtime 在您的设备上进行本地推理，模型文件在首次使用时从 CDN 下载并缓存。推理过程完全在浏览器中执行，图片数据不会发送到任何远程服务器。</p>
  <h3>3. 本地存储</h3>
  <p>应用使用浏览器的 localStorage 存储您的偏好设置（如主题模式）。这些数据仅保存在您的设备上，不会同步到云端。</p>
  <h3>4. 第三方服务</h3>
  <p>本站可能使用 Google AdSense、Google Fonts、CDN 等第三方服务。</p>
  <h3>5. 导出的文件</h3>
  <p>导出的图片文件由您完全控制，保存在您选择的本地路径。我们对导出文件没有任何访问权限。</p>
  <p style="color:#888;font-size:13px;margin-top:24px">最后更新日期：2026 年 7 月</p>
</div>`,
  },
  {
    path: '/contact',
    title: `联系我们 - ${BRAND}`,
    description: '如果您在使用过程中遇到问题，或有功能建议，欢迎联系我们',
    ogType: 'website',
    noscriptHtml: `
<div id="seo-fallback" style="max-width:768px;margin:0 auto;padding:24px 20px;font-family:sans-serif;color:#333;line-height:1.8">
  <h1 style="font-size:24px;font-weight:700;margin-bottom:20px">联系我们</h1>
  <p>如果您在使用过程中遇到问题，或有功能建议，欢迎通过以下方式联系我们：</p>
  <h3>联系方式</h3>
  <ul><li>邮箱：fanlnq@163.com</li></ul>
  <h3>常见问题</h3>
  <p><strong>AI 抠图速度很慢？</strong> — 首次使用时需要下载 AI 模型文件（约 24MB），之后会缓存。支持 WebGPU 的浏览器推理速度更快。</p>
  <p><strong>证件照人像位置不准确？</strong> — 建议上传正装照片，确保人物面部清晰、光线均匀。</p>
  <p><strong>支持哪些浏览器？</strong> — 推荐使用最新版 Chrome / Edge / Firefox。</p>
</div>`,
  },
  {
    path: '/blog',
    title: `经验分享 - ${BRAND}`,
    description: '这里分享图片编辑技巧、AI 抠图技术解析、证件照制作指南等实用内容。',
    ogType: 'website',
    noscriptHtml: `
<div id="seo-fallback" style="max-width:768px;margin:0 auto;padding:24px 20px;font-family:sans-serif;color:#333;line-height:1.8">
  <h1 style="font-size:24px;font-weight:700;margin-bottom:20px">经验分享</h1>
  <p>这里分享图片编辑技巧、AI 抠图技术解析、证件照制作指南等实用内容。</p>
  <ul>
    <li><a href="/blog/seed-1" style="color:#1a73e8">如何拍出适合证件照的照片</a> — 证件照技巧</li>
    <li><a href="/blog/seed-2" style="color:#1a73e8">AI 抠图技术原理：IS-Net 模型详解</a> — 技术解析</li>
    <li><a href="/blog/seed-3" style="color:#1a73e8">电商商品图背景移除最佳实践</a> — 实用教程</li>
    <li><a href="/blog/seed-4" style="color:#1a73e8">证件照背景色选择指南</a> — 证件照技巧</li>
    <li><a href="/blog/seed-5" style="color:#1a73e8">图片滤镜调色入门</a> — 后期调色</li>
    <li><a href="/blog/seed-6" style="color:#1a73e8">WebGPU 加速：让浏览器 AI 推理快 10 倍</a> — 技术解析</li>
  </ul>
  <p style="margin-top:20px;color:#888">更多文章持续更新中...</p>
</div>`,
  },
]

/* ================================================================
   Blog posts
   ================================================================ */

export interface BlogPostSeo {
  id: string
  title: string
  category: string
  excerpt: string
  date: string
}

export const BLOG_POSTS_SEO: BlogPostSeo[] = [
  {
    id: 'seed-1',
    title: '如何拍出适合证件照的照片',
    category: '证件照技巧',
    excerpt:
      '证件照是很多人头疼的问题。本文从光线、角度、表情、着装四个方面，教你用手机拍出高质量的证件照原图，配合 Zan Pic 一键生成标准证件照。',
    date: '2026-07-05',
  },
  {
    id: 'seed-2',
    title: 'AI 抠图技术原理：IS-Net 模型详解',
    category: '技术解析',
    excerpt:
      'Zan Pic 的 AI 抠图功能基于 IS-Net（Iterative Spatial Refinement Network）模型。本文深入浅出地讲解模型架构、ONNX 推理流程和 WebGPU 加速原理。',
    date: '2026-07-03',
  },
  {
    id: 'seed-3',
    title: '电商商品图背景移除最佳实践',
    category: '实用教程',
    excerpt:
      '商品图背景移除是电商运营的高频需求。本文介绍如何用涂抹抠图功能处理复杂边缘（如毛绒玩具、透明材质），以及如何批量处理商品图。',
    date: '2026-06-28',
  },
  {
    id: 'seed-4',
    title: '证件照背景色选择指南',
    category: '证件照技巧',
    excerpt:
      '红色、白色、蓝色背景分别用于什么场景？各国签证照片对背景有什么要求？本文汇总了常见证件照规格和背景色标准。',
    date: '2026-06-20',
  },
  {
    id: 'seed-5',
    title: '图片滤镜调色入门',
    category: '后期调色',
    excerpt:
      '亮度、对比度、饱和度是图片调色的三要素。本文从基础概念讲起，配合 Zan Pic 的实时预览功能，帮你快速掌握调色技巧。',
    date: '2026-06-15',
  },
  {
    id: 'seed-6',
    title: 'WebGPU 加速：让浏览器 AI 推理快 10 倍',
    category: '技术解析',
    excerpt:
      'WebGPU 是新一代浏览器图形 API，不仅用于渲染，还能加速 AI 推理。本文介绍 Zan Pic 如何利用 WebGPU 将抠图速度提升数倍。',
    date: '2026-06-10',
  },
]

/* ================================================================
   Homepage JSON-LD structured data
   ================================================================ */

export const HOMEPAGE_JSON_LD: object[] = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: BRAND,
    applicationCategory: 'DesignApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'CNY',
    },
    description:
      '免费在线图片编辑器，支持AI智能抠图、证件照生成、滤镜调色、裁剪旋转、图片压缩、格式转换、自定义水印。浏览器本地处理，保护隐私。',
    url: SITE_URL,
    browserRequirements: 'Requires JavaScript and WebGL/WebGPU',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: BRAND,
    url: SITE_URL,
    description:
      '免费在线图片编辑器，支持AI智能抠图、证件照生成、滤镜调色、裁剪旋转、图片压缩、格式转换、自定义水印。',
    inLanguage: 'zh-CN',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: BRAND,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.svg`,
    sameAs: [],
  },
]

/* ================================================================
   Blog post Article + BreadcrumbList JSON-LD
   ================================================================ */

export function buildBlogPostJsonLd(post: BlogPostSeo): object[] {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.excerpt,
      datePublished: post.date,
      dateModified: post.date,
      author: {
        '@type': 'Organization',
        name: BRAND,
        url: SITE_URL,
      },
      publisher: {
        '@type': 'Organization',
        name: BRAND,
        url: SITE_URL,
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${SITE_URL}/blog/${post.id}`,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: '首页',
          item: SITE_URL,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: '经验分享',
          item: `${SITE_URL}/blog`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: post.title,
        },
      ],
    },
  ]
}

/* ================================================================
   HTML generation helpers (used by prerender.ts)
   ================================================================ */

export function buildMetaTags(page: SeoPageData): string {
  const canonical = `${SITE_URL}${page.path}`
  const ogType = page.ogType || 'website'

  let tags = ''
  tags += `<title>${escapeHtml(page.title)}</title>\n`
  tags += `<meta name="description" content="${escapeHtml(page.description)}">\n`
  tags += `<link rel="canonical" href="${escapeHtml(canonical)}">\n`
  // OG
  tags += `<meta property="og:title" content="${escapeHtml(page.title)}">\n`
  tags += `<meta property="og:description" content="${escapeHtml(page.description)}">\n`
  tags += `<meta property="og:type" content="${escapeHtml(ogType)}">\n`
  tags += `<meta property="og:url" content="${escapeHtml(canonical)}">\n`
  tags += `<meta property="og:site_name" content="${BRAND}">\n`
  // Twitter
  tags += `<meta name="twitter:card" content="summary">\n`
  tags += `<meta name="twitter:title" content="${escapeHtml(page.title)}">\n`
  tags += `<meta name="twitter:description" content="${escapeHtml(page.description)}">\n`
  // Robots
  tags += `<meta name="robots" content="index, follow">\n`

  return tags
}

export function buildJsonLdScript(jsonLd: object | object[]): string {
  const data = Array.isArray(jsonLd) ? jsonLd : [jsonLd]
  return data
    .map((item) => `<script type="application/ld+json">${JSON.stringify(item)}</script>`)
    .join('\n')
}

export function buildNoscriptContent(html: string): string {
  return `<noscript>${html}</noscript>`
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
