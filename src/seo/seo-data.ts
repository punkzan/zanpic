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
    <li><a href="/blog/how-to-take-id-photo" style="color:#1a73e8">如何拍出适合证件照的照片</a> — 证件照技巧</li>
    <li><a href="/blog/ai-background-removal-isnet" style="color:#1a73e8">AI 抠图技术原理：IS-Net 模型详解</a> — 技术解析</li>
    <li><a href="/blog/ecommerce-product-background-removal" style="color:#1a73e8">电商商品图背景移除最佳实践</a> — 实用教程</li>
    <li><a href="/blog/id-photo-background-color-guide" style="color:#1a73e8">证件照背景色选择指南</a> — 证件照技巧</li>
    <li><a href="/blog/photo-filter-color-grading-guide" style="color:#1a73e8">图片滤镜调色入门</a> — 后期调色</li>
    <li><a href="/blog/webgpu-ai-inference-acceleration" style="color:#1a73e8">WebGPU 加速：让浏览器 AI 推理快 10 倍</a> — 技术解析</li>
    <li><a href="/blog/make-id-photo-online-free" style="color:#1a73e8">免费在线证件照制作完整教程</a> — 证件照制作</li>
    <li><a href="/blog/product-photo-white-background" style="color:#1a73e8">电商商品图白底制作一站式教程</a> — 电商运营</li>
    <li><a href="/blog/social-media-avatar-background" style="color:#1a73e8">社媒头像换背景全攻略</a> — 社媒运营</li>
    <li><a href="/blog/ai-background-remover-review" style="color:#1a73e8">2026 年最佳免费 AI 抠图工具横评</a> — 工具评测</li>
  </ul>
  <p style="margin-top:20px;color:#888">更多文章持续更新中...</p>
</div>`,
  },
]

/* ================================================================
   Tool landing pages
   ================================================================ */

export const TOOL_PAGES_SEO: SeoPageData[] = [
  {
    path: '/id-photo-maker',
    title: `在线证件照制作 - ${BRAND}`,
    description: '免费在线证件照生成工具。AI 自动抠图换背景，支持一寸/二寸/小二寸规格，红白蓝三色背景。手机拍照即可生成标准证件照，保护隐私。',
    ogType: 'website',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: '如何在线制作证件照',
        description: '使用 Zan Pic 三步在线生成标准证件照',
        step: [
          { '@type': 'HowToStep', position: 1, name: '上传照片', text: '用手机或相机拍一张正面免冠照，上传到 Zan Pic 编辑器。' },
          { '@type': 'HowToStep', position: 2, name: 'AI 自动处理', text: '点击「证件照」功能，AI 自动识别人像、移除背景、裁剪为标准尺寸。' },
          { '@type': 'HowToStep', position: 3, name: '选择底色导出', text: '选择红底、白底或蓝底，确认效果后一键下载高清证件照。' },
        ],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: '证件照可以用于护照和签证吗？', acceptedAnswer: { '@type': 'Answer', text: 'Zan Pic 生成的证件照符合常见规格（1寸、2寸、小2寸），底色可选红白蓝三种标准色。但各国签证要求略有不同，建议在提交前核对具体规格要求。' } },
          { '@type': 'Question', name: 'AI 自动裁剪准确吗？', acceptedAnswer: { '@type': 'Answer', text: 'Zan Pic 使用 AI 模型分析人像位置，自动识别头部和肩部区域，按标准比例裁剪。对于复杂背景或多人照片，建议先用 AI 抠图移除背景后再生成证件照。' } },
          { '@type': 'Question', name: '支持哪些证件照规格？', acceptedAnswer: { '@type': 'Answer', text: '目前支持标准一寸照（295×413px）、二寸照（413×579px）、小二寸照（413×531px），均按 300DPI 输出。更多规格持续更新中。' } },
          { '@type': 'Question', name: '手机拍摄的照片能用吗？', acceptedAnswer: { '@type': 'Answer', text: '完全可以。现代手机摄像头像素足够生成高质量证件照。建议使用后置摄像头、保持 1-2 米距离、在自然光下拍摄，效果最佳。' } },
        ],
      },
    ],
    noscriptHtml: buildToolPageFallback(
      '免费在线证件照制作工具',
      '只需上传一张正面照片，Zan Pic 即可帮你自动生成标准证件照。AI 智能抠图移除背景，精确识别面部位置，自动裁剪为标准尺寸。支持一寸、二寸、小二寸等多种规格，红底、白底、蓝底自由切换。全程在浏览器本地处理，保护隐私安全。',
      ['AI 智能抠图 — IS-Net 深度学习模型，精准分离人像与背景', '自动人脸定位 — Alpha 通道分析人像位置，智能裁剪', '三色背景 — 红白蓝标准色一键切换', '多规格支持 — 1寸/2寸/小2寸，300DPI 输出', '六寸排版 — 自动在 6 寸相纸上排列多张证件照'],
    ),
  },
  {
    path: '/background-remover',
    title: `AI 在线抠图 - ${BRAND}`,
    description: '免费 AI 在线抠图工具，无需上传到服务器。基于 IS-Net 深度学习模型，WebGPU 加速，发丝级抠图精度。支持智能抠图和涂抹抠图两种模式，完全浏览器本地处理。',
    ogType: 'website',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: '如何在线移除图片背景',
        description: '使用 Zan Pic 三步移除图片背景',
        step: [
          { '@type': 'HowToStep', position: 1, name: '上传图片', text: '拖拽或点击上传你的图片，支持 JPEG、PNG、WebP 等格式。' },
          { '@type': 'HowToStep', position: 2, name: 'AI 自动抠图', text: '点击「智能抠图」，AI 自动识别并移除背景，2-5 秒即可完成。不满意可用「涂抹抠图」手动调整。' },
          { '@type': 'HowToStep', position: 3, name: '下载透明背景图', text: '确认效果满意后，导出为 PNG 格式，获得透明背景的高质量图片。' },
        ],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: 'AI 抠图需要上传图片到服务器吗？', acceptedAnswer: { '@type': 'Answer', text: '不需要。Zan Pic 的 AI 抠图完全在浏览器本地运行，使用 ONNX Runtime 在设备上直接推理。图片数据不会离开你的设备。' } },
          { '@type': 'Question', name: '抠图速度和效果如何？', acceptedAnswer: { '@type': 'Answer', text: '使用 IS-Net 深度学习模型，在支持 WebGPU 的浏览器上推理速度极快，通常 2-5 秒完成。边缘处理通过形态学精修，可达发丝级精度。' } },
          { '@type': 'Question', name: '支持哪些图片格式？', acceptedAnswer: { '@type': 'Answer', text: '支持 JPEG、PNG、WebP、AVIF 等常见格式。处理结果可导出为 PNG（保留透明背景）或其他格式。' } },
          { '@type': 'Question', name: '移动端可以使用吗？', acceptedAnswer: { '@type': 'Answer', text: '可以。移动端浏览器同样支持 WebGPU/WASM 推理。建议使用 Chrome 或 Edge 浏览器。首次使用时需要下载 AI 模型文件（约 24MB），建议在 Wi-Fi 环境下操作。' } },
        ],
      },
    ],
    noscriptHtml: buildToolPageFallback(
      'AI 免费在线抠图工具',
      'Zan Pic 提供强大的 AI 智能抠图功能，一键移除图片背景。基于 IS-Net 深度学习模型，在浏览器本地完成推理，无需上传图片到任何服务器。支持 WebGPU 硬件加速，配备边缘形态学精修算法，输出透明背景 PNG。',
      ['智能抠图 — IS-Net 模型自动识别主体，全自动移除背景', '涂抹抠图 — AI 辅助 + 手动涂抹，精细调整边缘', '边缘精修 — 形态学 + 高斯羽化 + 对比度锐化', 'WebGPU 加速 — 硬件加速推理速度提升数倍'],
    ),
  },
  {
    path: '/photo-resizer',
    title: `图片尺寸调整 - ${BRAND}`,
    description: '免费在线图片尺寸调整工具。支持自由裁剪、固定比例裁剪、自定义像素尺寸调整。含社媒平台推荐尺寸对照表（Instagram/Facebook/Twitter/YouTube）。浏览器本地处理。',
    ogType: 'website',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: '如何在线调整图片尺寸',
        description: '使用 Zan Pic 三步调整图片尺寸',
        step: [
          { '@type': 'HowToStep', position: 1, name: '上传图片', text: '拖拽或点击上传你的图片到编辑器。' },
          { '@type': 'HowToStep', position: 2, name: '选择裁剪比例', text: '使用裁剪工具，选择自由裁剪或固定比例（1:1/4:3/16:9 等），可旋转辅助线。' },
          { '@type': 'HowToStep', position: 3, name: '导出设定尺寸', text: '导出时可指定像素宽高、压缩质量和输出格式（PNG/JPEG/WebP/AVIF）。' },
        ],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: '调整尺寸会降低画质吗？', acceptedAnswer: { '@type': 'Answer', text: '缩小尺寸通常不会明显降低画质。放大尺寸时，Zan Pic 提供 AI 超分辨率功能，可将图片放大 2-4 倍同时保持清晰度。' } },
          { '@type': 'Question', name: '社交媒体图片需要什么尺寸？', acceptedAnswer: { '@type': 'Answer', text: 'Instagram 方形帖 1080×1080px，竖版故事 1080×1920px。Facebook 封面 820×312px。Twitter 帖图 1200×675px。YouTube 缩略图 1280×720px。' } },
          { '@type': 'Question', name: '支持哪些导出格式？', acceptedAnswer: { '@type': 'Answer', text: '支持 PNG、JPEG、WebP、AVIF 四种格式导出。JPEG 和 WebP 可调节压缩质量。' } },
        ],
      },
    ],
    noscriptHtml: buildToolPageFallback(
      '在线图片尺寸调整工具',
      '需要将图片调整到特定尺寸？Zan Pic 提供灵活的图片尺寸调整功能。支持自由裁剪、固定比例裁剪（1:1/4:3/3:4/16:9/9:16/3:2）、旋转调整以及自定义像素尺寸缩放。搭配 AI 超分辨率功能，放大图片也能保持清晰。',
      ['自由裁剪 — 任意比例调整图片构图', '固定比例 — 1:1/4:3/16:9/9:16/3:2 六种比例', '旋转辅助 — 支持旋转裁剪框和三分线参考', '社媒尺寸 — 包含主流平台推荐尺寸对照表'],
    ),
  },
  {
    path: '/photo-filter',
    title: `图片滤镜编辑 - ${BRAND}`,
    description: '免费在线图片滤镜编辑工具，提供黑白、复古、暖色、冷色、鲜艳、褪色、锐化、模糊等 8 种预设滤镜，支持亮度、对比度、饱和度实时调节。浏览器本地处理，保护隐私。',
    ogType: 'website',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: '如何为照片添加滤镜',
        description: '使用 Zan Pic 三步为照片添加滤镜效果',
        step: [
          { '@type': 'HowToStep', position: 1, name: '上传照片', text: '拖拽或点击上传需要处理的照片，支持 JPEG、PNG、WebP 等格式。' },
          { '@type': 'HowToStep', position: 2, name: '选择滤镜 + 精细调色', text: '从 8 款预设滤镜中选择喜欢的风格，再用亮度/对比度/饱和度滑块精细调整。' },
          { '@type': 'HowToStep', position: 3, name: '导出成品', text: '预览效果满意后，一键导出高质量图片，支持多种格式。' },
        ],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: '应用滤镜会改变原图吗？', acceptedAnswer: { '@type': 'Answer', text: '不会。Zan Pic 的所有编辑操作均为非破坏性编辑，你可以随时撤销或修改。只有导出时才生成最终效果。' } },
          { '@type': 'Question', name: '可以叠加多个滤镜吗？', acceptedAnswer: { '@type': 'Answer', text: '可以。你可以在一个图片上应用预设滤镜后再手动调整亮度、对比度、饱和度来微调效果。所有调整实时叠加预览。' } },
          { '@type': 'Question', name: '滤镜适合哪些场景？', acceptedAnswer: { '@type': 'Answer', text: '预设滤镜适用于快速美化照片、统一社媒图片风格、为产品图添加氛围等。不同的滤镜风格适合不同场景 — 暖色适合人像，冷色适合风景，黑白适合强调构图。' } },
        ],
      },
    ],
    noscriptHtml: buildToolPageFallback(
      '免费在线图片滤镜工具',
      '想让照片更有质感？Zan Pic 提供丰富的图片滤镜和调色功能。8 种预设滤镜一键套用，亮度、对比度、饱和度三大核心参数自由调节。所有效果实时预览，所见即所得。',
      ['黑白 — 经典黑白效果，适合人文纪实', '复古 — 暖黄调 + 轻微褪色，怀旧质感', '暖色 — 增强暖色温，适合人像和美食', '冷色 — 增加冷色调，清新现代风格', '鲜艳 — 提升饱和度，适合风光摄影', '锐化 — 增强边缘清晰度，弥补轻微模糊'],
    ),
  },
]

/* ================================================================
   Tool page shared helpers
   ================================================================ */

function buildToolPageFallback(h1: string, intro: string, features: string[]): string {
  const featureItems = features.map((f) => `<li>${f}</li>`).join('\n    ')
  return `
<div id="seo-fallback" style="max-width:768px;margin:0 auto;padding:24px 20px;font-family:sans-serif;color:#333;line-height:1.8">
  <h1 style="font-size:24px;font-weight:700;margin-bottom:16px">${h1}</h1>
  <p style="margin-bottom:16px">${intro}</p>
  <h3 style="margin-bottom:8px">核心功能</h3>
  <ul style="margin-bottom:20px">
    ${featureItems}
  </ul>
  <p style="margin-top:20px"><a href="${SITE_URL}" style="display:inline-block;padding:10px 24px;background:#2563eb;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">开始使用</a></p>
</div>`
}

export interface BlogPostSeo {
  id: string
  slug: string
  title: string
  category: string
  excerpt: string
  date: string
}

export const BLOG_POSTS_SEO: BlogPostSeo[] = [
  {
    id: 'seed-1',
    slug: 'how-to-take-id-photo',
    title: '如何拍出适合证件照的照片',
    category: '证件照技巧',
    excerpt:
      '证件照是很多人头疼的问题。本文从光线、角度、表情、着装四个方面，教你用手机拍出高质量的证件照原图，配合 Zan Pic 一键生成标准证件照。',
    date: '2026-07-05',
  },
  {
    id: 'seed-2',
    slug: 'ai-background-removal-isnet',
    title: 'AI 抠图技术原理：IS-Net 模型详解',
    category: '技术解析',
    excerpt:
      'Zan Pic 的 AI 抠图功能基于 IS-Net（Iterative Spatial Refinement Network）模型。本文深入浅出地讲解模型架构、ONNX 推理流程和 WebGPU 加速原理。',
    date: '2026-07-03',
  },
  {
    id: 'seed-3',
    slug: 'ecommerce-product-background-removal',
    title: '电商商品图背景移除最佳实践',
    category: '实用教程',
    excerpt:
      '商品图背景移除是电商运营的高频需求。本文介绍如何用涂抹抠图功能处理复杂边缘（如毛绒玩具、透明材质），以及如何批量处理商品图。',
    date: '2026-06-28',
  },
  {
    id: 'seed-4',
    slug: 'id-photo-background-color-guide',
    title: '证件照背景色选择指南',
    category: '证件照技巧',
    excerpt:
      '红色、白色、蓝色背景分别用于什么场景？各国签证照片对背景有什么要求？本文汇总了常见证件照规格和背景色标准。',
    date: '2026-06-20',
  },
  {
    id: 'seed-5',
    slug: 'photo-filter-color-grading-guide',
    title: '图片滤镜调色入门',
    category: '后期调色',
    excerpt:
      '亮度、对比度、饱和度是图片调色的三要素。本文从基础概念讲起，配合 Zan Pic 的实时预览功能，帮你快速掌握调色技巧。',
    date: '2026-06-15',
  },
  {
    id: 'seed-6',
    slug: 'webgpu-ai-inference-acceleration',
    title: 'WebGPU 加速：让浏览器 AI 推理快 10 倍',
    category: '技术解析',
    excerpt:
      'WebGPU 是新一代浏览器图形 API，不仅用于渲染，还能加速 AI 推理。本文介绍 Zan Pic 如何利用 WebGPU 将抠图速度提升数倍。',
    date: '2026-06-10',
  },
  {
    id: 'seed-7',
    slug: 'make-id-photo-online-free',
    title: '免费在线证件照制作完整教程：手机拍照 10 秒生成标准证件照',
    category: '证件照制作',
    excerpt:
      '不用去照相馆！本文手把手教你如何用手机拍照 + 在线工具免费制作标准证件照。覆盖一寸、二寸、小2寸规格，红白蓝三色背景，护照签证驾驶证全能搞定。全程浏览器本地处理，图片不外传。',
    date: '2026-07-20',
  },
  {
    id: 'seed-8',
    slug: 'product-photo-white-background',
    title: '电商商品图白底制作：从拍摄到 AI 抠图一站式教程',
    category: '电商运营',
    excerpt:
      '电商平台对商品主图有严格的白底要求。本文系统讲解商品图白底制作的完整流程，覆盖拍摄技巧、AI 抠图换白底、批量处理方法和主流平台规格对照。适用于淘宝/京东/拼多多/Amazon/Shopify 卖家。',
    date: '2026-07-22',
  },
  {
    id: 'seed-9',
    slug: 'social-media-avatar-background',
    title: '社媒头像换背景全攻略：LinkedIn/Instagram/Facebook 一图搞定',
    category: '社媒运营',
    excerpt:
      '你的社交媒体头像用的是自拍还是背景杂乱的照片？本文教你如何用 AI 抠图换背景，制作专业的 LinkedIn 职业头像、Instagram 风格头像和 Facebook 个人头像。多种社媒平台尺寸对照一次讲清楚。',
    date: '2026-07-25',
  },
  {
    id: 'seed-10',
    slug: 'ai-background-remover-review',
    title: '2026 年最佳免费 AI 抠图工具横评：Zan Pic vs remove.bg vs Adobe vs 其他',
    category: '工具评测',
    excerpt:
      '我们深度评测了 2026 年市面上 7 款主流 AI 抠图工具，从免费策略、抠图精度、处理速度、隐私保护、批量处理等 8 个维度对比。结论：如果你追求免费 + 隐私 + 精细控制，Zan Pic 是最优选择。',
    date: '2026-07-28',
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
        '@id': `${SITE_URL}/blog/${post.slug}`,
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
