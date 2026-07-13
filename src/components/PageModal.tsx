import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useEditorStore } from '../store/editorStore'
import { useBlogStore, getPostField } from '../store/blogStore'
import i18n from '../i18n'

export function PageModal() {
  const { t } = useTranslation()
  const activePage = useEditorStore((s) => s.activePage)
  const setActivePage = useEditorStore((s) => s.setActivePage)

  useEffect(() => {
    if (!activePage) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActivePage(null)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [activePage, setActivePage])

  if (!activePage) return null

  const titles: Record<string, string> = {
    about: t('pages.about.title'),
    privacy: t('pages.privacy.title'),
    contact: t('pages.contact.title'),
    blog: t('pages.blog.title'),
  }

  return createPortal(
    <>
      <div className="page-backdrop" onClick={() => setActivePage(null)} />
      <div className="page-modal" onClick={(e) => e.stopPropagation()}>
        <div className="page-modal-header">
          <h2>{titles[activePage]}</h2>
          <button onClick={() => setActivePage(null)} className="page-modal-close">
            <X size={20} />
          </button>
        </div>
        <div className="page-modal-body">
          {activePage === 'about' && <AboutContent />}
          {activePage === 'privacy' && <PrivacyContent />}
          {activePage === 'contact' && <ContactContent />}
          {activePage === 'blog' && <BlogContent />}
        </div>
      </div>
    </>,
    document.body,
  )
}

/* ============ 关于我们 ============ */
function AboutContent() {
  const { t } = useTranslation()
  return (
    <>
      <p>
        {t('pages.about.intro', { brand: 'Zan Pic' })}
      </p>

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

      <p className="page-highlight">
        {t('pages.about.cta')}
      </p>
    </>
  )
}

/* ============ 隐私政策 ============ */
function PrivacyContent() {
  const { t } = useTranslation()
  return (
    <>
      <p className="page-highlight">
        <strong>{t('pages.privacy.summary')}</strong>
      </p>

      <h3>{t('pages.privacy.s1Title')}</h3>
      <p>
        {t('pages.privacy.s1Body', { brand: 'Zan Pic' })}
      </p>

      <h3>{t('pages.privacy.s2Title')}</h3>
      <p>
        {t('pages.privacy.s2Body')}
      </p>

      <h3>{t('pages.privacy.s3Title')}</h3>
      <p>
        {t('pages.privacy.s3Body')}
      </p>

      <h3>{t('pages.privacy.s4Title')}</h3>
      <p>{t('pages.privacy.s4Body')}</p>
      <ul>
        <li>{t('pages.privacy.s4Ads')}</li>
        <li>{t('pages.privacy.s4Fonts')}</li>
        <li>{t('pages.privacy.s4Cdn')}</li>
      </ul>
      <p>
        {t('pages.privacy.s4Cookie')}
      </p>

      <h3>{t('pages.privacy.s5Title')}</h3>
      <p>
        {t('pages.privacy.s5Body')}
      </p>

      <h3>{t('pages.privacy.s6Title')}</h3>
      <p>
        {t('pages.privacy.s6Body')}
      </p>

      <p className="page-updated">{t('pages.privacy.lastUpdated')}</p>
    </>
  )
}

/* ============ 联系我们 ============ */
function ContactContent() {
  const { t } = useTranslation()
  return (
    <>
      <p>
        {t('pages.contact.intro')}
      </p>

      <h3>{t('pages.contact.feedbackTitle')}</h3>
      <p>
        {t('pages.contact.feedbackBody')}
      </p>

      <h3>{t('pages.contact.contactTitle')}</h3>
      <ul>
        <li>{t('pages.contact.email', { email: 'fanlnq@163.com' })}</li>
      </ul>

      <h3>{t('pages.contact.faqTitle')}</h3>
      <details>
        <summary>{t('pages.contact.faq1Q')}</summary>
        <p>
          {t('pages.contact.faq1A')}
        </p>
      </details>
      <details>
        <summary>{t('pages.contact.faq2Q')}</summary>
        <p>
          {t('pages.contact.faq2A')}
        </p>
      </details>
      <details>
        <summary>{t('pages.contact.faq3Q')}</summary>
        <p>
          {t('pages.contact.faq3A')}
        </p>
      </details>

      <p className="page-updated">{t('pages.contact.footer')}</p>
    </>
  )
}

/* ============ 经验分享 ============ */

function BlogContent() {
  const { t } = useTranslation()
  const posts = useBlogStore((s) => s.posts)

  return (
    <>
      <p style={{ color: 'var(--text-secondary)' }}>
        {t('pages.blog.intro')}
      </p>

      {/* TEMP diagnostic: show exactly what BlogContent is trying to render */}
      <div
        style={{
          background: 'red',
          color: 'white',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '12px',
          fontFamily: 'monospace',
          fontSize: '13px',
        }}
      >
        <strong>BlogContent DIAG — posts.length = {posts.length}</strong>
        <ul style={{ margin: '8px 0 0', paddingLeft: '18px' }}>
          {posts.map((p) => (
            <li key={p.id}>
              {p.id}: {p.title || '(empty title)'}
            </li>
          ))}
        </ul>
      </div>

      {posts.length > 0 ? (
        <div className="blog-grid">
          {posts.map((post) => (
            <article key={post.id} className="blog-card blog-card-article">
              <div className="blog-card-category">{getPostField(post, 'category', i18n.language, t)}</div>
              <h3 className="blog-card-title">{getPostField(post, 'title', i18n.language, t)}</h3>
              <p className="blog-card-excerpt">{getPostField(post, 'excerpt', i18n.language, t)}</p>
              <div className="blog-card-footer">
                <span className="blog-card-date">{post.date}</span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="blog-more">{t('pages.blog.empty')}</p>
      )}

      <p className="blog-more">
        {t('pages.blog.more')}
      </p>
    </>
  )
}
