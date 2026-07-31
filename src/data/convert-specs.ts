/**
 * Programmatic SEO data: Image format conversion specs.
 * Each entry generates a standalone page at /convert/:slug with a working converter.
 */

export interface ConvertSpec {
  slug: string
  sourceFormat: string
  targetFormat: string
  sourceMime: string
  targetMime: string
  sourceExt: string
  targetExt: string
  title: string
  intro: string
  sourcePros: string[]
  sourceCons: string[]
  targetPros: string[]
  targetCons: string[]
  commonUses: string[]
  tips: string[]
  faq: { q: string; a: string }[]
}

export const CONVERT_SPECS: ConvertSpec[] = [
  {
    slug: 'jpg-to-png',
    sourceFormat: 'JPG',
    targetFormat: 'PNG',
    sourceMime: 'image/jpeg',
    targetMime: 'image/png',
    sourceExt: '.jpg',
    targetExt: '.png',
    title: 'JPG 转 PNG — 免费在线转换工具',
    intro:
      'JPG 转 PNG 是最常见的图片格式转换需求之一。JPG（JPEG）采用有损压缩，适合照片存储，但不支持透明背景。PNG 使用无损压缩，支持 Alpha 透明通道，适合图标、Logo、UI 元素和需要透明背景的图像。使用 Zan Pic 的在线转换工具，你可以免费将 JPG 图片转换为 PNG 格式，所有处理在浏览器本地完成，图片不会上传到服务器，完全保护隐私。转换过程仅需几秒钟，支持批量操作。',
    sourcePros: ['文件体积小', '适合照片存储', '所有设备支持', '有损压缩但画质损失可控'],
    sourceCons: ['不支持透明背景', '多次编辑后画质下降', '不适合文字和线条图'],
    targetPros: ['支持透明背景', '无损压缩', '适合图标和 UI 元素', '文字边缘清晰不模糊'],
    targetCons: ['文件体积通常更大', '照片类图片体积可能比 JPG 大 3-5 倍'],
    commonUses: ['Logo 设计', '图标制作', '需要透明背景的合成图', 'UI 设计稿', '截图存储'],
    tips: [
      '转换后 PNG 文件通常比 JPG 大 2-5 倍，如果对体积有要求请考虑 WebP 格式',
      'JPG 是有损格式，转 PNG 无法恢复已损失的画质，但可以防止后续编辑造成更多损失',
      '如果需要透明背景，JPG 转 PNG 后仍需手动抠图去除背景',
    ],
    faq: [
      { q: 'JPG 转 PNG 会损失画质吗？', a: '不会。PNG 使用无损压缩，转换过程不会引入额外的画质损失。但需要注意的是，原始 JPG 已经是有损压缩的结果，转 PNG 无法恢复 JPG 压缩时丢失的细节。' },
      { q: 'JPG 转 PNG 后文件变大了怎么办？', a: '这是正常现象，PNG 无损压缩的文件通常比 JPG 大 2-5 倍。如果对体积敏感，建议使用 WebP 格式，它兼具无损和透明支持，体积更小。' },
      { q: 'JPG 转 PNG 能获得透明背景吗？', a: '不能直接获得。JPG 不支持透明通道，转 PNG 后背景仍为不透明。你需要使用 AI 抠图工具去除背景后才能获得透明效果。' },
    ],
  },
  {
    slug: 'png-to-jpg',
    sourceFormat: 'PNG',
    targetFormat: 'JPG',
    sourceMime: 'image/png',
    targetMime: 'image/jpeg',
    sourceExt: '.png',
    targetExt: '.jpg',
    title: 'PNG 转 JPG — 免费在线转换工具',
    intro:
      'PNG 转 JPG 可以大幅减小文件体积，特别适合在网页、邮件和社交媒体中使用。PNG 文件通常比同等画质的 JPG 大 2-5 倍，因为 PNG 使用无损压缩。将 PNG 转为 JPG 后，文件体积可缩减 60%-80%，同时画质损失几乎不可察觉。Zan Pic 的转换工具在浏览器本地运行，支持自定义 JPG 压缩质量（0-100%），转换后可直接下载。对于有透明背景的 PNG，转换时可选白色或自定义颜色填充背景。',
    sourcePros: ['支持透明背景', '无损压缩', '文字和线条清晰', '适合图标和 UI'],
    sourceCons: ['文件体积大', '照片类图片体积过大', '不适合网页加速'],
    targetPros: ['文件体积小', '适合照片存储', '网页加载快', '兼容性最强'],
    targetCons: ['不支持透明背景', '有损压缩', '文字边缘可能出现伪影'],
    commonUses: ['网页图片优化', '邮件附件压缩', '社交媒体上传', '照片存储', '减小文件体积'],
    tips: [
      'PNG 有透明背景时，转 JPG 前需选择背景填充色（默认白色）',
      '建议压缩质量设为 85-90%，体积和画质的最佳平衡点',
      '对于文字截图，JPG 可能产生模糊伪影，建议保持 PNG 或使用高质量设置',
    ],
    faq: [
      { q: 'PNG 转 JPG 后透明背景怎么办？', a: 'JPG 不支持透明通道，转换时透明区域会自动填充为白色（或你选择的背景色）。如果需要保留透明效果，请使用 PNG 或 WebP 格式。' },
      { q: 'PNG 转 JPG 质量设多少最好？', a: '一般建议设为 85-90%，这是体积和画质的最佳平衡点。对于照片类图片，80% 也几乎看不出差异；对于需要高保真的图片，可设为 95%。' },
      { q: '转换后文件能小多少？', a: '通常 PNG 转 JPG（85% 质量）可以减小 60%-80% 的文件体积。具体取决于图片内容，颜色丰富的照片压缩效果更好。' },
    ],
  },
  {
    slug: 'jpg-to-webp',
    sourceFormat: 'JPG',
    targetFormat: 'WebP',
    sourceMime: 'image/jpeg',
    targetMime: 'image/webp',
    sourceExt: '.jpg',
    targetExt: '.webp',
    title: 'JPG 转 WebP — 免费在线转换工具',
    intro:
      'WebP 是 Google 开发的现代图片格式，相比 JPG 可减小 25%-35% 的文件体积，同时保持同等画质。将 JPG 转为 WebP 可以显著提升网页加载速度，改善 Core Web Vitals 指标，有利于 SEO 排名。WebP 同时支持有损和无损压缩，还支持透明背景（JPG 不支持）。目前所有主流浏览器（Chrome、Firefox、Safari、Edge）均已支持 WebP。Zan Pic 的转换工具在浏览器本地运行，支持自定义压缩质量，转换后可直接下载 .webp 文件。',
    sourcePros: ['兼容性最广', '几乎所有设备支持', '压缩算法成熟'],
    sourceCons: ['文件体积比 WebP 大 25-35%', '不支持透明背景', '不支持动画'],
    targetPros: ['比 JPG 小 25-35%', '支持透明背景', '支持动画', '所有主流浏览器支持', 'Google 推荐格式'],
    targetCons: ['部分老旧软件不支持', 'iOS 14 以下不支持', '编辑软件支持有限'],
    commonUses: ['网页图片优化', '电商商品图', '博客配图', 'CDN 加速', 'Core Web Vitals 优化'],
    tips: [
      'WebP 压缩质量设为 80-85% 时，体积比同等画质的 JPG 小约 30%',
      '使用 WebP 可提升 PageSpeed Insights 得分 5-15 分',
      '建议同时保留原始 JPG 作为 fallback，使用 <picture> 标签实现格式自适应',
    ],
    faq: [
      { q: 'WebP 格式所有浏览器都支持吗？', a: 'Chrome、Firefox、Safari（14+）、Edge 均支持 WebP，覆盖率超过 97%。仅 IE 和极少数老旧浏览器不支持。对于不支持的环境，可使用 <picture> 标签提供 JPG fallback。' },
      { q: 'JPG 转 WebP 能减小多少体积？', a: '在同等视觉画质下，WebP 比 JPG 小 25%-35%。对于大尺寸照片，可节省数百 KB，显著提升网页加载速度。' },
      { q: 'WebP 适合 SEO 吗？', a: '非常适合。Google 官方推荐使用 WebP 格式，更小的文件体积可以提升 LCP（最大内容绘制）指标，改善 Core Web Vitals 得分，间接提升搜索排名。' },
    ],
  },
  {
    slug: 'webp-to-jpg',
    sourceFormat: 'WebP',
    targetFormat: 'JPG',
    sourceMime: 'image/webp',
    targetMime: 'image/jpeg',
    sourceExt: '.webp',
    targetExt: '.jpg',
    title: 'WebP 转 JPG — 免费在线转换工具',
    intro:
      '虽然 WebP 格式越来越普及，但部分软件、平台和老旧系统仍然不支持 WebP。当你需要在不支持 WebP 的环境中使用图片时，将 WebP 转为 JPG 是最简单的解决方案。Zan Pic 的转换工具可以在浏览器中直接完成 WebP 到 JPG 的转换，无需安装任何软件。转换支持自定义 JPG 压缩质量，所有处理在本地完成，图片不上传服务器。转换后你可以获得一个兼容性极强的 JPG 文件，可在任何设备和平台上使用。',
    sourcePros: ['文件体积小', '支持透明和动画', 'Google 推荐格式'],
    sourceCons: ['部分软件不支持', '部分社交平台不支持上传', '老旧系统不兼容'],
    targetPros: ['兼容性最强', '所有设备和平台支持', '压缩效果好'],
    targetCons: ['文件比 WebP 大', '不支持透明背景', '不支持动画'],
    commonUses: ['兼容性转换', '老旧系统使用', '社交平台上传', '办公文档插图', '打印输出'],
    tips: [
      'WebP 有透明背景时，转 JPG 会自动填充白色背景',
      '建议 JPG 质量设为 90%，最大程度保留 WebP 的画质',
      '部分 WebP 是动画格式，转 JPG 只会保留第一帧',
    ],
    faq: [
      { q: '为什么需要把 WebP 转成 JPG？', a: '部分软件（如老版本 Photoshop、某些办公软件）和平台（如部分社交媒体、电商后台）不支持 WebP 上传。转为 JPG 可确保最大兼容性。' },
      { q: 'WebP 转 JPG 会损失画质吗？', a: '会有轻微损失。WebP 和 JPG 都是有损压缩格式，转换会引入一次额外的压缩。建议 JPG 质量设为 90% 以上，画质损失几乎不可察觉。' },
      { q: '动画 WebP 转 JPG 会怎样？', a: 'JPG 不支持动画，转换后只会保留 WebP 动画的第一帧。如果需要保留动画，请转为 GIF 格式。' },
    ],
  },
  {
    slug: 'png-to-webp',
    sourceFormat: 'PNG',
    targetFormat: 'WebP',
    sourceMime: 'image/png',
    targetMime: 'image/webp',
    sourceExt: '.png',
    targetExt: '.webp',
    title: 'PNG 转 WebP — 免费在线转换工具',
    intro:
      'PNG 转 WebP 是减小文件体积的最佳方案之一。WebP 无损压缩的文件比 PNG 小 20%-30%，同时完全保留透明背景支持。这意味着你可以在不牺牲画质和透明效果的前提下，大幅减小图标、Logo 和 UI 元素的文件体积。对于需要大量图片资源的网站，PNG 转 WebP 可以显著提升页面加载速度。Zan Pic 的转换工具支持无损和有损两种模式，在浏览器本地完成所有处理，保护隐私安全。',
    sourcePros: ['无损压缩', '支持透明背景', '文字边缘清晰', '兼容性广'],
    sourceCons: ['文件体积大', '不适合照片', '网页加载慢'],
    targetPros: ['比 PNG 小 20-30%（无损）', '支持透明背景', '支持动画', 'Google 推荐格式', '网页加载快'],
    targetCons: ['部分老旧软件不支持', 'iOS 14 以下不支持', '编辑工具支持有限'],
    commonUses: ['网页图标优化', 'Logo 压缩', 'UI 资源优化', '透明背景图片', 'Core Web Vitals 优化'],
    tips: [
      '无损 WebP 比 PNG 小约 26%，是透明图片的最佳网页格式',
      '对于不需要透明的图标，有损 WebP（质量 80%）可以再减小 30-50%',
      '使用 WebP 替代 PNG 可显著改善 LCP 指标',
    ],
    faq: [
      { q: 'PNG 转 WebP 透明背景会保留吗？', a: '会保留。WebP 支持 Alpha 透明通道，与 PNG 一样可以存储透明背景信息。转换后透明效果完全不变。' },
      { q: 'PNG 转 WebP 是有损还是无损？', a: '两种都支持。无损模式下 WebP 比 PNG 小约 26% 且画质完全一致；有损模式可以进一步减小体积但会损失部分画质。Zan Pic 工具支持两种模式切换。' },
      { q: 'WebP 透明图片兼容哪些浏览器？', a: 'Chrome、Firefox、Safari 14+、Edge 均支持带透明通道的 WebP。覆盖率超过 97%，仅 IE 和极少数老旧浏览器不支持。' },
    ],
  },
  {
    slug: 'webp-to-png',
    sourceFormat: 'WebP',
    targetFormat: 'PNG',
    sourceMime: 'image/webp',
    targetMime: 'image/png',
    sourceExt: '.webp',
    targetExt: '.png',
    title: 'WebP 转 PNG — 免费在线转换工具',
    intro:
      '当你需要在不支持 WebP 的设计软件或系统中使用带透明背景的图片时，将 WebP 转为 PNG 是最佳选择。PNG 是支持透明背景的通用格式，几乎所有软件和平台都支持。Zan Pic 的转换工具可以无损地将 WebP 转换为 PNG，完整保留透明通道和所有像素信息。转换在浏览器本地完成，不上传任何文件。特别适合从网页下载的 WebP 图片需要导入 Photoshop、Sketch 等设计工具时使用。',
    sourcePros: ['文件体积小', '支持透明和动画', '现代浏览器支持'],
    sourceCons: ['部分设计软件不支持', '办公软件兼容性差', '部分平台不支持上传'],
    targetPros: ['无损压缩', '支持透明背景', '所有软件支持', '设计工具兼容性好'],
    targetCons: ['文件体积大', '不适合照片存储', '网页加载较慢'],
    commonUses: ['设计软件导入', '办公文档插图', '兼容性转换', '打印输出', '保留透明背景'],
    tips: [
      'WebP 转 PNG 是无损转换，画质完全不变',
      '转换后文件会变大，这是正常现象（PNG 压缩率低于 WebP）',
      '动画 WebP 转 PNG 只保留第一帧',
    ],
    faq: [
      { q: 'WebP 转 PNG 会损失画质吗？', a: '不会。PNG 使用无损压缩，转换过程中不会损失任何画质。WebP 中的所有像素和透明通道信息都会完整保留。' },
      { q: '为什么 WebP 转 PNG 后文件变大了？', a: '因为 PNG 的压缩效率低于 WebP。WebP 无损模式比 PNG 小约 26%，所以转换后文件体积增大约 35% 是正常的。' },
      { q: '哪些场景需要把 WebP 转成 PNG？', a: '当需要在不支持 WebP 的软件（如老版本 Photoshop）中编辑图片，或将图片导入办公文档时，PNG 是更兼容的选择。' },
    ],
  },
  {
    slug: 'bmp-to-png',
    sourceFormat: 'BMP',
    targetFormat: 'PNG',
    sourceMime: 'image/bmp',
    targetMime: 'image/png',
    sourceExt: '.bmp',
    targetExt: '.png',
    title: 'BMP 转 PNG — 免费在线转换工具',
    intro:
      'BMP（Bitmap）是 Windows 的原生位图格式，采用无压缩存储，文件体积通常非常大。将 BMP 转为 PNG 可以在完全不损失画质的前提下，将文件体积缩小 50%-90%。PNG 同样是无损格式，但使用了高效的 DEFLATE 压缩算法。Zan Pic 的转换工具可以快速将 BMP 文件转为 PNG，所有处理在浏览器本地完成。这是减小 BMP 文件体积最简单有效的方法。',
    sourcePros: ['无损存储', '格式简单', 'Windows 原生支持'],
    sourceCons: ['文件体积巨大', '不支持透明背景', '不支持压缩', '不适合网页使用'],
    targetPros: ['无损压缩', '文件比 BMP 小 50-90%', '支持透明背景', '所有平台支持'],
    targetCons: ['文件比 JPG 和 WebP 大', '不适合照片存储'],
    commonUses: ['BMP 文件压缩', '老旧系统图片迁移', '无损画质存储', '网页图片优化'],
    tips: [
      'BMP 转 PNG 是无损转换，画质完全不变',
      'BMP 文件通常比 PNG 大 5-20 倍，转换后体积大幅缩减',
      '如果进一步需要减小体积，可以将 PNG 再转为 WebP',
    ],
    faq: [
      { q: 'BMP 转 PNG 会损失画质吗？', a: '完全不会。BMP 和 PNG 都是无损格式，转换过程不会丢失任何像素信息。转换后图像质量与原始 BMP 完全一致。' },
      { q: 'BMP 转 PNG 能减小多少体积？', a: 'BMP 不使用任何压缩，而 PNG 使用 DEFLATE 压缩。转换后文件通常减小 50%-90%，具体取决于图片内容的复杂度。' },
      { q: 'BMP 转 PNG 需要安装软件吗？', a: '不需要。Zan Pic 的转换工具完全在浏览器中运行，无需安装任何软件或插件。打开网页即可使用。' },
    ],
  },
  {
    slug: 'bmp-to-jpg',
    sourceFormat: 'BMP',
    targetFormat: 'JPG',
    sourceMime: 'image/bmp',
    targetMime: 'image/jpeg',
    sourceExt: '.bmp',
    targetExt: '.jpg',
    title: 'BMP 转 JPG — 免费在线转换工具',
    intro:
      'BMP 转 JPG 是减小文件体积最有效的方法之一。BMP 文件不使用压缩，一张 1920×1080 的 BMP 图片可能超过 6MB，而转换为 JPG（90% 质量）后通常只有 200-500KB，体积缩小超过 90%。Zan Pic 的转换工具支持自定义 JPG 压缩质量，在浏览器本地完成所有处理。特别适合需要将 BMP 截图或扫描件通过邮件发送、上传到网站或存储到云盘时使用。',
    sourcePros: ['无损存储', '格式简单', 'Windows 原生支持'],
    sourceCons: ['文件体积巨大', '不支持压缩', '不适合传输和存储', '不适合网页使用'],
    targetPros: ['文件极小（比 BMP 小 90%+）', '兼容性最强', '适合照片存储', '网页加载快'],
    targetCons: ['有损压缩', '不支持透明背景', '多次编辑后画质下降'],
    commonUses: ['BMP 文件压缩', '截图压缩存储', '邮件附件减小', '网页图片上传', '云存储节省空间'],
    tips: [
      'BMP 转 JPG 体积可缩小 90% 以上，是最高效的压缩方式',
      '建议质量设为 85-90%，获得最佳体积与画质平衡',
      'BMP 截图中如果有文字，建议质量设为 95% 以上避免文字模糊',
    ],
    faq: [
      { q: 'BMP 转 JPG 画质损失大吗？', a: '在 85-90% 质量设置下，肉眼几乎无法察觉画质差异。BMP 转 JPG 是有损压缩，但对于照片和截图来说，体积缩小 90% 以上的优势远大于轻微的画质损失。' },
      { q: 'BMP 转 JPG 后文件能小多少？', a: 'BMP 不使用任何压缩，一张 6MB 的 BMP 转为 JPG（90% 质量）后通常只有 200-500KB，体积缩小超过 90%。' },
      { q: 'BMP 转 JPG 支持透明背景吗？', a: 'BMP 和 JPG 都不支持透明背景，所以转换不涉及透明通道问题。背景会保持原样。' },
    ],
  },
  {
    slug: 'gif-to-png',
    sourceFormat: 'GIF',
    targetFormat: 'PNG',
    sourceMime: 'image/gif',
    targetMime: 'image/png',
    sourceExt: '.gif',
    targetExt: '.png',
    title: 'GIF 转 PNG — 免费在线转换工具',
    intro:
      'GIF 转 PNG 有两个主要用途：一是将静态 GIF 转为 PNG 获得更好的压缩效果和更广的兼容性；二是从 GIF 动画中提取单帧作为 PNG 图片。PNG 8 位调色板模式（PNG-8）的文件通常比同等画质的 GIF 更小。Zan Pic 的转换工具会将 GIF 的第一帧转换为 PNG 图片。所有处理在浏览器本地完成，不上传任何文件。',
    sourcePros: ['支持动画', '兼容性广', '调色板模式文件小'],
    sourceCons: ['最多 256 色', '不支持半透明', '压缩效率低于 PNG'],
    targetPros: ['支持全彩（1670 万色）', '支持半透明', '压缩效率更高', '无损压缩'],
    targetCons: ['不支持动画', 'PNG-24 文件比 GIF 大', '不适合简单动画'],
    commonUses: ['GIF 静态图转换', '提取 GIF 单帧', '提升图像色彩', '获得半透明效果'],
    tips: [
      'GIF 转 PNG 会提取第一帧，如需提取其他帧请使用专业的 GIF 编辑工具',
      'GIF 最多 256 色，转 PNG 后虽然支持全彩，但已丢失的颜色无法恢复',
      '如果 GIF 有透明背景，转 PNG 后透明效果会保留',
    ],
    faq: [
      { q: 'GIF 转 PNG 后动画还在吗？', a: '不在。PNG 不支持动画，转换后只会保留 GIF 动画的第一帧。如果需要保留动画，请保持 GIF 格式或转为 WebP/AVIF 动画格式。' },
      { q: 'GIF 转 PNG 透明背景会保留吗？', a: '会保留。GIF 的 1 位透明（全透明或全不透明）会完整转换到 PNG 中。而且 PNG 还支持半透明（Alpha 通道），这是 GIF 不具备的。' },
      { q: 'GIF 转 PNG 文件会变小吗？', a: '如果是简单的调色板图像，PNG-8 通常比 GIF 小 5-10%。如果是复杂图像转为 PNG-24，文件可能变大但色彩更丰富。' },
    ],
  },
  {
    slug: 'gif-to-jpg',
    sourceFormat: 'GIF',
    targetFormat: 'JPG',
    sourceMime: 'image/gif',
    targetMime: 'image/jpeg',
    sourceExt: '.gif',
    targetExt: '.jpg',
    title: 'GIF 转 JPG — 免费在线转换工具',
    intro:
      'GIF 转 JPG 适合将静态 GIF 图片转换为体积更小的 JPG 格式。GIF 虽然使用 LZW 无损压缩，但仅支持 256 色，对于照片类图像效果较差。JPG 支持全彩（1670 万色）和更高的压缩比，在保持更好画质的同时文件更小。Zan Pic 的转换工具会将 GIF 的第一帧转为 JPG 图片，转换后透明背景自动填充为白色。所有处理在浏览器本地完成。',
    sourcePros: ['支持动画', '兼容性广', '无损压缩'],
    sourceCons: ['最多 256 色', '文件比 JPG 大', '不适合照片', '不支持半透明'],
    targetPros: ['支持全彩', '文件体积小', '压缩效率高', '适合照片存储'],
    targetCons: ['不支持动画', '不支持透明背景', '有损压缩'],
    commonUses: ['GIF 静态图压缩', '提升色彩质量', '减小文件体积', '网页图片优化'],
    tips: [
      'GIF 转 JPG 会提取第一帧，动画效果会丢失',
      'GIF 的透明背景转 JPG 后会自动填充为白色',
      'GIF 只有 256 色，转 JPG 后虽然支持全彩但无法恢复已丢失的颜色',
    ],
    faq: [
      { q: 'GIF 转 JPG 后动画还在吗？', a: '不在。JPG 不支持动画，转换后只保留 GIF 的第一帧。如果需要动画，请保持 GIF 格式或转为 WebP 动画。' },
      { q: 'GIF 转 JPG 透明背景怎么处理？', a: 'JPG 不支持透明背景，GIF 的透明区域会自动填充为白色。如果需要保留透明效果，请转为 PNG 或 WebP 格式。' },
      { q: 'GIF 转 JPG 文件会变小吗？', a: '通常会变小。JPG 的压缩效率高于 GIF，特别是对于色彩丰富的照片类图像。但对于只有几种颜色的简单图标，GIF 可能更小。' },
    ],
  },
]

export function getConvertSpec(slug: string): ConvertSpec | undefined {
  return CONVERT_SPECS.find((s) => s.slug === slug)
}
