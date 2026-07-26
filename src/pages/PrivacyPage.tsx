import { useTranslation } from 'react-i18next'
import { ContentLayout } from '../components/ContentLayout'
import { usePageMeta } from '../hooks/usePageMeta'

export default function PrivacyPage() {
  const { t } = useTranslation()
  usePageMeta({
    title: `${t('pages.privacy.title', { defaultValue: '隐私政策' })} - Zan Pic`,
    description: t('pages.privacy.summary', { defaultValue: '隐私政策' }),
    path: '/privacy',
  })

  return (
    <ContentLayout>
      <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '20px', color: 'var(--text-primary)' }}>
        {t('pages.privacy.title', { defaultValue: '隐私政策' })}
      </h2>

      <p className="page-highlight">
        <strong>{t('pages.privacy.summary')}</strong>
      </p>

      <h3>{t('pages.privacy.s1Title')}</h3>
      <p>{t('pages.privacy.s1Body', { brand: 'Zan Pic' })}</p>

      <h3>{t('pages.privacy.s2Title')}</h3>
      <p>{t('pages.privacy.s2Body')}</p>

      <h3>{t('pages.privacy.s3Title')}</h3>
      <p>{t('pages.privacy.s3Body')}</p>

      <h3>{t('pages.privacy.s4Title')}</h3>
      <p>{t('pages.privacy.s4Body')}</p>
      <ul>
        <li>{t('pages.privacy.s4Ads')}</li>
        <li>{t('pages.privacy.s4Fonts')}</li>
        <li>{t('pages.privacy.s4Cdn')}</li>
      </ul>
      <p>{t('pages.privacy.s4Cookie')}</p>

      <h3>{t('pages.privacy.s5Title')}</h3>
      <p>{t('pages.privacy.s5Body')}</p>

      <h3>{t('pages.privacy.s6Title')}</h3>
      <p>{t('pages.privacy.s6Body')}</p>

      <p className="page-updated">{t('pages.privacy.lastUpdated')}</p>
    </ContentLayout>
  )
}
