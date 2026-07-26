import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ContentLayout } from '../components/ContentLayout'
import { usePageMeta } from '../hooks/usePageMeta'
import { useBlogStore, getPostField } from '../store/blogStore'
import i18n from '../i18n'

export default function BlogListPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const posts = useBlogStore((s) => s.posts)
  const syncFromApi = useBlogStore((s) => s.syncFromApi)
  const loading = useBlogStore((s) => s.loading)

  usePageMeta({
    title: `${t('pages.blog.title', { defaultValue: '经验分享' })} - Zan Pic`,
    description: t('pages.blog.intro', { defaultValue: '图片编辑技巧与经验分享' }),
    path: '/blog',
  })

  useEffect(() => {
    syncFromApi()
  }, [syncFromApi])

  return (
    <ContentLayout>
      <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '20px', color: 'var(--text-primary)' }}>
        {t('pages.blog.title', { defaultValue: '经验分享' })}
      </h2>

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
              onClick={() => navigate(`/blog/${post.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className="blog-card-category">
                {getPostField(post, 'category', i18n.language, t)}
              </div>
              <h3 className="blog-card-title">
                {getPostField(post, 'title', i18n.language, t)}
              </h3>
              <p className="blog-card-excerpt">
                {getPostField(post, 'excerpt', i18n.language, t)}
              </p>
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

      <p className="blog-more">{t('pages.blog.more')}</p>
    </ContentLayout>
  )
}
