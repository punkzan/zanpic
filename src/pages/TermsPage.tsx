import { useTranslation } from 'react-i18next'
import { ContentLayout } from '../components/ContentLayout'
import { usePageMeta } from '../hooks/usePageMeta'

export default function TermsPage() {
  const { t } = useTranslation()
  usePageMeta({
    title: `${t('pages.terms.title', { defaultValue: 'Terms of Service' })} - Zan Pic`,
    description: t('pages.terms.summary', {
      defaultValue: 'Terms of Service for Zan Pic, the free browser-based image editor.',
    }),
    path: '/terms',
  })

  return (
    <ContentLayout>
      <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '20px', color: 'var(--text-primary)' }}>
        {t('pages.terms.title', { defaultValue: 'Terms of Service' })}
      </h2>

      <p className="page-highlight">
        <strong>{t('pages.terms.summary')}</strong>
      </p>

      <h3>{t('pages.terms.s1Title')}</h3>
      <p>{t('pages.terms.s1Body')}</p>

      <h3>{t('pages.terms.s2Title')}</h3>
      <p>{t('pages.terms.s2Body')}</p>

      <h3>{t('pages.terms.s3Title')}</h3>
      <p>{t('pages.terms.s3Body')}</p>
      <ul>
        <li>{t('pages.terms.s3a')}</li>
        <li>{t('pages.terms.s3b')}</li>
        <li>{t('pages.terms.s3c')}</li>
        <li>{t('pages.terms.s3d')}</li>
      </ul>

      <h3>{t('pages.terms.s4Title')}</h3>
      <p>{t('pages.terms.s4Body')}</p>

      <h3>{t('pages.terms.s5Title')}</h3>
      <p>{t('pages.terms.s5Body')}</p>

      <h3>{t('pages.terms.s6Title')}</h3>
      <p>{t('pages.terms.s6Body')}</p>

      <h3>{t('pages.terms.s7Title')}</h3>
      <p>{t('pages.terms.s7Body', { email: 'fanlnq@163.com' })}</p>

      <h3>{t('pages.terms.s8Title')}</h3>
      <p>{t('pages.terms.s8Body')}</p>

      <p className="page-updated">{t('pages.terms.lastUpdated')}</p>
    </ContentLayout>
  )
}