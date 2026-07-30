import { Link } from 'react-router-dom'
import { ContentLayout } from '../components/ContentLayout'
import { usePageMeta } from '../hooks/usePageMeta'

const FAQ_ITEMS = [
  {
    q: '证件照可以用于护照和签证吗？',
    a: 'Zan Pic 生成的证件照符合常见规格（1寸、2寸、小2寸），底色可选红白蓝三种标准色。但各国签证要求略有不同，建议在提交前核对具体规格要求。',
  },
  {
    q: '拍照时需要注意什么？',
    a: '建议在光线均匀的环境下拍摄，免冠正面，表情自然，双眼睁开。避免阴影、反光或杂物遮挡面部。拍摄后可上传到 Zan Pic 自动处理。',
  },
  {
    q: 'AI 自动裁剪准确吗？',
    a: 'Zan Pic 使用 AI 模型分析人像位置，自动识别头部和肩部区域，按标准比例裁剪。对于复杂背景或多人照片，建议先用 AI 抠图移除背景后再生成证件照。',
  },
  {
    q: '支持哪些证件照规格？',
    a: '目前支持标准一寸照（295×413px）、二寸照（413×579px）、小二寸照（413×531px），均按 300DPI 输出。更多规格持续更新中。',
  },
  {
    q: '手机拍摄的照片能用吗？',
    a: '完全可以。现代手机摄像头像素足够生成高质量证件照。建议使用后置摄像头、保持 1-2 米距离、在自然光下拍摄，效果最佳。',
  },
]

const RELATED_POSTS = [
  { slug: 'how-to-take-id-photo', title: '如何拍出适合证件照的照片' },
  { slug: 'id-photo-background-color-guide', title: '证件照背景色选择指南' },
]

export default function ToolIdPhotoPage() {
  usePageMeta({
    title: '在线证件照制作 - 免费生成标准证件照 | Zan Pic',
    description: '免费在线证件照生成工具。AI 自动抠图换背景，支持一寸/二寸/小二寸规格，红白蓝三色背景。手机拍照即可生成标准证件照，保护隐私。',
    path: '/id-photo-maker',
  })

  return (
    <ContentLayout>
      {/* Hero */}
      <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)', lineHeight: 1.3 }}>
        免费在线证件照制作工具
      </h1>
      <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '28px', lineHeight: 1.7 }}>
        只需上传一张正面照片，Zan Pic 即可帮你自动生成标准证件照。AI 智能抠图移除背景，精确识别面部位置，自动裁剪为标准尺寸。
        支持一寸、二寸、小二寸等多种规格，红底、白底、蓝底自由切换。全程在浏览器本地处理，无需上传到服务器，保护你的隐私安全。
      </p>

      <Link
        to="/"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 28px',
          background: 'var(--accent)', color: '#fff', borderRadius: '8px', fontWeight: 600,
          textDecoration: 'none', fontSize: '15px', marginBottom: '32px',
        }}
      >
        立即制作证件照
      </Link>

      {/* How it works */}
      <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-primary)' }}>
        三步制作证件照
      </h2>
      <div style={{ display: 'grid', gap: '12px', marginBottom: '32px' }}>
        {[
          { step: '1', title: '上传照片', desc: '用手机或相机拍一张正面免冠照，上传到 Zan Pic 编辑器。' },
          { step: '2', title: 'AI 自动处理', desc: '点击「证件照」功能，AI 自动识别人像、移除背景、裁剪为标准尺寸。' },
          { step: '3', title: '选择底色导出', desc: '选择红底、白底或蓝底，确认效果后一键下载高清证件照。' },
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

      {/* Features */}
      <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '12px', color: 'var(--text-primary)' }}>
        核心功能
      </h2>
      <ul style={{ marginBottom: '32px', color: 'var(--text-secondary)', lineHeight: 1.9, paddingLeft: '20px' }}>
        <li>AI 智能抠图 — 基于 IS-Net 深度学习模型，精准分离人像与背景</li>
        <li>自动人脸定位 — Alpha 通道分析人像位置，智能裁剪为证件照比例</li>
        <li>三色背景 — 红色 (#D9001B)、白色 (#FFFFFF)、蓝色 (#438EDB)，一键切换</li>
        <li>多规格支持 — 一寸 295×413px、二寸 413×579px、小二寸 413×531px (300DPI)</li>
        <li>六寸排版 — 自动在 6 寸相纸上排列多张证件照，方便冲印</li>
        <li>边缘精修 — 形态学开闭操作 + 高斯羽化 + 对比度锐化，发丝级精细处理</li>
      </ul>

      {/* FAQ */}
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

      {/* Related posts */}
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
