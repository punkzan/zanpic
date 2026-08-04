import { useParams, Navigate, Link } from 'react-router-dom'
import { ContentLayout } from '../components/ContentLayout'
import { usePageMeta } from '../hooks/usePageMeta'
import { useSeoLang } from '../hooks/useSeoLang'
import { getBackgroundColorSpec, BACKGROUND_COLORS } from '../data/background-colors'
import { getEnBackgroundColorSpec, EN_BACKGROUND_COLORS } from '../data/en-background-colors'
import { t } from '../lib/seo-ui-strings'
import { buildAlternates } from '../lib/seo-lang'

export default function BackgroundToolPage() {
  const { slug } = useParams<{ slug: string }>()
  const lang = useSeoLang()
  const isEn = lang === 'en'

  // Try Chinese spec first, fallback to English
  const spec = slug
    ? (getBackgroundColorSpec(slug) ?? (isEn ? getEnBackgroundColorSpec(slug) : undefined))
    : undefined
  const colors = isEn ? EN_BACKGROUND_COLORS : BACKGROUND_COLORS

  usePageMeta({
    title: spec ? `${spec.title} | Zan Pic` : isEn
      ? 'ID Photo Background Colors | Zan Pic'
      : '证件照背景色 | Zan Pic',
    description: spec
      ? isEn
        ? `${spec.colorName} background ID photo maker: color ${spec.hexValue}. AI auto background removal, free online ${spec.colorName} ID photo generation. Browser-based local processing, privacy protected.`
        : `${spec.colorName}背景证件照制作：色值 ${spec.hexValue}。AI 自动抠图换背景，在线免费生成${spec.colorName}底证件照。浏览器本地处理，保护隐私。`
      : isEn
        ? 'ID photo background color tool'
        : '证件照背景色制作工具',
    path: `/background/${slug || ''}`,
    alternates: buildAlternates(`/background/${slug || ''}`),
  })

  if (!spec) {
    return <Navigate to={isEn ? '/id-photo-maker' : '/zh/id-photo-maker'} replace />
  }

  const related = colors.filter((s) => s.slug !== spec.slug)

  return (
    <ContentLayout>
      {/* Breadcrumb */}
      <nav style={{ fontSize: '13px', color: 'var(--text-tertiary)', marginBottom: '12px' }}>
        <Link to={isEn ? '/' : '/zh/'} style={{ color: 'var(--accent)' }}>{t('home', lang)}</Link>
        {' / '}
        <Link to={isEn ? '/id-photo-maker' : '/zh/id-photo-maker'} style={{ color: 'var(--accent)' }}>{t('idPhotoMaker', lang)}</Link>
        {' / '}
        <span style={{ color: 'var(--text-secondary)' }}>{isEn ? `${spec.colorName} Background ID Photo` : `${spec.colorName}底证件照`}</span>
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
          <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
            {isEn ? `${spec.colorName} Background` : `${spec.colorName}背景`}
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
            HEX: {spec.hexValue} {spec.rgbValue !== 'gradient' && `| RGB: ${spec.rgbValue}`}
          </div>
        </div>
      </div>

      {/* CTA */}
      <Link
        to={isEn ? '/' : '/zh/'}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 28px',
          background: 'var(--accent)', color: '#fff', borderRadius: '8px', fontWeight: 600,
          textDecoration: 'none', fontSize: '15px', marginBottom: '32px',
        }}
      >
        {isEn ? `Make ${spec.colorName} Background ID Photo Now` : `立即制作${spec.colorName}底证件照`}
      </Link>

      {/* How to */}
      <h2 style={{ fontSize: '19px', fontWeight: 600, marginBottom: '14px', color: 'var(--text-primary)' }}>
        {isEn ? `How to Make ${spec.colorName} Background ID Photo in 3 Steps` : `三步制作${spec.colorName}底证件照`}
      </h2>
      <div style={{ display: 'grid', gap: '10px', marginBottom: '32px' }}>
        {[
          {
            step: '1',
            title: t('stepUpload', lang),
            desc: isEn
              ? 'Take a front-facing photo with your phone and upload it to the Zan Pic editor.'
              : '用手机拍一张正面免冠照，上传到 Zan Pic 编辑器。',
          },
          {
            step: '2',
            title: t('stepBgRemove', lang),
            desc: isEn
              ? 'Click "Smart Remove BG" and AI will automatically detect and remove the original background.'
              : '点击「智能抠图」，AI 自动识别人像并移除��背景。',
          },
          {
            step: '3',
            title: isEn ? `Choose ${spec.colorName} Background` : `选择${spec.colorName}底导出`,
            desc: isEn
              ? `Select the ${spec.colorName} background in the ID photo tool, then export a high-resolution ID photo.`
              : `在证件照功能中选择${spec.colorName}背景，确认后导出高清证件照。`,
          },
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
        {isEn ? `${spec.colorName} Background Use Cases` : `${spec.colorName}底证件照适用场景`}
      </h2>
      <ul style={{ marginBottom: '28px', color: 'var(--text-secondary)', lineHeight: 1.9, paddingLeft: '20px' }}>
        {spec.useCases.map((use) => (
          <li key={use}>{use}</li>
        ))}
      </ul>

      {/* FAQ */}
      <h2 style={{ fontSize: '19px', fontWeight: 600, marginBottom: '14px', color: 'var(--text-primary)' }}>
        {t('faq', lang)}
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
        {isEn ? 'Other Background Colors' : '其他背景色'}
      </h2>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '40px' }}>
        {related.map((s) => (
          <Link
            key={s.slug}
            to={isEn ? `/background/${s.slug}` : `/zh/background/${s.slug}`}
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
