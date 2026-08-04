import { useParams, Navigate, Link } from 'react-router-dom'
import { ContentLayout } from '../components/ContentLayout'
import { usePageMeta } from '../hooks/usePageMeta'
import { useSeoLang } from '../hooks/useSeoLang'
import { getIdPhotoSpec, ID_PHOTO_SPECS } from '../data/id-photo-specs'
import { getEnIdPhotoSpec, EN_ID_PHOTO_SPECS } from '../data/en-id-photo-specs'
import { t } from '../lib/seo-ui-strings'
import { buildAlternates } from '../lib/seo-lang'

export default function IdPhotoSpecPage() {
  const { slug } = useParams<{ slug: string }>()
  const lang = useSeoLang()
  const isEn = lang === 'en'
  const spec = slug ? (isEn ? getEnIdPhotoSpec(slug) : getIdPhotoSpec(slug)) : undefined

  usePageMeta({
    title: spec ? `${spec.title} | Zan Pic` : isEn ? 'ID Photo Specifications | Zan Pic' : '证件照规格 | Zan Pic',
    description: spec
      ? isEn
        ? `${spec.country} ${spec.type} size: ${spec.pixelWidth}×${spec.pixelHeight}px (${spec.mmWidth}×${spec.mmHeight}mm), ${spec.backgroundColor} background. Make online for free with Zan Pic.`
        : `${spec.country}${spec.type}规格：${spec.pixelWidth}×${spec.pixelHeight}px (${spec.mmWidth}×${spec.mmHeight}mm)，${spec.backgroundColor}背景。在线免费制作${spec.type}。`
      : isEn
        ? 'ID photo size specifications for passports, visas, and documents worldwide.'
        : '证件照规格大全',
    path: `/id-photo/${slug || ''}`,
    alternates: buildAlternates(`/id-photo/${slug || ''}`),
  })

  if (!spec) {
    return <Navigate to={isEn ? '/id-photo-maker' : '/zh/id-photo-maker'} replace />
  }

  const relatedSpecs = (isEn ? EN_ID_PHOTO_SPECS : ID_PHOTO_SPECS)
    .filter((s) => s.slug !== spec.slug)
    .slice(0, 5)

  return (
    <ContentLayout>
      {/* Breadcrumb */}
      <nav style={{ fontSize: '13px', color: 'var(--text-tertiary)', marginBottom: '12px' }}>
        <Link to={isEn ? '/' : '/zh/'} style={{ color: 'var(--accent)' }}>{t('home', lang)}</Link>
        {' / '}
        <Link to={isEn ? '/id-photo-maker' : '/zh/id-photo-maker'} style={{ color: 'var(--accent)' }}>{t('idPhotoMaker', lang)}</Link>
        {' / '}
        <span style={{ color: 'var(--text-secondary)' }}>{isEn ? `${spec.country} ${spec.type}` : `${spec.country}${spec.type}`}</span>
      </nav>

      <h1 style={{ fontSize: '26px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)', lineHeight: 1.3 }}>
        {spec.title}
      </h1>
      <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.7 }}>
        {spec.intro}
      </p>

      {/* CTA */}
      <Link
        to={isEn ? '/' : '/zh/'}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 28px',
          background: 'var(--accent)', color: '#fff', borderRadius: '8px', fontWeight: 600,
          textDecoration: 'none', fontSize: '15px', marginBottom: '32px',
        }}
      >
        {t('ctaMakeIdPhoto', lang)}{isEn ? ' ' : ''}{spec.type}
      </Link>

      {/* Specs table */}
      <h2 style={{ fontSize: '19px', fontWeight: 600, marginBottom: '14px', color: 'var(--text-primary)' }}>
        {t('specsTitle', lang)}
      </h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '28px', fontSize: '14px' }}>
        <tbody>
          <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
            <td style={{ padding: '10px 12px', color: 'var(--text-tertiary)', width: '40%' }}>{t('pixelSize', lang)}</td>
            <td style={{ padding: '10px 12px', color: 'var(--text-primary)', fontWeight: 600 }}>{spec.pixelWidth} × {spec.pixelHeight} px</td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
            <td style={{ padding: '10px 12px', color: 'var(--text-tertiary)' }}>{t('physicalSize', lang)}</td>
            <td style={{ padding: '10px 12px', color: 'var(--text-primary)', fontWeight: 600 }}>{spec.mmWidth} × {spec.mmHeight} mm</td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
            <td style={{ padding: '10px 12px', color: 'var(--text-tertiary)' }}>{t('resolution', lang)}</td>
            <td style={{ padding: '10px 12px', color: 'var(--text-primary)', fontWeight: 600 }}>{spec.dpi} DPI</td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
            <td style={{ padding: '10px 12px', color: 'var(--text-tertiary)' }}>{t('backgroundColor', lang)}</td>
            <td style={{ padding: '10px 12px', color: 'var(--text-primary)', fontWeight: 600 }}>
              <span style={{ display: 'inline-block', width: '16px', height: '16px', borderRadius: '3px', background: spec.backgroundHex, verticalAlign: 'middle', marginRight: '6px', border: '1px solid var(--border-light)' }} />
              {spec.backgroundColor}
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
            <td style={{ padding: '10px 12px', color: 'var(--text-tertiary)' }}>{t('headHeight', lang)}</td>
            <td style={{ padding: '10px 12px', color: 'var(--text-primary)', fontWeight: 600 }}>{spec.headHeightMin}-{spec.headHeightMax} mm</td>
          </tr>
        </tbody>
      </table>

      {/* Dress code */}
      <h2 style={{ fontSize: '19px', fontWeight: 600, marginBottom: '12px', color: 'var(--text-primary)' }}>
        {t('dressCode', lang)}
      </h2>
      <ul style={{ marginBottom: '28px', color: 'var(--text-secondary)', lineHeight: 1.9, paddingLeft: '20px' }}>
        {spec.dressCode.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      {/* Composition rules */}
      <h2 style={{ fontSize: '19px', fontWeight: 600, marginBottom: '12px', color: 'var(--text-primary)' }}>
        {t('compositionRules', lang)}
      </h2>
      <ul style={{ marginBottom: '28px', color: 'var(--text-secondary)', lineHeight: 1.9, paddingLeft: '20px' }}>
        {spec.compositionRules.map((rule) => (
          <li key={rule}>{rule}</li>
        ))}
      </ul>

      {/* Common uses */}
      <h2 style={{ fontSize: '19px', fontWeight: 600, marginBottom: '12px', color: 'var(--text-primary)' }}>
        {t('commonUses', lang)}
      </h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '32px' }}>
        {spec.commonUses.map((use) => (
          <span key={use} style={{
            padding: '6px 12px', background: 'var(--bg-secondary)', borderRadius: '20px',
            fontSize: '13px', color: 'var(--text-secondary)', border: '1px solid var(--border-light)',
          }}>
            {use}
          </span>
        ))}
      </div>

      {/* How to make */}
      <h2 style={{ fontSize: '19px', fontWeight: 600, marginBottom: '14px', color: 'var(--text-primary)' }}>
        {t('howToMake', lang)}{isEn ? ' ' : ''}{spec.type}
      </h2>
      <div style={{ display: 'grid', gap: '10px', marginBottom: '32px' }}>
        {[
          {
            step: '1',
            title: t('stepUpload', lang),
            desc: isEn
              ? 'Take a front-facing, no-hat photo with your phone and upload it to the Zan Pic editor.'
              : '用手机拍一张正面免冠照，上传到 Zan Pic 编辑器。',
          },
          {
            step: '2',
            title: t('stepBgRemove', lang),
            desc: isEn
              ? 'Click Smart Background Removal and let AI remove the background automatically. Use the brush tool to refine edges if needed.'
              : '点击「智能抠图」，AI 自动移除背景。可选「涂抹抠图」微调边缘。',
          },
          {
            step: '3',
            title: t('stepIdPhoto', lang),
            desc: isEn
              ? `Select the ID Photo feature to automatically crop to the standard ${spec.mmWidth}×${spec.mmHeight}mm size.`
              : `选择「证件照」功能，自动裁剪为${spec.mmWidth}×${spec.mmHeight}mm标准尺寸。`,
          },
          {
            step: '4',
            title: t('stepExport', lang),
            desc: isEn
              ? `Choose a ${spec.backgroundColor} background and export the high-resolution ID photo.`
              : `选择${spec.backgroundColor}背景，确认效果后导出高清证件照。`,
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

      {/* Related specs */}
      <h2 style={{ fontSize: '19px', fontWeight: 600, marginBottom: '12px', color: 'var(--text-primary)' }}>
        {t('relatedSpecs', lang)}
      </h2>
      <ul style={{ marginBottom: '40px', paddingLeft: '20px' }}>
        {relatedSpecs.map((s) => (
          <li key={s.slug} style={{ marginBottom: '6px' }}>
            <Link to={isEn ? `/id-photo/${s.slug}` : `/zh/id-photo/${s.slug}`} style={{ color: 'var(--accent)', fontSize: '14px' }}>
              {s.title}
            </Link>
          </li>
        ))}
      </ul>
    </ContentLayout>
  )
}
