import { useTranslation } from 'react-i18next'
import { ContentLayout } from '../components/ContentLayout'
import { usePageMeta } from '../hooks/usePageMeta'

export default function AboutPage() {
  const { t } = useTranslation()
  usePageMeta({
    title: `${t('pages.about.title', { defaultValue: '关于我们' })} - Zan Pic`,
    description: t('pages.about.intro', { brand: 'Zan Pic', defaultValue: 'Zan Pic 是一款免费在线图片编辑器。' }),
    path: '/about',
  })

  return (
    <ContentLayout>
      <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '20px', color: 'var(--text-primary)' }}>
        {t('pages.about.title', { defaultValue: '关于我们' })}
      </h2>

      <p>{t('pages.about.intro', { brand: 'Zan Pic' })}</p>

      <h3>{t('pages.about.featuresTitle')}</h3>
      <ul>
        <li>{t('pages.about.features.adjust')}</li>
        <li>{t('pages.about.features.filter')}</li>
        <li>{t('pages.about.features.crop')}</li>
        <li>{t('pages.about.features.aiCutout')}</li>
        <li>{t('pages.about.features.smearCutout')}</li>
        <li>{t('pages.about.features.idPhoto')}</li>
        <li>{t('pages.about.features.compress')}</li>
        <li>{t('pages.about.features.convert')}</li>
        <li>{t('pages.about.features.watermark')}</li>
        <li>{t('pages.about.features.export')}</li>
      </ul>

      <h3>{t('pages.about.techTitle')}</h3>
      <ul>
        <li>{t('pages.about.tech.local')}</li>
        <li>{t('pages.about.tech.ai')}</li>
        <li>{t('pages.about.tech.edge')}</li>
        <li>{t('pages.about.tech.theme')}</li>
        <li>{t('pages.about.tech.shortcuts')}</li>
        <li>{t('pages.about.tech.wallpaper')}</li>
      </ul>

      <h3>{t('pages.about.useCasesTitle')}</h3>
      <ul>
        <li>{t('pages.about.useCases.daily')}</li>
        <li>{t('pages.about.useCases.ecommerce')}</li>
        <li>{t('pages.about.useCases.idPhoto')}</li>
        <li>{t('pages.about.useCases.social')}</li>
        <li>{t('pages.about.useCases.batch')}</li>
      </ul>

      <p className="page-highlight">{t('pages.about.cta')}</p>
    </ContentLayout>
  )
}
