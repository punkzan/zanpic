import { Link } from 'react-router-dom'
import { ContentLayout } from '../components/ContentLayout'
import { usePageMeta } from '../hooks/usePageMeta'

const FAQ_ITEMS = [
  {
    q: '调整尺寸会降低画质吗？',
    a: '缩小尺寸通常不会明显降低画质。放大尺寸时，Zan Pic 提供 AI 超分辨率功能（Real-ESRGAN 模型），可将图片放大 2-4 倍同时保持清晰度。',
  },
  {
    q: '可以批量调整多张图片吗？',
    a: '目前 Zan Pic 的尺寸调整功能支持单张操作。你可以逐张上传并调整，所有操作均可撤销重做。批量处理功能正在开发中。',
  },
  {
    q: '社交媒体图片需要什么尺寸？',
    a: 'Instagram 方形帖 1080×1080px，竖版故事 1080×1920px，横版帖 1080×566px。Facebook 封面 820×312px。Twitter 帖图 1200×675px。YouTube 缩略图 1280×720px。',
  },
  {
    q: '支持哪些导出格式？',
    a: '支持 PNG、JPEG、WebP、AVIF 四种格式导出。JPEG 和 WebP 可调节压缩质量，AVIF 压缩率最高。',
  },
]

const RELATED_POSTS = [
  { slug: 'webgpu-ai-inference-acceleration', title: 'WebGPU 加速：让浏览器 AI 推理快 10 倍' },
  { slug: 'ecommerce-product-background-removal', title: '电商商品图背景移除最佳实践' },
]

const PLATFORM_SIZES = [
  { platform: 'Instagram 方形帖', size: '1080 × 1080px', ratio: '1:1' },
  { platform: 'Instagram 竖版故事', size: '1080 × 1920px', ratio: '9:16' },
  { platform: 'Facebook 封面', size: '820 × 312px', ratio: '2.63:1' },
  { platform: 'Twitter 帖图', size: '1200 × 675px', ratio: '16:9' },
  { platform: 'YouTube 缩略图', size: '1280 × 720px', ratio: '16:9' },
  { platform: 'LinkedIn 封面', size: '1584 × 396px', ratio: '4:1' },
]

export default function ToolPhotoResizerPage() {
  usePageMeta({
    title: '在线图片尺寸调整工具 - 免费裁剪缩放 | Zan Pic',
    description: '免费在线图片尺寸调整工具。支持自由裁剪、固定比例裁剪、自定义像素尺寸调整。社交媒体图片规格一键适配。浏览器本地处理，保护隐私。',
    path: '/photo-resizer',
  })

  return (
    <ContentLayout>
      <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)', lineHeight: 1.3 }}>
        在线图片尺寸调整工具
      </h1>
      <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '28px', lineHeight: 1.7 }}>
        需要将图片调整到特定尺寸？Zan Pic 提供灵活的图片尺寸调整功能。支持自由裁剪、固定比例裁剪（1:1 / 4:3 / 3:4 / 16:9 / 9:16 / 3:2）、
        旋转调整以及自定义像素尺寸缩放。搭配 AI 超分辨率功能，放大图片也能保持清晰。所有处理在浏览器本地完成，无需上传图片。
      </p>

      <Link
        to="/"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 28px',
          background: 'var(--accent)', color: '#fff', borderRadius: '8px', fontWeight: 600,
          textDecoration: 'none', fontSize: '15px', marginBottom: '32px',
        }}
      >
        开始调整图片尺寸
      </Link>

      <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-primary)' }}>
        三步调整图片尺寸
      </h2>
      <div style={{ display: 'grid', gap: '12px', marginBottom: '32px' }}>
        {[
          { step: '1', title: '上传图片', desc: '拖拽或点击上传你的图片到编辑器。' },
          { step: '2', title: '选择裁剪比例', desc: '使用裁剪工具，选择自由裁剪或固定比例（1:1/4:3/16:9 等），可旋转辅助线。' },
          { step: '3', title: '导出设定尺寸', desc: '导出时可指定像素宽高、压缩质量和输出格式（PNG/JPEG/WebP/AVIF）。' },
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
        社媒平台推荐尺寸
      </h2>
      <div style={{ overflowX: 'auto', marginBottom: '32px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)' }}>
              <th style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--text-primary)', borderBottom: '2px solid var(--border-light)' }}>平台用途</th>
              <th style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--text-primary)', borderBottom: '2px solid var(--border-light)' }}>推荐尺寸</th>
              <th style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--text-primary)', borderBottom: '2px solid var(--border-light)' }}>比例</th>
            </tr>
          </thead>
          <tbody>
            {PLATFORM_SIZES.map((item, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '10px 12px', color: 'var(--text-primary)' }}>{item.platform}</td>
                <td style={{ padding: '10px 12px', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{item.size}</td>
                <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>{item.ratio}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
