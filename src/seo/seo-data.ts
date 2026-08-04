/**
 * Shared SEO data layer.
 *
 * Used by both the build-time pre-render script (scripts/prerender.ts)
 * and the client-side usePageMeta hook to keep SEO content consistent.
 */

import { ID_PHOTO_SPECS, type IdPhotoSpec } from '../data/id-photo-specs'
import { EN_ID_PHOTO_SPECS } from '../data/en-id-photo-specs'
import { SOCIAL_MEDIA_SIZES, type SocialMediaSize } from '../data/social-media-sizes'
import { BACKGROUND_COLORS, type BackgroundColorSpec } from '../data/background-colors'
import { EN_BACKGROUND_COLORS } from '../data/en-background-colors'
import { CONVERT_SPECS, type ConvertSpec } from '../data/convert-specs'
import { EN_CONVERT_SPECS } from '../data/en-convert-specs'

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
    path: '/zh/about',
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
    path: '/zh/privacy',
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
    path: '/zh/contact',
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
    path: '/zh/blog',
    title: `经验分享 - ${BRAND}`,
    description: '这里分享图片编辑技巧、AI 抠图技术解析、证件照制作指南等实用内容。',
    ogType: 'website',
    noscriptHtml: `
<div id="seo-fallback" style="max-width:768px;margin:0 auto;padding:24px 20px;font-family:sans-serif;color:#333;line-height:1.8">
  <h1 style="font-size:24px;font-weight:700;margin-bottom:20px">经验分享</h1>
  <p>这里分享图片编辑技巧、AI 抠图技术解析、证件照制作指南等实用内容。</p>
  <ul>
    <li><a href="/zh/blog/how-to-take-id-photo" style="color:#1a73e8">如何拍出适合证件照的照片</a> — 证件照技巧</li>
    <li><a href="/zh/blog/ai-background-removal-isnet" style="color:#1a73e8">AI 抠图技术原理：IS-Net 模型详解</a> — 技术解析</li>
    <li><a href="/zh/blog/ecommerce-product-background-removal" style="color:#1a73e8">电商商品图背景移除最佳实践</a> — 实用教程</li>
    <li><a href="/zh/blog/id-photo-background-color-guide" style="color:#1a73e8">证件照背景色选择指南</a> — 证件照技巧</li>
    <li><a href="/zh/blog/photo-filter-color-grading-guide" style="color:#1a73e8">图片滤镜调色入门</a> — 后期调色</li>
    <li><a href="/zh/blog/webgpu-ai-inference-acceleration" style="color:#1a73e8">WebGPU 加速：让浏览器 AI 推理快 10 倍</a> — 技术解析</li>
    <li><a href="/zh/blog/make-id-photo-online-free" style="color:#1a73e8">免费在线证件照制作完整教程</a> — 证件照制作</li>
    <li><a href="/zh/blog/product-photo-white-background" style="color:#1a73e8">电商商品图白底制作一站式教程</a> — 电商运营</li>
    <li><a href="/zh/blog/social-media-avatar-background" style="color:#1a73e8">社媒头像换背景全攻略</a> — 社媒运营</li>
    <li><a href="/zh/blog/ai-background-remover-review" style="color:#1a73e8">2026 年最佳免费 AI 抠图工具横评</a> — 工具评测</li>
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
    path: '/zh/id-photo-maker',
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
    path: '/zh/background-remover',
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
    path: '/zh/photo-resizer',
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
    path: '/zh/photo-filter',
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
   Programmatic SEO: ID photo spec pages
   ================================================================ */

function buildIdPhotoSpecJsonLd(spec: IdPhotoSpec): object[] {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: `如何制作${spec.country}${spec.type}`,
      description: `在线免费制作${spec.country}${spec.type}，规格 ${spec.pixelWidth}×${spec.pixelHeight}px (${spec.mmWidth}×${spec.mmHeight}mm)，${spec.backgroundColor}背景。`,
      step: [
        { '@type': 'HowToStep', position: 1, name: '上传照片', text: '用手机拍一张正面免冠照，上传到 Zan Pic 编辑器。' },
        { '@type': 'HowToStep', position: 2, name: 'AI 智能抠图', text: '点击智能抠图，AI 自动移除原背景。' },
        { '@type': 'HowToStep', position: 3, name: '证件照生成', text: `选择证件照功能，自动裁剪为${spec.mmWidth}×${spec.mmHeight}mm标准尺寸。` },
        { '@type': 'HowToStep', position: 4, name: '选择底色导出', text: `选择${spec.backgroundColor}背景，导出高清证件照。` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: spec.faq.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ]
}

function buildIdPhotoSpecFallback(spec: IdPhotoSpec): string {
  const dressItems = spec.dressCode.map((d) => `<li>${escapeHtml(d)}</li>`).join('')
  const useItems = spec.commonUses.map((u) => `<li>${escapeHtml(u)}</li>`).join('')
  return `
<div id="seo-fallback" style="max-width:768px;margin:0 auto;padding:24px 20px;font-family:sans-serif;color:#333;line-height:1.8">
  <p style="display:inline-block;padding:2px 10px;background:#e8f0fe;border-radius:4px;font-size:12px;color:#1a73e8;margin-bottom:12px">${escapeHtml(spec.country)} · ${escapeHtml(spec.type)}</p>
  <h1 style="font-size:24px;font-weight:700;margin-bottom:16px;line-height:1.3">${escapeHtml(spec.title)}</h1>
  <p style="color:#555">${escapeHtml(spec.intro)}</p>
  <h3 style="margin:16px 0 8px">规格参数</h3>
  <table style="width:100%;border-collapse:collapse;font-size:14px">
    <tr style="border-bottom:1px solid #eee"><td style="padding:8px;color:#888">像素尺寸</td><td style="padding:8px;font-weight:600">${spec.pixelWidth}×${spec.pixelHeight}px</td></tr>
    <tr style="border-bottom:1px solid #eee"><td style="padding:8px;color:#888">物理尺寸</td><td style="padding:8px;font-weight:600">${spec.mmWidth}×${spec.mmHeight}mm</td></tr>
    <tr style="border-bottom:1px solid #eee"><td style="padding:8px;color:#888">分辨率</td><td style="padding:8px;font-weight:600">${spec.dpi}DPI</td></tr>
    <tr style="border-bottom:1px solid #eee"><td style="padding:8px;color:#888">背景颜色</td><td style="padding:8px;font-weight:600">${escapeHtml(spec.backgroundColor)}</td></tr>
    <tr style="border-bottom:1px solid #eee"><td style="padding:8px;color:#888">头部高度</td><td style="padding:8px;font-weight:600">${spec.headHeightMin}-${spec.headHeightMax}mm</td></tr>
  </table>
  <h3 style="margin:16px 0 8px">着装要求</h3>
  <ul>${dressItems}</ul>
  <h3 style="margin:16px 0 8px">常见用途</h3>
  <ul>${useItems}</ul>
  <p style="margin-top:20px"><a href="${SITE_URL}" style="display:inline-block;padding:10px 24px;background:#2563eb;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">立即制作${escapeHtml(spec.type)}</a></p>
</div>`
}

export const ID_PHOTO_SPECS_SEO: SeoPageData[] = ID_PHOTO_SPECS.map((spec) => ({
  path: `/zh/id-photo/${spec.slug}`,
  title: `${spec.title} - 免费在线制作 | ${BRAND}`,
  description: `${spec.country}${spec.type}规格：${spec.pixelWidth}×${spec.pixelHeight}px (${spec.mmWidth}×${spec.mmHeight}mm)，${spec.backgroundColor}背景。使用 Zan Pic AI 抠图免费在线制作${spec.type}，浏览器本地处理。`,
  ogType: 'website',
  jsonLd: buildIdPhotoSpecJsonLd(spec),
  noscriptHtml: buildIdPhotoSpecFallback(spec),
}))

/* ================================================================
   Programmatic SEO: Social media size pages
   ================================================================ */

function buildSocialMediaSizeJsonLd(size: SocialMediaSize): object[] {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: `如何裁剪至${size.platform} ${size.type}尺寸`,
      description: `${size.platform} ${size.type}尺寸：${size.pixelWidth}×${size.pixelHeight}px，宽高比 ${size.aspectRatio}。`,
      step: [
        { '@type': 'HowToStep', position: 1, name: '上传图片', text: '拖拽或点击上传你的图片到 Zan Pic 编辑器。' },
        { '@type': 'HowToStep', position: 2, name: '选择比例裁剪', text: `使用裁剪工具，选择 ${size.aspectRatio} 比例或自定义像素尺寸 ${size.pixelWidth}×${size.pixelHeight}px。` },
        { '@type': 'HowToStep', position: 3, name: '可选 AI 抠图', text: '如果需要换背景，使用 AI 智能抠图移除原背景。' },
        { '@type': 'HowToStep', position: 4, name: '导出', text: `导出为 ${size.recommendedFormat} 格式，确保文件大小 ${size.maxFileSize} 以内。` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: size.faq.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ]
}

function buildSocialMediaSizeFallback(size: SocialMediaSize): string {
  const tipItems = size.tips.map((t) => `<li>${escapeHtml(t)}</li>`).join('')
  return `
<div id="seo-fallback" style="max-width:768px;margin:0 auto;padding:24px 20px;font-family:sans-serif;color:#333;line-height:1.8">
  <p style="display:inline-block;padding:2px 10px;background:#e8f0fe;border-radius:4px;font-size:12px;color:#1a73e8;margin-bottom:12px">${escapeHtml(size.platform)} · ${escapeHtml(size.type)}</p>
  <h1 style="font-size:24px;font-weight:700;margin-bottom:16px;line-height:1.3">${escapeHtml(size.title)}</h1>
  <p style="color:#555">${escapeHtml(size.intro)}</p>
  <h3 style="margin:16px 0 8px">规格参数</h3>
  <table style="width:100%;border-collapse:collapse;font-size:14px">
    <tr style="border-bottom:1px solid #eee"><td style="padding:8px;color:#888">像素尺寸</td><td style="padding:8px;font-weight:600">${size.pixelWidth}×${size.pixelHeight}px</td></tr>
    <tr style="border-bottom:1px solid #eee"><td style="padding:8px;color:#888">宽高比</td><td style="padding:8px;font-weight:600">${size.aspectRatio}</td></tr>
    <tr style="border-bottom:1px solid #eee"><td style="padding:8px;color:#888">推荐格式</td><td style="padding:8px;font-weight:600">${escapeHtml(size.recommendedFormat)}</td></tr>
    <tr style="border-bottom:1px solid #eee"><td style="padding:8px;color:#888">文件大小限制</td><td style="padding:8px;font-weight:600">${escapeHtml(size.maxFileSize)}</td></tr>
  </table>
  <h3 style="margin:16px 0 8px">制作技巧</h3>
  <ul>${tipItems}</ul>
  <p style="margin-top:20px"><a href="${SITE_URL}" style="display:inline-block;padding:10px 24px;background:#2563eb;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">立即裁剪图片</a></p>
</div>`
}

export const SOCIAL_MEDIA_SIZES_SEO: SeoPageData[] = SOCIAL_MEDIA_SIZES.map((size) => ({
  path: `/zh/resize/${size.slug}`,
  title: `${size.title} - 在线裁剪 | ${BRAND}`,
  description: `${size.platform} ${size.type}尺寸：${size.pixelWidth}×${size.pixelHeight}px，宽高比 ${size.aspectRatio}。使用 Zan Pic 在线裁剪和调整图片尺寸，支持 AI 抠图换背景。`,
  ogType: 'website',
  jsonLd: buildSocialMediaSizeJsonLd(size),
  noscriptHtml: buildSocialMediaSizeFallback(size),
}))

/* ================================================================
   Programmatic SEO: Background color pages
   ================================================================ */

function buildBackgroundColorJsonLd(spec: BackgroundColorSpec): object[] {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: `如何制作${spec.colorName}底证件照`,
      description: `使用 Zan Pic AI 抠图在线制作${spec.colorName}背景证件照，色值 ${spec.hexValue}。`,
      step: [
        { '@type': 'HowToStep', position: 1, name: '上传照片', text: '用手机拍一张正面免冠照，上传到 Zan Pic 编辑器。' },
        { '@type': 'HowToStep', position: 2, name: 'AI 智能抠图', text: '点击智能抠图，AI 自动识别人像并移除原背景。' },
        { '@type': 'HowToStep', position: 3, name: `选择${spec.colorName}底导出`, text: `在证件照功能中选择${spec.colorName}背景，导出高清证件照。` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: spec.faq.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ]
}

function buildBackgroundColorFallback(spec: BackgroundColorSpec): string {
  const useItems = spec.useCases.map((u) => `<li>${escapeHtml(u)}</li>`).join('')
  return `
<div id="seo-fallback" style="max-width:768px;margin:0 auto;padding:24px 20px;font-family:sans-serif;color:#333;line-height:1.8">
  <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
    <span style="display:inline-block;width:48px;height:48px;border-radius:8px;background:${spec.slug === 'gradient' ? 'linear-gradient(135deg,#667eea,#764ba2)' : spec.hexValue};border:2px solid #ddd"></span>
    <span style="font-size:18px;font-weight:600">${escapeHtml(spec.colorName)}背景 · ${spec.hexValue}</span>
  </div>
  <h1 style="font-size:24px;font-weight:700;margin-bottom:16px;line-height:1.3">${escapeHtml(spec.title)}</h1>
  <p style="color:#555">${escapeHtml(spec.intro)}</p>
  <h3 style="margin:16px 0 8px">适用场景</h3>
  <ul>${useItems}</ul>
  <p style="margin-top:20px"><a href="${SITE_URL}" style="display:inline-block;padding:10px 24px;background:#2563eb;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">立即制作${escapeHtml(spec.colorName)}底证件照</a></p>
</div>`
}

export const BACKGROUND_COLORS_SEO: SeoPageData[] = BACKGROUND_COLORS.map((spec) => ({
  path: `/zh/background/${spec.slug}`,
  title: `${spec.title} - AI 抠图换背景 | ${BRAND}`,
  description: `${spec.colorName}背景证件照制作：色值 ${spec.hexValue}。AI 自动抠图换背景，在线免费生成${spec.colorName}底证件照。浏览器本地处理，保护隐私。`,
  ogType: 'website',
  jsonLd: buildBackgroundColorJsonLd(spec),
  noscriptHtml: buildBackgroundColorFallback(spec),
}))

/* ================================================================
   Programmatic SEO: Image format conversion pages
   ================================================================ */

function buildConvertSpecJsonLd(spec: ConvertSpec): object[] {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: `如何将 ${spec.sourceFormat} 转换为 ${spec.targetFormat}`,
      description: `${spec.sourceFormat} 转 ${spec.targetFormat}：免费在线转换工具，浏览器本地处理，支持自定义压缩质量。`,
      step: [
        { '@type': 'HowToStep', position: 1, name: '上传图片', text: `将 ${spec.sourceFormat} 图片拖拽到上传区域，或点击选择文件。` },
        { '@type': 'HowToStep', position: 2, name: '调整参数', text: '根据需要调整压缩质量或背景填充色。' },
        { '@type': 'HowToStep', position: 3, name: '开始转换', text: `点击转换按钮，浏览器自动完成 ${spec.sourceFormat} 到 ${spec.targetFormat} 的格式转换。` },
        { '@type': 'HowToStep', position: 4, name: '下载结果', text: `转换完成后点击下载按钮，保存 ${spec.targetExt} 文件到本地。` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: spec.faq.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ]
}

function buildConvertSpecFallback(spec: ConvertSpec): string {
  const sourcePros = spec.sourcePros.map((p) => `<li>${escapeHtml(p)}</li>`).join('')
  const targetPros = spec.targetPros.map((p) => `<li>${escapeHtml(p)}</li>`).join('')
  const useItems = spec.commonUses.map((u) => `<li>${escapeHtml(u)}</li>`).join('')
  return `
<div id="seo-fallback" style="max-width:768px;margin:0 auto;padding:24px 20px;font-family:sans-serif;color:#333;line-height:1.8">
  <p style="display:inline-block;padding:2px 10px;background:#e8f0fe;border-radius:4px;font-size:12px;color:#1a73e8;margin-bottom:12px">${escapeHtml(spec.sourceFormat)} → ${escapeHtml(spec.targetFormat)}</p>
  <h1 style="font-size:24px;font-weight:700;margin-bottom:16px;line-height:1.3">${escapeHtml(spec.title)}</h1>
  <p style="color:#555">${escapeHtml(spec.intro)}</p>
  <h3 style="margin:16px 0 8px">${escapeHtml(spec.sourceFormat)} 优点</h3>
  <ul>${sourcePros}</ul>
  <h3 style="margin:16px 0 8px">${escapeHtml(spec.targetFormat)} 优点</h3>
  <ul>${targetPros}</ul>
  <h3 style="margin:16px 0 8px">常见使用场景</h3>
  <ul>${useItems}</ul>
  <p style="margin-top:20px"><a href="${SITE_URL}" style="display:inline-block;padding:10px 24px;background:#2563eb;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">开始转换</a></p>
</div>`
}

export const CONVERT_SPECS_SEO: SeoPageData[] = CONVERT_SPECS.map((spec) => ({
  path: `/zh/convert/${spec.slug}`,
  title: `${spec.title} | ${BRAND}`,
  description: `${spec.sourceFormat} 转 ${spec.targetFormat}：免费在线转换，浏览器本地处理，支持自定义压缩质量。${spec.intro.slice(0, 60)}`,
  ogType: 'website',
  jsonLd: buildConvertSpecJsonLd(spec),
  noscriptHtml: buildConvertSpecFallback(spec),
}))

/* ================================================================
   English SEO: Static content pages
   ================================================================ */

export const EN_STATIC_PAGES_SEO: SeoPageData[] = [
  {
    path: '/about',
    title: `About Us - ${BRAND}`,
    description: `${BRAND} is a client-side image editing tool. All processing happens locally in your browser — images are never uploaded to any server. We believe great tools don't need to sacrifice your privacy.`,
    ogType: 'website',
    noscriptHtml: `
<div id="seo-fallback" style="max-width:768px;margin:0 auto;padding:24px 20px;font-family:sans-serif;color:#333;line-height:1.8">
  <h1 style="font-size:24px;font-weight:700;margin-bottom:20px">About Us</h1>
  <p>${BRAND} is a client-side image editing tool. All processing happens locally in your browser — images are never uploaded to any server.</p>
  <h3>Features</h3>
  <ul>
    <li>Basic Adjustments — Brightness, contrast, saturation sliders with real-time preview</li>
    <li>Preset Filters — B&W, vintage, warm, cool, vibrant, faded, sharpen, blur — 8 styles</li>
    <li>Smart Crop — Free crop + 6 fixed ratios, rotation & rule-of-thirds guide</li>
    <li>AI Background Removal — IS-Net model, WebGPU accelerated, morphological edge refinement</li>
    <li>ID Photo Maker — AI removal + smart crop + red/white/blue background, 1"/2" sizes & 6" print layout</li>
    <li>Image Compression — Quality slider + size constraints + file size estimation</li>
    <li>Format Conversion — PNG / JPEG / WebP / AVIF inter-conversion</li>
    <li>Custom Watermark — Text or image watermark, 8 positions</li>
    <li>Multi-format Export — PNG / JPEG / WebP / AVIF, quality & size controllable</li>
  </ul>
  <p style="margin-top:20px;padding:16px;background:#f5f5f5;border-radius:8px">No sign-up. No installation. Just open and use. Your images stay on your device.</p>
</div>`,
  },
  {
    path: '/privacy',
    title: `Privacy Policy - ${BRAND}`,
    description: 'In short: Your images never leave your device.',
    ogType: 'website',
    noscriptHtml: `
<div id="seo-fallback" style="max-width:768px;margin:0 auto;padding:24px 20px;font-family:sans-serif;color:#333;line-height:1.8">
  <h1 style="font-size:24px;font-weight:700;margin-bottom:20px">Privacy Policy</h1>
  <p style="padding:12px;background:#f0f7ff;border-radius:8px"><strong>In short: Your images never leave your device.</strong></p>
  <h3>1. Data Processing</h3>
  <p>${BRAND} is a client-side application. All image editing, AI background removal, ID photo generation, and other operations run locally in your browser. We do not collect, store, or upload any of your image data.</p>
  <h3>2. AI Model Execution</h3>
  <p>AI background removal uses ONNX Runtime for local inference on your device. Model files are downloaded from CDN on first use and cached. Inference runs entirely in the browser — image data is never sent to any remote server.</p>
  <h3>3. Local Storage</h3>
  <p>The app uses browser localStorage to store your preferences (e.g., theme mode). This data is stored only on your device and is not synced to the cloud.</p>
  <h3>4. Third-Party Services</h3>
  <p>This site may use third-party services including Google AdSense, Google Fonts, and CDNs.</p>
  <h3>5. Exported Files</h3>
  <p>Exported image files are fully under your control and saved to your chosen local path. We have no access to exported files.</p>
  <p style="color:#888;font-size:13px;margin-top:24px">Last updated: July 2026</p>
</div>`,
  },
  {
    path: '/contact',
    title: `Contact Us - ${BRAND}`,
    description: 'If you encounter issues or have feature suggestions, feel free to contact us.',
    ogType: 'website',
    noscriptHtml: `
<div id="seo-fallback" style="max-width:768px;margin:0 auto;padding:24px 20px;font-family:sans-serif;color:#333;line-height:1.8">
  <h1 style="font-size:24px;font-weight:700;margin-bottom:20px">Contact Us</h1>
  <p>If you encounter issues or have feature suggestions, please contact us through:</p>
  <h3>Contact Info</h3>
  <ul><li>Email: fanlnq@163.com</li></ul>
  <h3>FAQ</h3>
  <p><strong>AI background removal is slow?</strong> — First-time use requires downloading the AI model (~24MB), which is then cached. WebGPU-enabled browsers run much faster.</p>
  <p><strong>ID photo face positioning is inaccurate?</strong> — We recommend uploading a front-facing photo with clear facial features and even lighting.</p>
  <p><strong>Which browsers are supported?</strong> — We recommend the latest Chrome / Edge / Firefox.</p>
</div>`,
  },
  {
    path: '/blog',
    title: `Blog - ${BRAND}`,
    description: 'Image editing tips, AI background removal tech deep-dives, ID photo guides, and more practical content.',
    ogType: 'website',
    noscriptHtml: `
<div id="seo-fallback" style="max-width:768px;margin:0 auto;padding:24px 20px;font-family:sans-serif;color:#333;line-height:1.8">
  <h1 style="font-size:24px;font-weight:700;margin-bottom:20px">Blog</h1>
  <p>Image editing tips, AI background removal tech deep-dives, ID photo guides, and more.</p>
  <ul>
    <li><a href="/blog/how-to-take-id-photo" style="color:#1a73e8">How to Take Perfect ID Photos</a> — Tips</li>
    <li><a href="/blog/ai-background-removal-isnet" style="color:#1a73e8">How AI Background Removal Works: IS-Net Explained</a> — Tech</li>
    <li><a href="/blog/ecommerce-product-background-removal" style="color:#1a73e8">E-commerce Product Background Removal Best Practices</a> — Tutorial</li>
    <li><a href="/blog/id-photo-background-color-guide" style="color:#1a73e8">ID Photo Background Color Guide</a> — Guide</li>
    <li><a href="/blog/photo-filter-color-grading-guide" style="color:#1a73e8">Photo Filter Color Grading Guide</a> — Editing</li>
    <li><a href="/blog/webgpu-ai-inference-acceleration" style="color:#1a73e8">WebGPU Acceleration: 10x Faster Browser AI Inference</a> — Tech</li>
    <li><a href="/blog/make-id-photo-online-free" style="color:#1a73e8">Free Online ID Photo Maker Tutorial</a> — ID Photo</li>
    <li><a href="/blog/product-photo-white-background" style="color:#1a73e8">Product Photo White Background Guide</a> — E-commerce</li>
    <li><a href="/blog/social-media-avatar-background" style="color:#1a73e8">Social Media Avatar Background Guide</a> — Social</li>
    <li><a href="/blog/ai-background-remover-review" style="color:#1a73e8">2026 Best Free AI Background Remover Comparison</a> — Review</li>
  </ul>
  <p style="margin-top:20px;color:#888">More articles coming soon...</p>
</div>`,
  },
]

/* ================================================================
   English SEO: Tool landing pages
   ================================================================ */

export const EN_TOOL_PAGES_SEO: SeoPageData[] = [
  {
    path: '/id-photo-maker',
    title: `Online ID Photo Maker - ${BRAND}`,
    description: 'Free online ID photo generator. AI auto background removal, supports 1-inch/2-inch/small 2-inch sizes, red/white/blue backgrounds. Take a photo with your phone and generate standard ID photos instantly. Privacy protected.',
    ogType: 'website',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: 'How to Make ID Photos Online',
        description: 'Generate standard ID photos online in 3 steps with Zan Pic',
        step: [
          { '@type': 'HowToStep', position: 1, name: 'Upload Photo', text: 'Take a front-facing photo with your phone or camera and upload it to the Zan Pic editor.' },
          { '@type': 'HowToStep', position: 2, name: 'AI Auto Processing', text: 'Click the ID Photo feature and AI automatically detects faces, removes backgrounds, and crops to standard sizes.' },
          { '@type': 'HowToStep', position: 3, name: 'Choose Background & Export', text: 'Select red, white, or blue background, confirm the result, and download a high-resolution ID photo.' },
        ],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: 'Can ID photos be used for passports and visas?', acceptedAnswer: { '@type': 'Answer', text: 'Zan Pic generates ID photos that meet common specifications (1-inch, 2-inch, small 2-inch) with three standard background colors (red, white, blue). However, visa requirements vary by country — we recommend verifying specific requirements before submission.' } },
          { '@type': 'Question', name: 'How accurate is AI auto-cropping?', acceptedAnswer: { '@type': 'Answer', text: 'Zan Pic uses AI models to analyze face position, automatically detecting head and shoulder areas and cropping to standard proportions. For complex backgrounds or group photos, we recommend using AI background removal first.' } },
          { '@type': 'Question', name: 'Which ID photo sizes are supported?', acceptedAnswer: { '@type': 'Answer', text: 'Currently supports standard 1-inch (295×413px), 2-inch (413×579px), and small 2-inch (413×531px) sizes, all at 300DPI. More sizes coming soon.' } },
          { '@type': 'Question', name: 'Can I use photos taken with my phone?', acceptedAnswer: { '@type': 'Answer', text: 'Absolutely. Modern smartphone cameras have sufficient resolution for high-quality ID photos. For best results, use the rear camera, maintain 1-2 meters distance, and shoot in natural light.' } },
        ],
      },
    ],
    noscriptHtml: buildToolPageFallbackEn(
      'Free Online ID Photo Maker',
      'Simply upload a front-facing photo, and Zan Pic will automatically generate a standard ID photo. AI smart background removal, precise face detection, and automatic cropping to standard sizes. Supports 1-inch, 2-inch, and small 2-inch specifications with red, white, and blue backgrounds. All processing happens locally in your browser.',
      ['AI Background Removal — IS-Net deep learning model for precise person-background separation', 'Auto Face Detection — Alpha channel analysis for face positioning and smart cropping', 'Three Background Colors — Red, white, and blue standard colors with one-click switching', 'Multi-Size Support — 1"/2"/small 2", 300DPI output', '6-Inch Print Layout — Auto-arrange multiple ID photos on 6-inch photo paper'],
    ),
  },
  {
    path: '/background-remover',
    title: `AI Background Remover - ${BRAND}`,
    description: 'Free AI online background remover. No upload to servers. IS-Net deep learning model, WebGPU acceleration, hair-level precision. Supports smart removal and brush removal modes. All processing happens locally in your browser.',
    ogType: 'website',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: 'How to Remove Image Backgrounds Online',
        description: 'Remove image backgrounds in 3 steps with Zan Pic',
        step: [
          { '@type': 'HowToStep', position: 1, name: 'Upload Image', text: 'Drag and drop or click to upload your image. Supports JPEG, PNG, WebP, and more.' },
          { '@type': 'HowToStep', position: 2, name: 'AI Auto Removal', text: 'Click "Smart Remove BG" and AI automatically detects and removes the background in 2-5 seconds. Use "Brush Remove BG" for manual fine-tuning.' },
          { '@type': 'HowToStep', position: 3, name: 'Download Transparent Image', text: 'Once satisfied, export as PNG to get a high-quality image with a transparent background.' },
        ],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: 'Does AI background removal upload images to a server?', acceptedAnswer: { '@type': 'Answer', text: 'No. Zan Pic\'s AI background removal runs entirely in your browser using ONNX Runtime for local inference. Image data never leaves your device.' } },
          { '@type': 'Question', name: 'How fast and accurate is the background removal?', acceptedAnswer: { '@type': 'Answer', text: 'Using the IS-Net deep learning model, inference is extremely fast on WebGPU-enabled browsers, typically 2-5 seconds. Edge refinement through morphological processing achieves hair-level precision.' } },
          { '@type': 'Question', name: 'Which image formats are supported?', acceptedAnswer: { '@type': 'Answer', text: 'Supports JPEG, PNG, WebP, AVIF, and other common formats. Processed results can be exported as PNG (preserving transparency) or other formats.' } },
          { '@type': 'Question', name: 'Can I use this on mobile?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Mobile browsers also support WebGPU/WASM inference. We recommend Chrome or Edge. First-time use requires downloading the AI model (~24MB) — use Wi-Fi if possible.' } },
        ],
      },
    ],
    noscriptHtml: buildToolPageFallbackEn(
      'Free AI Online Background Remover',
      'Zan Pic offers powerful AI background removal — one click to remove image backgrounds. Based on the IS-Net deep learning model, inference runs locally in your browser with no image upload required. Supports WebGPU hardware acceleration and morphological edge refinement for transparent PNG output.',
      ['Smart Removal — IS-Net model auto-detects subjects and removes backgrounds', 'Brush Removal — AI-assisted + manual brush for edge fine-tuning', 'Edge Refinement — Morphological processing + Gaussian feathering + contrast sharpening', 'WebGPU Acceleration — Hardware-accelerated inference for multiple speed improvements'],
    ),
  },
  {
    path: '/photo-resizer',
    title: `Image Resizer - ${BRAND}`,
    description: 'Free online image resizing tool. Supports free crop, fixed-ratio crop, and custom pixel dimensions. Includes social media recommended size reference (Instagram/Facebook/Twitter/YouTube). Browser-based local processing.',
    ogType: 'website',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: 'How to Resize Images Online',
        description: 'Resize images in 3 steps with Zan Pic',
        step: [
          { '@type': 'HowToStep', position: 1, name: 'Upload Image', text: 'Drag and drop or click to upload your image to the editor.' },
          { '@type': 'HowToStep', position: 2, name: 'Choose Crop Ratio', text: 'Use the crop tool with free crop or fixed ratios (1:1/4:3/16:9 etc.), rotate support and rule-of-thirds guide.' },
          { '@type': 'HowToStep', position: 3, name: 'Export with Custom Size', text: 'Specify pixel dimensions, compression quality, and output format (PNG/JPEG/WebP/AVIF) when exporting.' },
        ],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: 'Will resizing reduce image quality?', acceptedAnswer: { '@type': 'Answer', text: 'Downsizing typically doesn\'t noticeably reduce quality. When upscaling, Zan Pic offers AI super-resolution to enlarge images 2-4x while maintaining clarity.' } },
          { '@type': 'Question', name: 'What sizes do social media images need?', acceptedAnswer: { '@type': 'Answer', text: 'Instagram square posts 1080×1080px, vertical stories 1080×1920px. Facebook covers 820×312px. Twitter post images 1200×675px. YouTube thumbnails 1280×720px.' } },
          { '@type': 'Question', name: 'Which export formats are supported?', acceptedAnswer: { '@type': 'Answer', text: 'PNG, JPEG, WebP, and AVIF. JPEG and WebP support adjustable compression quality.' } },
        ],
      },
    ],
    noscriptHtml: buildToolPageFallbackEn(
      'Online Image Resizer Tool',
      'Need to resize images to specific dimensions? Zan Pic offers flexible image resizing. Supports free crop, fixed-ratio crop (1:1/4:3/3:4/16:9/9:16/3:2), rotation adjustments, and custom pixel scaling. Combined with AI super-resolution, you can enlarge images while maintaining clarity.',
      ['Free Crop — Adjust image composition at any ratio', 'Fixed Ratios — 1:1/4:3/16:9/9:16/3:2 — six presets', 'Rotation Support — Rotatable crop frame with rule-of-thirds guide', 'Social Media Sizes — Recommended size reference for major platforms'],
    ),
  },
  {
    path: '/photo-filter',
    title: `Photo Filter Editor - ${BRAND}`,
    description: 'Free online photo filter editor with 8 preset filters: B&W, vintage, warm, cool, vibrant, faded, sharpen, blur. Real-time brightness, contrast, and saturation adjustments. Browser-based local processing, privacy protected.',
    ogType: 'website',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: 'How to Apply Filters to Photos',
        description: 'Apply filters to photos in 3 steps with Zan Pic',
        step: [
          { '@type': 'HowToStep', position: 1, name: 'Upload Photo', text: 'Drag and drop or click to upload your photo. Supports JPEG, PNG, WebP, and more.' },
          { '@type': 'HowToStep', position: 2, name: 'Choose Filter & Fine-Tune', text: 'Select from 8 preset filters, then fine-tune with brightness/contrast/saturation sliders.' },
          { '@type': 'HowToStep', position: 3, name: 'Export Result', text: 'Once satisfied with the preview, export a high-quality image in your preferred format.' },
        ],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: 'Will applying filters modify the original image?', acceptedAnswer: { '@type': 'Answer', text: 'No. All edits in Zan Pic are non-destructive. You can undo or modify at any time. The original is only affected when you export.' } },
          { '@type': 'Question', name: 'Can I stack multiple filters?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. You can apply a preset filter and then manually adjust brightness, contrast, and saturation to fine-tune. All adjustments stack in real-time preview.' } },
          { '@type': 'Question', name: 'What scenarios are filters suitable for?', acceptedAnswer: { '@type': 'Answer', text: 'Preset filters are ideal for quick photo enhancement, unifying social media image styles, and adding atmosphere to product photos. Different styles suit different scenarios — warm for portraits, cool for landscapes, B&W for emphasizing composition.' } },
        ],
      },
    ],
    noscriptHtml: buildToolPageFallbackEn(
      'Free Online Photo Filter Tool',
      'Want to add more texture to your photos? Zan Pic offers rich photo filters and color grading. Apply 8 preset filters with one click and freely adjust brightness, contrast, and saturation. All effects preview in real-time — what you see is what you get.',
      ['B&W — Classic black and white, great for documentary and street photography', 'Vintage — Warm yellow tones + slight fade for nostalgic feel', 'Warm — Enhanced warm color temperature for portraits and food', 'Cool — Blue-tinted for fresh, modern looks', 'Vibrant — Boosted saturation for landscape photography', 'Sharpen — Edge clarity enhancement to compensate for slight blur'],
    ),
  },
]

/* ================================================================
   English SEO: ID photo spec pages (programmatic)
   ================================================================ */

function buildEnIdPhotoSpecJsonLd(spec: IdPhotoSpec): object[] {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: `How to Make ${spec.country} ${spec.type}`,
      description: `Generate ${spec.country} ${spec.type} online for free. Size: ${spec.pixelWidth}×${spec.pixelHeight}px (${spec.mmWidth}×${spec.mmHeight}mm), ${spec.backgroundColor} background.`,
      step: [
        { '@type': 'HowToStep', position: 1, name: 'Upload Photo', text: 'Take a front-facing photo with your phone and upload it to the Zan Pic editor.' },
        { '@type': 'HowToStep', position: 2, name: 'AI Background Removal', text: 'Click Smart Remove BG and AI automatically removes the original background.' },
        { '@type': 'HowToStep', position: 3, name: 'ID Photo Generation', text: `Select the ID Photo feature and auto-crop to ${spec.mmWidth}×${spec.mmHeight}mm standard size.` },
        { '@type': 'HowToStep', position: 4, name: 'Choose Background & Export', text: `Select ${spec.backgroundColor} background and export a high-resolution ID photo.` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: spec.faq.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ]
}

function buildEnIdPhotoSpecFallback(spec: IdPhotoSpec): string {
  const dressItems = spec.dressCode.map((d) => `<li>${escapeHtml(d)}</li>`).join('')
  const useItems = spec.commonUses.map((u) => `<li>${escapeHtml(u)}</li>`).join('')
  return `
<div id="seo-fallback" style="max-width:768px;margin:0 auto;padding:24px 20px;font-family:sans-serif;color:#333;line-height:1.8">
  <p style="display:inline-block;padding:2px 10px;background:#e8f0fe;border-radius:4px;font-size:12px;color:#1a73e8;margin-bottom:12px">${escapeHtml(spec.country)} · ${escapeHtml(spec.type)}</p>
  <h1 style="font-size:24px;font-weight:700;margin-bottom:16px;line-height:1.3">${escapeHtml(spec.title)}</h1>
  <p style="color:#555">${escapeHtml(spec.intro)}</p>
  <h3 style="margin:16px 0 8px">Specifications</h3>
  <table style="width:100%;border-collapse:collapse;font-size:14px">
    <tr style="border-bottom:1px solid #eee"><td style="padding:8px;color:#888">Pixel Size</td><td style="padding:8px;font-weight:600">${spec.pixelWidth}×${spec.pixelHeight}px</td></tr>
    <tr style="border-bottom:1px solid #eee"><td style="padding:8px;color:#888">Physical Size</td><td style="padding:8px;font-weight:600">${spec.mmWidth}×${spec.mmHeight}mm</td></tr>
    <tr style="border-bottom:1px solid #eee"><td style="padding:8px;color:#888">Resolution</td><td style="padding:8px;font-weight:600">${spec.dpi}DPI</td></tr>
    <tr style="border-bottom:1px solid #eee"><td style="padding:8px;color:#888">Background Color</td><td style="padding:8px;font-weight:600">${escapeHtml(spec.backgroundColor)}</td></tr>
    <tr style="border-bottom:1px solid #eee"><td style="padding:8px;color:#888">Head Height</td><td style="padding:8px;font-weight:600">${spec.headHeightMin}-${spec.headHeightMax}mm</td></tr>
  </table>
  <h3 style="margin:16px 0 8px">Dress Code</h3>
  <ul>${dressItems}</ul>
  <h3 style="margin:16px 0 8px">Common Uses</h3>
  <ul>${useItems}</ul>
  <p style="margin-top:20px"><a href="${SITE_URL}" style="display:inline-block;padding:10px 24px;background:#2563eb;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">Make ${escapeHtml(spec.type)} Now</a></p>
</div>`
}

export const EN_ID_PHOTO_SPECS_SEO: SeoPageData[] = EN_ID_PHOTO_SPECS.map((spec) => ({
  path: `/id-photo/${spec.slug}`,
  title: `${spec.title} — Free Online Maker | ${BRAND}`,
  description: `${spec.country} ${spec.type}: ${spec.pixelWidth}×${spec.pixelHeight}px (${spec.mmWidth}×${spec.mmHeight}mm), ${spec.backgroundColor} background. Generate ${spec.type} free online with ${BRAND} AI background removal. Browser-based, privacy-first.`,
  ogType: 'website',
  jsonLd: buildEnIdPhotoSpecJsonLd(spec),
  noscriptHtml: buildEnIdPhotoSpecFallback(spec),
}))

/* ================================================================
   English SEO: Social media size pages (programmatic)
   Data is already in English, just prefix paths with /en/
   ================================================================ */

export const EN_SOCIAL_MEDIA_SIZES_SEO: SeoPageData[] = SOCIAL_MEDIA_SIZES.map((size) => ({
  path: `/resize/${size.slug}`,
  title: `${size.title} — Online Cropping | ${BRAND}`,
  description: `${size.platform} ${size.type}: ${size.pixelWidth}×${size.pixelHeight}px, aspect ratio ${size.aspectRatio}. Crop and resize images online with ${BRAND}. Supports AI background removal.`,
  ogType: 'website',
  jsonLd: [
    {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: `How to Crop to ${size.platform} ${size.type} Size`,
      description: `${size.platform} ${size.type}: ${size.pixelWidth}×${size.pixelHeight}px, aspect ratio ${size.aspectRatio}.`,
      step: [
        { '@type': 'HowToStep', position: 1, name: 'Upload Image', text: 'Drag and drop or click to upload your image to the Zan Pic editor.' },
        { '@type': 'HowToStep', position: 2, name: 'Choose Ratio & Crop', text: `Use the crop tool, select ${size.aspectRatio} ratio or custom ${size.pixelWidth}×${size.pixelHeight}px.` },
        { '@type': 'HowToStep', position: 3, name: 'Optional AI Background Removal', text: 'If you need to change the background, use AI smart background removal.' },
        { '@type': 'HowToStep', position: 4, name: 'Export', text: `Export as ${size.recommendedFormat}, keep file size under ${size.maxFileSize}.` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: size.faq.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ],
  noscriptHtml: `
<div id="seo-fallback" style="max-width:768px;margin:0 auto;padding:24px 20px;font-family:sans-serif;color:#333;line-height:1.8">
  <p style="display:inline-block;padding:2px 10px;background:#e8f0fe;border-radius:4px;font-size:12px;color:#1a73e8;margin-bottom:12px">${escapeHtml(size.platform)} · ${escapeHtml(size.type)}</p>
  <h1 style="font-size:24px;font-weight:700;margin-bottom:16px;line-height:1.3">${escapeHtml(size.title)}</h1>
  <p style="color:#555">${escapeHtml(size.intro)}</p>
  <h3 style="margin:16px 0 8px">Specifications</h3>
  <table style="width:100%;border-collapse:collapse;font-size:14px">
    <tr style="border-bottom:1px solid #eee"><td style="padding:8px;color:#888">Pixel Size</td><td style="padding:8px;font-weight:600">${size.pixelWidth}×${size.pixelHeight}px</td></tr>
    <tr style="border-bottom:1px solid #eee"><td style="padding:8px;color:#888">Aspect Ratio</td><td style="padding:8px;font-weight:600">${size.aspectRatio}</td></tr>
    <tr style="border-bottom:1px solid #eee"><td style="padding:8px;color:#888">Recommended Format</td><td style="padding:8px;font-weight:600">${escapeHtml(size.recommendedFormat)}</td></tr>
    <tr style="border-bottom:1px solid #eee"><td style="padding:8px;color:#888">Max File Size</td><td style="padding:8px;font-weight:600">${escapeHtml(size.maxFileSize)}</td></tr>
  </table>
  <h3 style="margin:16px 0 8px">Tips</h3>
  <ul>${size.tips.map((t) => `<li>${escapeHtml(t)}</li>`).join('')}</ul>
  <p style="margin-top:20px"><a href="${SITE_URL}" style="display:inline-block;padding:10px 24px;background:#2563eb;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">Crop Image Now</a></p>
</div>`,
}))

/* ================================================================
   English SEO: Background color pages (programmatic)
   ================================================================ */

function buildEnBackgroundColorJsonLd(spec: BackgroundColorSpec): object[] {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: `How to Make ${spec.colorName} Background ID Photos`,
      description: `Generate ${spec.colorName} background ID photos online with ${BRAND} AI background removal. Color value: ${spec.hexValue}.`,
      step: [
        { '@type': 'HowToStep', position: 1, name: 'Upload Photo', text: 'Take a front-facing photo with your phone and upload it to the Zan Pic editor.' },
        { '@type': 'HowToStep', position: 2, name: 'AI Background Removal', text: 'Click Smart Remove BG and AI automatically detects and removes the original background.' },
        { '@type': 'HowToStep', position: 3, name: `Choose ${spec.colorName} Background`, text: `Select the ${spec.colorName} background in the ID photo tool and export a high-resolution ID photo.` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: spec.faq.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ]
}

function buildEnBackgroundColorFallback(spec: BackgroundColorSpec): string {
  const useItems = spec.useCases.map((u) => `<li>${escapeHtml(u)}</li>`).join('')
  return `
<div id="seo-fallback" style="max-width:768px;margin:0 auto;padding:24px 20px;font-family:sans-serif;color:#333;line-height:1.8">
  <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
    <span style="display:inline-block;width:48px;height:48px;border-radius:8px;background:${spec.slug === 'gradient' ? 'linear-gradient(135deg,#667eea,#764ba2)' : spec.hexValue};border:2px solid #ddd"></span>
    <span style="font-size:18px;font-weight:600">${escapeHtml(spec.colorName)} Background · ${spec.hexValue}</span>
  </div>
  <h1 style="font-size:24px;font-weight:700;margin-bottom:16px;line-height:1.3">${escapeHtml(spec.title)}</h1>
  <p style="color:#555">${escapeHtml(spec.intro)}</p>
  <h3 style="margin:16px 0 8px">Use Cases</h3>
  <ul>${useItems}</ul>
  <p style="margin-top:20px"><a href="${SITE_URL}" style="display:inline-block;padding:10px 24px;background:#2563eb;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">Make ${escapeHtml(spec.colorName)} Background ID Photo Now</a></p>
</div>`
}

export const EN_BACKGROUND_COLORS_SEO: SeoPageData[] = EN_BACKGROUND_COLORS.map((spec) => ({
  path: `/background/${spec.slug}`,
  title: `${spec.title} — AI Background Replacement | ${BRAND}`,
  description: `${spec.colorName} background ID photo maker: ${spec.hexValue}. AI auto background removal and replacement. Generate ${spec.colorName} ID photos free online. Browser-based, privacy protected.`,
  ogType: 'website',
  jsonLd: buildEnBackgroundColorJsonLd(spec),
  noscriptHtml: buildEnBackgroundColorFallback(spec),
}))

/* ================================================================
   English SEO: Image format conversion pages (programmatic)
   ================================================================ */

function buildEnConvertSpecJsonLd(spec: ConvertSpec): object[] {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: `How to Convert ${spec.sourceFormat} to ${spec.targetFormat}`,
      description: `${spec.sourceFormat} to ${spec.targetFormat}: Free online converter, browser-based local processing, custom compression quality.`,
      step: [
        { '@type': 'HowToStep', position: 1, name: 'Upload Image', text: `Drag your ${spec.sourceFormat} image into the upload area or click to select a file.` },
        { '@type': 'HowToStep', position: 2, name: 'Adjust Settings', text: 'Adjust compression quality or background fill color as needed.' },
        { '@type': 'HowToStep', position: 3, name: 'Start Conversion', text: `Click the convert button and the browser automatically converts ${spec.sourceFormat} to ${spec.targetFormat}.` },
        { '@type': 'HowToStep', position: 4, name: 'Download Result', text: `After conversion, click the download button to save the ${spec.targetExt} file locally.` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: spec.faq.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ]
}

function buildEnConvertSpecFallback(spec: ConvertSpec): string {
  const sourcePros = spec.sourcePros.map((p) => `<li>${escapeHtml(p)}</li>`).join('')
  const targetPros = spec.targetPros.map((p) => `<li>${escapeHtml(p)}</li>`).join('')
  const useItems = spec.commonUses.map((u) => `<li>${escapeHtml(u)}</li>`).join('')
  return `
<div id="seo-fallback" style="max-width:768px;margin:0 auto;padding:24px 20px;font-family:sans-serif;color:#333;line-height:1.8">
  <p style="display:inline-block;padding:2px 10px;background:#e8f0fe;border-radius:4px;font-size:12px;color:#1a73e8;margin-bottom:12px">${escapeHtml(spec.sourceFormat)} → ${escapeHtml(spec.targetFormat)}</p>
  <h1 style="font-size:24px;font-weight:700;margin-bottom:16px;line-height:1.3">${escapeHtml(spec.title)}</h1>
  <p style="color:#555">${escapeHtml(spec.intro)}</p>
  <h3 style="margin:16px 0 8px">${escapeHtml(spec.sourceFormat)} Pros</h3>
  <ul>${sourcePros}</ul>
  <h3 style="margin:16px 0 8px">${escapeHtml(spec.targetFormat)} Pros</h3>
  <ul>${targetPros}</ul>
  <h3 style="margin:16px 0 8px">Common Uses</h3>
  <ul>${useItems}</ul>
  <p style="margin-top:20px"><a href="${SITE_URL}" style="display:inline-block;padding:10px 24px;background:#2563eb;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">Start Conversion</a></p>
</div>`
}

export const EN_CONVERT_SPECS_SEO: SeoPageData[] = EN_CONVERT_SPECS.map((spec) => ({
  path: `/convert/${spec.slug}`,
  title: `${spec.title} | ${BRAND}`,
  description: `${spec.sourceFormat} to ${spec.targetFormat}: Free online conversion, browser-based local processing, custom compression quality. ${spec.intro.slice(0, 60)}`,
  ogType: 'website',
  jsonLd: buildEnConvertSpecJsonLd(spec),
  noscriptHtml: buildEnConvertSpecFallback(spec),
}))

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

function buildToolPageFallbackEn(h1: string, intro: string, features: string[]): string {
  const featureItems = features.map((f) => `<li>${f}</li>`).join('\n    ')
  return `
<div id="seo-fallback" style="max-width:768px;margin:0 auto;padding:24px 20px;font-family:sans-serif;color:#333;line-height:1.8">
  <h1 style="font-size:24px;font-weight:700;margin-bottom:16px">${h1}</h1>
  <p style="margin-bottom:16px">${intro}</p>
  <h3 style="margin-bottom:8px">Core Features</h3>
  <ul style="margin-bottom:20px">
    ${featureItems}
  </ul>
  <p style="margin-top:20px"><a href="${SITE_URL}" style="display:inline-block;padding:10px 24px;background:#2563eb;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">Get Started</a></p>
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
    inLanguage: 'en',
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

  // Compute hreflang alternates (English is default/root, Chinese at /zh/)
  const isZh = page.path.startsWith('/zh')
  const enPath = isZh ? page.path.replace(/^\/zh/, '') || '/' : page.path
  const zhPath = enPath === '/' ? '/zh/' : `/zh${enPath}`

  let tags = ''
  tags += `<title>${escapeHtml(page.title)}</title>\n`
  tags += `<meta name="description" content="${escapeHtml(page.description)}">\n`
  tags += `<link rel="canonical" href="${escapeHtml(canonical)}">\n`
  // hreflang
  tags += `<link rel="alternate" hreflang="en" href="${escapeHtml(SITE_URL + enPath)}">\n`
  tags += `<link rel="alternate" hreflang="zh-CN" href="${escapeHtml(SITE_URL + zhPath)}">\n`
  tags += `<link rel="alternate" hreflang="x-default" href="${escapeHtml(SITE_URL)}">\n`
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
