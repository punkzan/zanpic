import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import {
  Wand2,
  CreditCard,
  Crop,
  Palette,
  FileImage,
  ArrowDownUp,
  Stamp,
  Download,
  Upload,
  Check,
  Shield,
  ChevronDown,
  HelpCircle,
} from 'lucide-react'
import { useState, type ReactNode } from 'react'

/**
 * Static, crawlable content block for the homepage.
 *
 * Renders ~300-500 words of unique, indexable content below the editor.
 * Addresses the AdSense "Low value content" flagging for tool-only SPAs
 * by giving crawlers (and human reviewers) substantive text content
 * on the highest-priority URL.
 */
export function HomepageContent() {
  const { t } = useTranslation()

  const features: { icon: typeof Wand2; titleKey: string; bodyKey: string }[] = [
    { icon: Wand2, titleKey: 'homepage.features.aiCutout.title', bodyKey: 'homepage.features.aiCutout.body' },
    { icon: CreditCard, titleKey: 'homepage.features.idPhoto.title', bodyKey: 'homepage.features.idPhoto.body' },
    { icon: Crop, titleKey: 'homepage.features.crop.title', bodyKey: 'homepage.features.crop.body' },
    { icon: Palette, titleKey: 'homepage.features.filter.title', bodyKey: 'homepage.features.filter.body' },
    { icon: FileImage, titleKey: 'homepage.features.compress.title', bodyKey: 'homepage.features.compress.body' },
    { icon: ArrowDownUp, titleKey: 'homepage.features.convert.title', bodyKey: 'homepage.features.convert.body' },
    { icon: Stamp, titleKey: 'homepage.features.watermark.title', bodyKey: 'homepage.features.watermark.body' },
  ]

  const steps: { icon: typeof Upload; titleKey: string; bodyKey: string }[] = [
    { icon: Upload, titleKey: 'homepage.steps.step1.title', bodyKey: 'homepage.steps.step1.body' },
    { icon: Wand2, titleKey: 'homepage.steps.step2.title', bodyKey: 'homepage.steps.step2.body' },
    { icon: Download, titleKey: 'homepage.steps.step3.title', bodyKey: 'homepage.steps.step3.body' },
  ]

  const useCases: string[] = t('homepage.useCases', { returnObjects: true }) as string[]

  const faqs: { qKey: string; aKey: string }[] = [
    { qKey: 'homepage.faq.q1', aKey: 'homepage.faq.a1' },
    { qKey: 'homepage.faq.q2', aKey: 'homepage.faq.a2' },
    { qKey: 'homepage.faq.q3', aKey: 'homepage.faq.a3' },
    { qKey: 'homepage.faq.q4', aKey: 'homepage.faq.a4' },
    { qKey: 'homepage.faq.q5', aKey: 'homepage.faq.a5' },
    { qKey: 'homepage.faq.q6', aKey: 'homepage.faq.a6' },
  ]

  return (
    <section
      aria-label="About Zan Pic"
      className="border-t"
      style={{
        background: 'var(--bg-secondary)',
        borderColor: 'var(--border-light)',
        color: 'var(--text-secondary)',
      }}
    >
      <div className="mx-auto max-w-5xl px-5 py-12 sm:py-16">
        {/* Heading + intro */}
        <header className="mb-10 text-center">
          <h1
            className="mb-4 text-2xl font-semibold sm:text-3xl"
            style={{ color: 'var(--text-primary)' }}
          >
            {t('homepage.heading')}
          </h1>
          <p className="mx-auto max-w-3xl text-[15px] leading-7" style={{ color: 'var(--text-secondary)' }}>
            {t('homepage.intro')}
          </p>
        </header>

        {/* Features grid */}
        <h2
          className="mb-5 text-lg font-semibold"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('homepage.featuresTitle')}
        </h2>
        <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, titleKey, bodyKey }) => (
            <article
              key={titleKey}
              className="rounded-lg p-4"
              style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-light)' }}
            >
              <div className="mb-2 flex items-center gap-2">
                <Icon size={18} style={{ color: 'var(--accent)' }} aria-hidden="true" />
                <h3 className="text-[15px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {t(titleKey)}
                </h3>
              </div>
              <p className="text-[13.5px] leading-6" style={{ color: 'var(--text-secondary)' }}>
                {t(bodyKey)}
              </p>
            </article>
          ))}
        </div>

        {/* 3-step usage */}
        <h2
          className="mb-5 text-lg font-semibold"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('homepage.stepsTitle')}
        </h2>
        <ol className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {steps.map(({ icon: Icon, titleKey, bodyKey }, idx) => (
            <li
              key={titleKey}
              className="relative rounded-lg p-4"
              style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-light)' }}
            >
              <div className="mb-2 flex items-center gap-2">
                <span
                  className="inline-flex h-6 w-6 items-center justify-center rounded-full text-[12px] font-semibold"
                  style={{ background: 'var(--accent)', color: '#fff' }}
                >
                  {idx + 1}
                </span>
                <Icon size={16} style={{ color: 'var(--accent)' }} aria-hidden="true" />
                <h3 className="text-[15px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {t(titleKey)}
                </h3>
              </div>
              <p className="text-[13.5px] leading-6" style={{ color: 'var(--text-secondary)' }}>
                {t(bodyKey)}
              </p>
            </li>
          ))}
        </ol>

        {/* Use cases */}
        <h2
          className="mb-5 text-lg font-semibold"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('homepage.useCasesTitle')}
        </h2>
        <ul className="mb-12 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {Array.isArray(useCases) && useCases.map((item, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2 rounded-md p-2 text-[14px] leading-6"
              style={{ color: 'var(--text-secondary)' }}
            >
              <Check size={16} style={{ color: 'var(--accent)', marginTop: 4, flexShrink: 0 }} aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        {/* Privacy promise */}
        <div
          className="mb-12 rounded-lg p-5"
          style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-light)' }}
        >
          <div className="mb-2 flex items-center gap-2">
            <Shield size={18} style={{ color: 'var(--accent)' }} aria-hidden="true" />
            <h2 className="text-[16px] font-semibold" style={{ color: 'var(--text-primary)' }}>
              {t('homepage.privacyTitle')}
            </h2>
          </div>
          <p className="text-[14px] leading-7" style={{ color: 'var(--text-secondary)' }}>
            {t('homepage.privacyBody')}
          </p>
          <p className="mt-3 text-[13px]">
            <Link
              to="/privacy"
              className="font-medium hover:underline"
              style={{ color: 'var(--accent)' }}
            >
              {t('homepage.privacyLink')} →
            </Link>
          </p>
        </div>

        {/* FAQ */}
        <h2
          className="mb-5 flex items-center gap-2 text-lg font-semibold"
          style={{ color: 'var(--text-primary)' }}
        >
          <HelpCircle size={18} aria-hidden="true" />
          {t('homepage.faqTitle')}
        </h2>
        <div className="space-y-2">
          {faqs.map(({ qKey, aKey }) => (
            <FaqItem key={qKey} q={t(qKey)} a={t(aKey)} />
          ))}
        </div>
      </div>
    </section>
  )
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <details
      open={open}
      onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}
      className="rounded-lg"
      style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-light)' }}
    >
      <summary
        className="flex cursor-pointer items-center justify-between p-3 text-[14.5px] font-medium"
        style={{ color: 'var(--text-primary)' }}
      >
        <span>{q}</span>
        <ChevronDown
          size={16}
          style={{
            color: 'var(--text-tertiary)',
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s ease',
            flexShrink: 0,
            marginLeft: 8,
          }}
          aria-hidden="true"
        />
      </summary>
      <div
        className="px-3 pb-3 text-[13.5px] leading-6"
        style={{ color: 'var(--text-secondary)' }}
      >
        {a}
      </div>
    </details>
  )
}

// Suppress unused warning while keeping helper export for tests
export type { ReactNode }