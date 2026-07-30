import { useParams, Navigate, Link } from 'react-router-dom'
import { ContentLayout } from '../components/ContentLayout'
import { usePageMeta } from '../hooks/usePageMeta'
import { getBackgroundColorSpec, BACKGROUND_COLORS } from '../data/background-colors'

export default function BackgroundToolPage() {
  const { slug } = useParams<{ slug: string }>()
  const spec = slug ? getBackgroundColorSpec(slug) : undefined

  usePageMeta({
    title: spec ? `${spec.title} | Zan Pic` : '证件照背景色 | Zan Pic',
    description: spec
      ? `${spec.colorName}背景证件照制作：色值 ${spec.hexValue}。AI 自动抠图换背景，在线免费生成${spec.colorName}底证件照。浏览器本地处理，保护隐私。`
      : '证件照背景色制作工具',
    path: `/background/${slug || ''}`,
  })

  if (!spec) {
    return <Navigate to="/id-photo-maker" replace />
  }

  const related = BACKGROUND_COLORS.filter((s) => s.slug !== spec.slug)

  return (
    <ContentLayout>
      {/* Breadcrumb */}
      <nav style={{ fontSize: '13px', color: 'var(--text-tertiary)', marginBottom: '12px' }}>
        <Link to="/" style={{ color: 'var(--accent)' }}>首页</Link>
        {' / '}
        <Link to="/id-photo-maker" style={{ color: 'var(--accent)' }}>证件照制作</Link>
        {' / '}
        <span style={{ color: 'var(--text-secondary)' }}>{spec.colorName}底证件照</span>
      </nav>

      <h1 style={{ fontSize: '26px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)', lineHeight: 1.3 }}>
        {spec.title}
      </h1>
      <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.7 }}>
        {spec.intro}
      </p>

      {/* Color preview */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '16px',
        padding: '16px 20px', background: 'var(--bg-secondary)', borderRadius: '12px',
        border: '1px solid var(--border-light)', marginBottom: '24px',
      }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: '12px',
          background: spec.slug === 'gradient' ? 'linear-gradient(135deg, #667eea, #764ba2)' : spec.hexValue,
          border: '2px solid var(--border-light)', flexShrink: 0,
        }} />
        <div>
          <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>{spec.colorName}背景</div>
          <div style={{ fontSize: '13px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
            HEX: {spec.hexValue} {spec.rgbValue !== 'gradient' && `| RGB: ${spec.rgbValue}`}
          </div>
        </div>
      </div>

      {/* CTA */}
      <Link
        to="/"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 28px',
          background: 'var(--accent)', color: '#fff', borderRadius: '8px', fontWeight: 600,
          textDecoration: 'none', fontSize: '15px', marginBottom: '32px',
        }}
      >
        立即制作{spec.colorName}底证件照
      </Link>

      {/* How to */}
      <h2 style={{ fontSize: '19px', fontWeight: 600, marginBottom: '14px', color: 'var(--text-primary)' }}>
        三步制作{spec.colorName}底证件照
      </h2>
      <div style={{ display: 'grid', gap: '10px', marginBottom: '32px' }}>
        {[
          { step: '1', title: '上传照片', desc: '用手机拍一张正面免冠照，上传到 Zan Pic 编辑器。' },
          { step: '2', title: 'AI 智能抠图', desc: '点击「智能抠图」，AI 自动识别人像并移除原背景。' },
          { step: '3', title: `选择${spec.colorName}底导出`, desc: `在证件照功能中选择${spec.colorName}背景，确认后导出高清证件照。` },
        ].map((item) => (
          <div key={item.step} style={{
            display: 'flex', gap: '14px', padding: '12px 14px',
            background: 'var(--bg-secondary)', borderRadius: '10px',
            border: '1px solid var(--border-light)',
          }}>
            <span style={{
              width: '28px', height: '28px', borderRadius: '50%',
              background: 'var(--accent)', color: '#fff', display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontWeight: 700,
              fontSize: '13px', flexShrink: 0,
            }}>
              {item.step}
            </span>
            <div>
              <strong style={{ color: 'var(--text-primary)', fontSize: '14px' }}>{item.title}</strong>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: '3px 0 0' }}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Use cases */}
      <h2 style={{ fontSize: '19px', fontWeight: 600, marginBottom: '12px', color: 'var(--text-primary)' }}>
        {spec.colorName}底证件照适用场景
      </h2>
      <ul style={{ marginBottom: '28px', color: 'var(--text-secondary)', lineHeight: 1.9, paddingLeft: '20px' }}>
        {spec.useCases.map((use) => (
          <li key={use}>{use}</li>
        ))}
      </ul>

      {/* FAQ */}
      <h2 style={{ fontSize: '19px', fontWeight: 600, marginBottom: '14px', color: 'var(--text-primary)' }}>
        常见问题
      </h2>
      <div style={{ marginBottom: '32px' }}>
        {spec.faq.map((item, i) => (
          <div key={i} style={{
            marginBottom: '10px', padding: '12px 14px',
            background: 'var(--bg-secondary)', borderRadius: '10px',
            border: '1px solid var(--border-light)',
          }}>
            <strong style={{ color: 'var(--text-primary)', fontSize: '14px' }}>{item.q}</strong>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: '6px 0 0', lineHeight: 1.7 }}>{item.a}</p>
          </div>
        ))}
      </div>

      {/* Related colors */}
      <h2 style={{ fontSize: '19px', fontWeight: 600, marginBottom: '12px', color: 'var(--text-primary)' }}>
        其他背景色
      </h2>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '40px' }}>
        {related.map((s) => (
          <Link
            key={s.slug}
            to={`/background/${s.slug}`}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '8px 14px', background: 'var(--bg-secondary)', borderRadius: '20px',
              border: '1px solid var(--border-light)', textDecoration: 'none',
              fontSize: '13px', color: 'var(--text-secondary)',
            }}
          >
            <span style={{
              width: '16px', height: '16px', borderRadius: '4px',
              background: s.slug === 'gradient' ? 'linear-gradient(135deg, #667eea, #764ba2)' : s.hexValue,
              border: '1px solid var(--border-light)',
            }} />
            {s.colorName}
          </Link>
        ))}
      </div>
    </ContentLayout>
  )
}
