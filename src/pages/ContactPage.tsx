import { useTranslation } from 'react-i18next'
import { ContentLayout } from '../components/ContentLayout'
import { usePageMeta } from '../hooks/usePageMeta'

export default function ContactPage() {
  const { t } = useTranslation()
  usePageMeta({
    title: `${t('pages.contact.title', { defaultValue: '联系我们' })} - Zan Pic`,
    description: t('pages.contact.intro', { defaultValue: '联系我们' }),
    path: '/contact',
  })

  return (
    <ContentLayout>
      <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '20px', color: 'var(--text-primary)' }}>
        {t('pages.contact.title', { defaultValue: '联系我们' })}
      </h2>

      <p>{t('pages.contact.intro')}</p>

      <h3>{t('pages.contact.feedbackTitle')}</h3>
      <p>{t('pages.contact.feedbackBody')}</p>

      <h3>{t('pages.contact.contactTitle')}</h3>
      <ul>
        <li>{t('pages.contact.email', { email: 'fanlnq@163.com' })}</li>
      </ul>

      <h3>{t('pages.contact.faqTitle')}</h3>
      <details>
        <summary>{t('pages.contact.faq1Q')}</summary>
        <p>{t('pages.contact.faq1A')}</p>
      </details>
      <details>
        <summary>{t('pages.contact.faq2Q')}</summary>
        <p>{t('pages.contact.faq2A')}</p>
      </details>
      <details>
        <summary>{t('pages.contact.faq3Q')}</summary>
        <p>{t('pages.contact.faq3A')}</p>
      </details>

      <p className="page-updated">{t('pages.contact.footer')}</p>
    </ContentLayout>
  )
}
