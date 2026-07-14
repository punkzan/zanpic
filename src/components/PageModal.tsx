import { useEffect, useState } from 'react'
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
  const syncFromApi = useBlogStore((s) => s.syncFromApi)
  const loading = useBlogStore((s) => s.loading)

  // Selected post for detail view
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)

  // On mount: pull latest posts from API (Vercel KV), fallback to localStorage
  useEffect(() => {
    syncFromApi()
  }, [syncFromApi])

  // Reset API sync flag when component unmounts (allow re-fetch next time it opens)
  useEffect(() => {
    return () => {
      useBlogStore.setState({ loading: false })
      setSelectedPostId(null)
    }
  }, [])

  // If a post is selected, show detail view
  if (selectedPostId) {
    const post = posts.find((p) => p.id === selectedPostId)
    if (!post) { setSelectedPostId(null); return null }
    return <BlogPostDetail post={post} onBack={() => setSelectedPostId(null)} />
  }

  return (
    <>
      <p style={{ color: 'var(--text-secondary)' }}>
        {t('pages.blog.intro')}
      </p>

      {loading && posts.length === 0 ? (
        <p className="blog-more">{t('pages.blog.loading') || 'Loading...'}</p>
      ) : posts.length > 0 ? (
        <div className="blog-grid">
          {posts.map((post) => (
            <article
              key={post.id}
              className="blog-card blog-card-article"
              onClick={() => setSelectedPostId(post.id)}
              style={{ cursor: 'pointer' }}
            >
              <div className="blog-card-category">{getPostField(post, 'category', i18n.language, t)}</div>
              <h3 className="blog-card-title">{getPostField(post, 'title', i18n.language, t)}</h3>
              <p className="blog-card-excerpt">{getPostField(post, 'excerpt', i18n.language, t)}</p>
              <div className="blog-card-footer">
                <span className="blog-card-date">{post.date}</span>
                <span style={{ color: 'var(--accent)', fontSize: '13px', marginLeft: 'auto' }}>
                  {t('pages.blog.readMore') || '阅读全文 →'}
                </span>
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

/** Full article detail view */
function BlogPostDetail({ post, onBack }: { post: ReturnType<typeof useBlogStore.getState>['posts'][0]; onBack: () => void }) {
  const { t } = useTranslation()
  const content = getPostField(post, 'content', i18n.language, t) || getPostField(post, 'excerpt', i18n.language, t)

  // Simple markdown-to-HTML converter for basic formatting
  function renderContent(text: string): string {
    return text
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code style="background:var(--bg-tertiary);padding:2px 6px;border-radius:4px;font-size:0.9em;">$1</code>')
      .replace(/^> (.+)$/gm, '<blockquote style="border-left:3px solid var(--accent);padding-left:12px;color:var(--text-secondary);margin:12px 0;">$1</blockquote>')
      .replace(/^\| .+/gm, (match) => {
        const cells = match.split('|').filter(c => c.trim()).map(c => `<td>${c.trim()}</td>`).join('')
        return `<tr>${cells}</tr>`
      })
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`)
      .replace(/\n{2,}/g, '</p><p>')
      .replace(/\n/g, '<br/>')
  }

  return (
    <div className="blog-detail">
      <button onClick={onBack} className="blog-detail-back" style={{
        background: 'none', border: 'none', color: 'var(--accent)',
        cursor: 'pointer', fontSize: '14px', padding: '8px 0', marginBottom: '16px',
        display: 'flex', alignItems: 'center', gap: '6px',
      }}>
        ← {t('pages.blog.backToList') || '返回列表'}
      </button>

      <div className="blog-detail-meta" style={{ marginBottom: '20px' }}>
        <span className="blog-card-category" style={{ display: 'inline-block' }}>
          {getPostField(post, 'category', i18n.language, t)}
        </span>
        <span className="blog-card-date" style={{ marginLeft: '12px', color: 'var(--text-tertiary)' }}>
          {post.date}
        </span>
      </div>

      <h2 className="blog-detail-title" style={{
        fontSize: '22px', fontWeight: 700, lineHeight: 1.3,
        color: 'var(--text-primary)', marginBottom: '20px',
      }}>
        {getPostField(post, 'title', i18n.language, t)}
      </h2>

      <div
        className="blog-detail-content"
        dangerouslySetInnerHTML={{ __html: renderContent(content) }}
        style={{
          color: 'var(--text-secondary)', lineHeight: 1.8,
          fontSize: '15px',
        }}
      />

      {/* Table styling */}
      <style>{`
        .blog-detail-content table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px; }
        .blog-detail-content th { background: var(--bg-tertiary); padding: 10px; text-align: left; border-bottom: 2px solid var(--border-color, rgba(128,128,128,0.2)); }
        .blog-detail-content td { padding: 10px; border-bottom: 1px solid var(--border-color, rgba(128,128,128,0.15)); }
        .blog-detail-content h2 { font-size: 18px; margin: 24px 0 12px; color: var(--text-primary); }
        .blog-detail-content h3 { font-size: 16px; margin: 20px 0 10px; color: var(--text-primary); }
        .blog-detail-content ul { padding-left: 20px; margin: 12px 0; }
        .blog-detail-content li { margin-bottom: 6px; }
        .blog-detail-content p { margin-bottom: 12px; }
        .blog-detail-content code { font-size: 0.9em; }
      `}</style>
    </div>
  )
}
