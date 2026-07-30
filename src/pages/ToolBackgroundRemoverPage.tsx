import { Link } from 'react-router-dom'
import { ContentLayout } from '../components/ContentLayout'
import { usePageMeta } from '../hooks/usePageMeta'

const FAQ_ITEMS = [
  {
    q: 'AI 抠图需要上传图片到服务器吗？',
    a: '不需要。Zan Pic 的 AI 抠图完全在浏览器本地运行，使用 ONNX Runtime 在设备上直接推理。图片数据不会离开你的设备，绝对保护隐私。',
  },
  {
    q: '抠图速度和效果如何？',
    a: '使用 IS-Net 深度学习模型，在支持 WebGPU 的浏览器（Chrome 113+ / Edge 113+）上推理速度极快，通常 2-5 秒完成。CPU 回退模式下约 10-20 秒。边缘处理通过形态学精修，可达发丝级精度。',
  },
  {
    q: '复杂背景的图片能扣好吗？',
    a: 'IS-Net 模型擅长处理复杂场景。对于特别复杂的边缘（如透明物体、细碎毛发），可以使用「涂抹抠图」功能手动调整 — 绿色涂抹强制保留，红色涂抹强制删除。',
  },
  {
    q: '支持哪些图片格式？',
    a: '支持 JPEG、PNG、WebP、AVIF 等常见格式。处理结果可导出为 PNG（保留透明背景）或其他格式。',
  },
  {
    q: '移动端可以使用吗？',
    a: '可以。移动端浏览器同样支持 WebGPU/WASM 推理。建议使用 Chrome 或 Edge 浏览器以获得最佳性能。首次使用时需要下载 AI 模型文件（约 24MB），建议在 Wi-Fi 环境下操作。',
  },
]

const RELATED_POSTS = [
  { slug: 'ai-background-removal-isnet', title: 'AI 抠图技术原理：IS-Net 模型详解' },
  { slug: 'ecommerce-product-background-removal', title: '电商商品图背景移除最佳实践' },
  { slug: 'webgpu-ai-inference-acceleration', title: 'WebGPU 加速：让浏览器 AI 推理快 10 倍' },
]

export default function ToolBackgroundRemoverPage() {
  usePageMeta({
    title: 'AI 免费在线抠图工具 - 智能移除图片背景 | Zan Pic',
    description: '免费 AI 在线抠图工具，无需上传到服务器。基于 IS-Net 深度学习模型，WebGPU 加速，发丝级抠图精度。支持智能抠图和涂抹抠图两种模式，完全浏览器本地处理。',
    path: '/background-remover',
  })

  return (
    <ContentLayout>
      <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)', lineHeight: 1.3 }}>
        AI 免费在线抠图工具
      </h1>
      <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '28px', lineHeight: 1.7 }}>
        Zan Pic 提供强大的 AI 智能抠图功能，一键移除图片背景。基于 IS-Net（Iterative Spatial Refinement Network）深度学习模型，
        在浏览器本地完成推理，无需将图片上传到任何服务器。支持 WebGPU 硬件加速，处理速度快、精度高。
        配备边缘形态学精修算法，轻松处理发丝等复杂边缘，输出透明背景的高质量 PNG 图片。
      </p>

      <Link
        to="/"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 28px',
          background: 'var(--accent)', color: '#fff', borderRadius: '8px', fontWeight: 600,
          textDecoration: 'none', fontSize: '15px', marginBottom: '32px',
        }}
      >
        立即体验 AI 抠图
      </Link>

      <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-primary)' }}>
        三步完成背景移除
      </h2>
      <div style={{ display: 'grid', gap: '12px', marginBottom: '32px' }}>
        {[
          { step: '1', title: '上传图片', desc: '拖拽或点击上传你的图片，支持 JPEG、PNG、WebP 等格式。' },
          { step: '2', title: 'AI 自动抠图', desc: '点击「智能抠图」，AI 自动识别并移除背景，2-5 秒即可完成。不满意可用「涂抹抠图」手动调整。' },
          { step: '3', title: '下载透明背景图', desc: '确认效果满意后，导出为 PNG 格式，获得透明背景的高质量图片。' },
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
        核心功能
      </h2>
      <ul style={{ marginBottom: '32px', color: 'var(--text-secondary)', lineHeight: 1.9, paddingLeft: '20px' }}>
        <li>智能抠图 — IS-Net 模型自动识别主体，全自动移除背景</li>
        <li>涂抹抠图 — AI 辅助 + 手动涂抹，绿色保留/红色删除，精细调整边缘</li>
        <li>边缘精修 — 形态学膨胀/腐蚀/开闭操作 + 高斯羽化 + 对比度锐化</li>
        <li>WebGPU 加速 — 支持硬件加速的浏览器上推理速度提升数倍</li>
        <li>完全离线 — 模型缓存后无需网络，所有处理在浏览器中完成</li>
        <li>批量处理 — 支持多张图片连续抠图，提升工作效率</li>
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
