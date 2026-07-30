import { Link } from 'react-router-dom'
import { ContentLayout } from '../components/ContentLayout'
import { usePageMeta } from '../hooks/usePageMeta'

const FAQ_ITEMS = [
  {
    q: '应用滤镜会改变原图吗？',
    a: '不会。Zan Pic 的所有编辑操作（滤镜、调整、裁剪等）均为非破坏性编辑，你可以随时撤销或修改。只有导出时才生成最终效果。',
  },
  {
    q: '可以叠加多个滤镜吗？',
    a: '可以。你可以在一个图片上应用预设滤镜后再手动调整亮度、对比度、饱和度来微调效果。所有调整实时叠加预览。',
  },
  {
    q: '滤镜适合哪些场景？',
    a: '预设滤镜适用于快速美化照片、统一社媒图片风格、为产品图添加氛围等。不同的滤镜风格适合不同场景 — 暖色适合人像，冷色适合风景，黑白适合强调构图。',
  },
  {
    q: '手机拍的照可以用滤镜吗？',
    a: '当然。手机照片通常色彩偏平淡，通过适当的滤镜和调整可以大幅提升观感。建议先用「鲜艳」滤镜增强色彩，再用「锐化」提升清晰度。',
  },
]

const FILTER_LIST = [
  { name: '黑白', desc: '经典黑白效果，适合人文纪实和强调光影构图的场景。' },
  { name: '复古', desc: '暖黄调 + 轻微褪色，呈现老照片般的怀旧质感。' },
  { name: '暖色', desc: '增强暖色温，为照片增添温暖柔和的氛围，适合人像和美食。' },
  { name: '冷色', desc: '增加冷色调，呈现清新、干净、现代的视觉风格。' },
  { name: '鲜艳', desc: '提升色彩饱和度和对比度，适合风光和需要突出色彩的图片。' },
  { name: '褪色', desc: '降低对比度 + 减淡色彩，营造柔和、文艺的视觉效果。' },
  { name: '锐化', desc: '增强边缘清晰度，弥补拍摄时的轻微模糊。' },
  { name: '模糊', desc: '添加柔焦效果，适合人像美化和背景虚化。' },
]

const RELATED_POSTS = [
  { slug: 'photo-filter-color-grading-guide', title: '图片滤镜调色入门' },
  { slug: 'how-to-take-id-photo', title: '如何拍出适合证件照的照片' },
]

export default function ToolPhotoFilterPage() {
  usePageMeta({
    title: '免费在线图片滤镜工具 - 8种预设滤镜实时预览 | Zan Pic',
    description: '免费在线图片滤镜编辑工具，提供黑白、复古、暖色、冷色、鲜艳、褪色、锐化、模糊等 8 种预设滤镜，支持亮度、对比度、饱和度实时调节。浏览器本地处理。',
    path: '/photo-filter',
  })

  return (
    <ContentLayout>
      <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)', lineHeight: 1.3 }}>
        免费在线图片滤镜工具
      </h1>
      <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '28px', lineHeight: 1.7 }}>
        想让照片更有质感？Zan Pic 提供丰富的图片滤镜和调色功能。8 种预设滤镜一键套用，亮度、对比度、饱和度三大核心参数自由调节。
        所有效果实时预览，所见即所得。支持撤销重做，轻松尝试不同风格，找到最适合你照片的调色方案。
      </p>

      <Link
        to="/"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 28px',
          background: 'var(--accent)', color: '#fff', borderRadius: '8px', fontWeight: 600,
          textDecoration: 'none', fontSize: '15px', marginBottom: '32px',
        }}
      >
        开始编辑照片
      </Link>

      <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-primary)' }}>
        三步为照片添加滤镜
      </h2>
      <div style={{ display: 'grid', gap: '12px', marginBottom: '32px' }}>
        {[
          { step: '1', title: '上传照片', desc: '拖拽或点击上传需要处理的照片，支持 JPEG、PNG、WebP 等格式。' },
          { step: '2', title: '选择滤镜 + 精细调色', desc: '从 8 款预设滤镜中选择喜欢的风格，再用亮度/对比度/饱和度滑块精细调整。' },
          { step: '3', title: '导出成品', desc: '预览效果满意后，一键导出高质量图片，支持多种格式。' },
        ].map((item) => (
          <div
            key={item.step}
            style={{
              display: 'flex', gap: '14px', padding: '14px 16px',
              background: 'var(--bg-secondary)', borderRadius: '10px',
              border: '1px solid var(--border-light)',
            }}
          >
            <span style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: 'var(--accent)', color: '#fff', display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontWeight: 700,
              fontSize: '14px', flexShrink: 0,
            }}>
              {item.step}
            </span>
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>{item.title}</strong>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '4px 0 0' }}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '12px', color: 'var(--text-primary)' }}>
        8 种预设滤镜
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px', marginBottom: '32px' }}>
        {FILTER_LIST.map((filter) => (
          <div
            key={filter.name}
            style={{
              padding: '14px', background: 'var(--bg-secondary)', borderRadius: '10px',
              border: '1px solid var(--border-light)',
            }}
          >
            <strong style={{ color: 'var(--text-primary)', fontSize: '14px' }}>{filter.name}</strong>
            <p style={{ color: 'var(--text-secondary)', fontSize: '12px', margin: '4px 0 0', lineHeight: 1.6 }}>{filter.desc}</p>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '12px', color: 'var(--text-primary)' }}>
        手动调色参数
      </h2>
      <ul style={{ marginBottom: '32px', color: 'var(--text-secondary)', lineHeight: 1.9, paddingLeft: '20px' }}>
        <li><strong>亮度</strong> — 调整图片整体明暗，补偿曝光不足或过曝</li>
        <li><strong>对比度</strong> — 增强明暗反差，让图片更有层次感</li>
        <li><strong>饱和度</strong> — 控制色彩鲜艳程度，从素雅到浓郁随心调节</li>
      </ul>

      <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-primary)' }}>
        常见问题
      </h2>
      <div style={{ marginBottom: '32px' }}>
        {FAQ_ITEMS.map((item, i) => (
          <div
            key={i}
            style={{
              marginBottom: '12px', padding: '14px 16px',
              background: 'var(--bg-secondary)', borderRadius: '10px',
              border: '1px solid var(--border-light)',
            }}
          >
            <strong style={{ color: 'var(--text-primary)', fontSize: '14px' }}>{item.q}</strong>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: '6px 0 0', lineHeight: 1.7 }}>{item.a}</p>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '12px', color: 'var(--text-primary)' }}>
        相关文章
      </h2>
      <ul style={{ marginBottom: '40px', paddingLeft: '20px' }}>
        {RELATED_POSTS.map((post) => (
          <li key={post.slug} style={{ marginBottom: '6px' }}>
            <Link to={`/blog/${post.slug}`} style={{ color: 'var(--accent)' }}>
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </ContentLayout>
  )
}
