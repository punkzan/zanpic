import { useParams, Navigate, Link } from 'react-router-dom'
import { ContentLayout } from '../components/ContentLayout'
import { usePageMeta } from '../hooks/usePageMeta'
import { useSeoLang } from '../hooks/useSeoLang'
import { getSocialMediaSize, SOCIAL_MEDIA_SIZES } from '../data/social-media-sizes'
import { t } from '../lib/seo-ui-strings'
import { buildAlternates } from '../lib/seo-lang'

export default function SocialMediaSizePage() {
  const { slug } = useParams<{ slug: string }>()
  const lang = useSeoLang()
  const isEn = lang === 'en'
  const size = slug ? getSocialMediaSize(slug) : undefined

  usePageMeta({
    title: size ? `${size.title} | Zan Pic` : isEn ? 'Social Media Image Sizes | Zan Pic' : '社媒图片尺寸 | Zan Pic',
    description: size
      ? isEn
        ? `${size.platform} ${size.type} size: ${size.pixelWidth}×${size.pixelHeight}px, aspect ratio ${size.aspectRatio}. Use Zan Pic to crop and resize images online.`
        : `${size.platform} ${size.type}尺寸：${size.pixelWidth}×${size.pixelHeight}px，宽高比 ${size.aspectRatio}。使用 Zan Pic 在线裁剪和调整图片尺寸。`
      : isEn
        ? 'Social media image size guide for Instagram, Facebook, YouTube, Twitter, LinkedIn, and more.'
        : '社交媒体图片尺寸大全',
    path: `/resize/${slug || ''}`,
    alternates: buildAlternates(`/resize/${slug || ''}`),
  })

  if (!size) {
    return <Navigate to={isEn ? '/photo-resizer' : '/zh/photo-resizer'} replace />
  }

  const related = SOCIAL_MEDIA_SIZES.filter((s) => s.slug !== size.slug).slice(0, 6)

  return (
    <ContentLayout>
      {/* Breadcrumb */}
      <nav style={{ fontSize: '13px', color: 'var(--text-tertiary)', marginBottom: '12px' }}>
        <Link to={isEn ? '/' : '/zh/'} style={{ color: 'var(--accent)' }}>{t('home', lang)}</Link>
        {' / '}
        <Link to={isEn ? '/photo-resizer' : '/zh/photo-resizer'} style={{ color: 'var(--accent)' }}>{t('photoResizer', lang)}</Link>
        {' / '}
        <span style={{ color: 'var(--text-secondary)' }}>{size.platform} {size.type}</span>
      </nav>

      <h1 style={{ fontSize: '26px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)', lineHeight: 1.3 }}>
        {size.title}
      </h1>
      <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.7 }}>
        {size.intro}
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
        {t('ctaCropImage', lang)}
      </Link>

      {/* Specs table */}
      <h2 style={{ fontSize: '19px', fontWeight: 600, marginBottom: '14px', color: 'var(--text-primary)' }}>
        {t('specsTitle', lang)}
      </h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '28px', fontSize: '14px' }}>
        <tbody>
          <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
            <td style={{ padding: '10px 12px', color: 'var(--text-tertiary)', width: '40%' }}>{t('pixelSize', lang)}</td>
            <td style={{ padding: '10px 12px', color: 'var(--text-primary)', fontWeight: 600 }}>{size.pixelWidth} × {size.pixelHeight} px</td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
            <td style={{ padding: '10px 12px', color: 'var(--text-tertiary)' }}>{t('aspectRatio', lang)}</td>
            <td style={{ padding: '10px 12px', color: 'var(--text-primary)', fontWeight: 600 }}>{size.aspectRatio}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
            <td style={{ padding: '10px 12px', color: 'var(--text-tertiary)' }}>{t('recommendedFormat', lang)}</td>
            <td style={{ padding: '10px 12px', color: 'var(--text-primary)', fontWeight: 600 }}>{size.recommendedFormat}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
            <td style={{ padding: '10px 12px', color: 'var(--text-tertiary)' }}>{t('maxFileSize', lang)}</td>
            <td style={{ padding: '10px 12px', color: 'var(--text-primary)', fontWeight: 600 }}>{size.maxFileSize}</td>
          </tr>
        </tbody>
      </table>

      {/* Tips */}
      <h2 style={{ fontSize: '19px', fontWeight: 600, marginBottom: '12px', color: 'var(--text-primary)' }}>
        {t('tips', lang)}
      </h2>
      <ul style={{ marginBottom: '28px', color: 'var(--text-secondary)', lineHeight: 1.9, paddingLeft: '20px' }}>
        {size.tips.map((tip) => (
          <li key={tip}>{tip}</li>
        ))}
      </ul>

      {/* How to */}
      <h2 style={{ fontSize: '19px', fontWeight: 600, marginBottom: '14px', color: 'var(--text-primary)' }}>
        {t('howToCrop', lang)} {size.aspectRatio}
      </h2>
      <div style={{ display: 'grid', gap: '10px', marginBottom: '32px' }}>
        {[
          {
            step: '1',
            title: t('stepUpload', lang),
            desc: isEn
              ? 'Drag or click to upload your image to the Zan Pic editor.'
              : '拖拽或点击上传你的图片到 Zan Pic 编辑器。',
          },
          {
            step: '2',
            title: t('stepCrop', lang),
            desc: isEn
              ? `Use the crop tool to select the ${size.aspectRatio} ratio or custom pixel size ${size.pixelWidth}×${size.pixelHeight}px.`
              : `使用裁剪工具，选择 ${size.aspectRatio} 比例或自定义像素尺寸 ${size.pixelWidth}×${size.pixelHeight}px。`,
          },
          {
            step: '3',
            title: t('stepOptionalBg', lang),
            desc: isEn
              ? 'If you need to change the background, use AI background removal to remove the original background.'
              : '如果需要换背景，使用 AI 智能抠图移除原背景。',
          },
          {
            step: '4',
            title: t('stepDownload', lang),
            desc: isEn
              ? `Export as ${size.recommendedFormat} format, keeping the file size within ${size.maxFileSize}.`
              : `导出为 ${size.recommendedFormat} 格式，确保文件大小 ${size.maxFileSize} 以内。`,
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
        {size.faq.map((item, i) => (
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

      {/* Related sizes */}
      <h2 style={{ fontSize: '19px', fontWeight: 600, marginBottom: '12px', color: 'var(--text-primary)' }}>
        {t('relatedSizes', lang)}
      </h2>
      <ul style={{ marginBottom: '40px', paddingLeft: '20px' }}>
        {related.map((s) => (
          <li key={s.slug} style={{ marginBottom: '6px' }}>
            <Link to={isEn ? `/resize/${s.slug}` : `/zh/resize/${s.slug}`} style={{ color: 'var(--accent)', fontSize: '14px' }}>
              {s.title}
            </Link>
          </li>
        ))}
      </ul>
    </ContentLayout>
  )
}
