import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ContentLayout } from '../components/ContentLayout'
import { usePageMeta } from '../hooks/usePageMeta'
import { useBlogStore, getPostField } from '../store/blogStore'
import i18n from '../i18n'

/** Simple markdown-to-HTML converter for basic formatting */
function renderContent(text: string): string {
  return text
    // Image syntax: ![alt text](url)
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g,
      '<img src="$2" alt="$1" loading="lazy" style="max-width:100%;height:auto;border-radius:12px;margin:16px 0;display:block;" />')
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

export default function BlogPostPage() {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()
  const posts = useBlogStore((s) => s.posts)
  const syncFromApi = useBlogStore((s) => s.syncFromApi)
  const loading = useBlogStore((s) => s.loading)

  const post = posts.find((p) => p.slug === id || p.id === id)

  const title = post ? getPostField(post, 'title', i18n.language, t) : ''
  const category = post ? getPostField(post, 'category', i18n.language, t) : ''
  const content = post ? (getPostField(post, 'content', i18n.language, t) || getPostField(post, 'excerpt', i18n.language, t)) : ''

  usePageMeta({
    title: post ? `${title} - Zan Pic` : 'Zan Pic',
    description: post ? getPostField(post, 'excerpt', i18n.language, t) : '',
    path: `/blog/${post?.slug || post?.id || id}`,
    ogType: 'article',
  })

  useEffect(() => {
    syncFromApi()
  }, [syncFromApi])

  if (!post) {
    return (
      <ContentLayout>
        {loading ? (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '40px' }}>
            {t('pages.blog.loading') || 'Loading...'}
          </p>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
              {t('pages.blog.notFound', { defaultValue: '文章未找到' })}
            </p>
            <Link
              to="/blog"
              style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '14px' }}
            >
              ← {t('pages.blog.backToList') || '返回列表'}
            </Link>
          </div>
        )}
      </ContentLayout>
    )
  }

  return (
    <ContentLayout>
      <Link
        to="/blog"
        className="blog-detail-back"
        style={{
          background: 'none', border: 'none', color: 'var(--accent)',
          cursor: 'pointer', fontSize: '14px', padding: '8px 0', marginBottom: '16px',
          display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none',
        }}
      >
        ← {t('pages.blog.backToList') || '返回列表'}
      </Link>

      <div className="blog-detail-meta" style={{ marginBottom: '20px' }}>
        <span className="blog-card-category" style={{ display: 'inline-block' }}>
          {category}
        </span>
        <span className="blog-card-date" style={{ marginLeft: '12px', color: 'var(--text-tertiary)' }}>
          {post.date}
        </span>
      </div>

      <h2 style={{
        fontSize: '22px', fontWeight: 700, lineHeight: 1.3,
        color: 'var(--text-primary)', marginBottom: '20px',
      }}>
        {title}
      </h2>

      <div
        className="blog-detail-content"
        dangerouslySetInnerHTML={{ __html: renderContent(content) }}
        style={{
          color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '15px',
        }}
      />

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
    </ContentLayout>
  )
}
