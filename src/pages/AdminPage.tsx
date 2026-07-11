import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Pencil, Trash2, Lock, LogOut, ArrowLeft, FileText, Megaphone, Settings, PlusCircle, ExternalLink, Search, RotateCcw } from 'lucide-react'
import { useBlogStore, getPostField, type BlogPost } from '../store/blogStore'
import { useAdStore } from '../store/adStore'
import { useSiteStore, type FriendLink } from '../store/siteStore'
import { BlogEditor, type BlogEditorPayload } from '../components/BlogEditor'
import i18n from '../i18n'
import '../index.css'

type AdminSection = 'blog' | 'ads' | 'site'

/**
 * Admin password — stored as salted SHA-256 hash (not plaintext).
 * Verification uses Web Crypto API at runtime.
 */
const AUTH_SALT = 'zp_7f3a9b2e_salt'
const ADMIN_HASH = '4675a6f9d87e4ba341e703e31a21206a604af9335e2ac8281589d100c1378b18'
const AUTH_KEY = 'zanpic_admin_session'

/** Hash a password with salt using SHA-256, returns hex string */
async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(AUTH_SALT + password)
  const buf = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

/* ========================================================
   Admin page — /admin
   Login → Dashboard (sidebar: 文章管理 | 广告管理 | 站点设置)
   ======================================================== */

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    const session = sessionStorage.getItem(AUTH_KEY)
    if (session === '1') setAuthenticated(true)
  }, [])

  const handleLogin = useCallback(() => {
    sessionStorage.setItem(AUTH_KEY, '1')
    setAuthenticated(true)
  }, [])

  const handleLogout = useCallback(() => {
    sessionStorage.removeItem(AUTH_KEY)
    setAuthenticated(false)
  }, [])

  if (!authenticated) {
    return <LoginView onLogin={handleLogin} />
  }

  return <DashboardView onLogout={handleLogout} />
}

/* ── Login view ── */

function LoginView({ onLogin }: { onLogin: () => void }) {
  const { t } = useTranslation()
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!password.trim()) return
    setLoading(true)
    try {
      const inputHash = await hashPassword(password)
      if (inputHash === ADMIN_HASH) {
        setError(false)
        onLogin()
      } else {
        setError(true)
        setPassword('')
      }
    } catch {
      setError(true)
      setPassword('')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setPassword(''); setError(false) }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <a href="/" className="admin-back-link">
          <ArrowLeft size={16} />
          <span>{t('admin.backSite')}</span>
        </a>

        <div className="admin-login-logo">
          <span className="admin-logo-text">Zan Pic</span>
          <span className="admin-logo-tag">{t('admin.brand')}</span>
        </div>

        <div className="admin-login-icon">
          <Lock size={28} strokeWidth={1.8} />
        </div>

        <h2 className="admin-login-title">{t('admin.loginTitle')}</h2>
        <p className="admin-login-desc">
          {t('admin.loginSubtitle')}
        </p>

        <div className="admin-login-input-wrap">
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(false) }}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit() }}
            placeholder="请输入管理员密码"
            className="blog-editor-input admin-login-input"
            autoFocus
            disabled={loading}
            style={error ? { borderColor: 'var(--danger, #ef4444)' } : undefined}
          />
          {error && (
            <p className="admin-login-error">{t('admin.passwordError')}</p>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!password.trim() || loading}
          className="admin-login-btn"
        >
          {loading ? t('admin.verifying') : t('admin.loginBtn')}
        </button>
      </div>
    </div>
  )
}

/* ── Dashboard layout (sidebar + content) ── */

function DashboardView({ onLogout }: { onLogout: () => void }) {
  const { t } = useTranslation()
  const [section, setSection] = useState<AdminSection>('blog')

  return (
    <div className="admin-dashboard">
      {/* Top bar */}
      <header className="admin-topbar">
        <a href="/" className="admin-topbar-brand">
          <span className="admin-logo-text">Zan Pic</span>
          <span className="admin-logo-tag-sm">{t('admin.brand')}</span>
        </a>

        <div className="admin-topbar-actions">
          <a href="/" className="admin-topbar-link">
            <ArrowLeft size={16} />
            <span>{t('admin.backHome')}</span>
          </a>
          <button onClick={onLogout} className="admin-topbar-logout">
            <LogOut size={16} />
            <span>{t('admin.logout')}</span>
          </button>
        </div>
      </header>

      <div className="admin-body">
        {/* Sidebar */}
        <nav className="admin-sidebar">
          <button
            onClick={() => setSection('blog')}
            className={`admin-nav-item ${section === 'blog' ? 'admin-nav-active' : ''}`}
          >
            <FileText size={18} />
            <span>{t('admin.navArticles')}</span>
          </button>
          <button
            onClick={() => setSection('ads')}
            className={`admin-nav-item ${section === 'ads' ? 'admin-nav-active' : ''}`}
          >
            <Megaphone size={18} />
            <span>{t('admin.navAds')}</span>
          </button>
          <button
            onClick={() => setSection('site')}
            className={`admin-nav-item ${section === 'site' ? 'admin-nav-active' : ''}`}
          >
            <Settings size={18} />
            <span>{t('admin.navSettings')}</span>
          </button>
        </nav>

        {/* Content */}
        <main className="admin-main">
          {section === 'blog' ? <BlogSection /> : section === 'ads' ? <AdSection /> : <SiteSection />}
        </main>
      </div>
    </div>
  )
}

/* ── Blog section ── */

function BlogSection() {
  const { t } = useTranslation()
  const posts = useBlogStore((s) => s.posts)
  const addPost = useBlogStore((s) => s.addPost)
  const updatePost = useBlogStore((s) => s.updatePost)
  const deletePost = useBlogStore((s) => s.deletePost)

  const [editorOpen, setEditorOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | undefined>(undefined)

  const openCreate = () => { setEditingPost(undefined); setEditorOpen(true) }
  const openEdit = (post: BlogPost) => { setEditingPost(post); setEditorOpen(true) }

  const handleSave = (payload: BlogEditorPayload) => {
    if (editingPost) { updatePost(editingPost.id, payload) }
    else { addPost(payload) }
    setEditorOpen(false)
    setEditingPost(undefined)
  }

  const handleDelete = (post: BlogPost) => {
    if (window.confirm(t('admin.articles.deleteConfirm', { title: post.title }))) {
      deletePost(post.id)
    }
  }

  return (
    <div className="admin-content">
      <div className="admin-section-header">
        <div>
          <h1 className="admin-section-title">{t('admin.articles.title')}</h1>
          <p className="admin-section-desc">
            {t('admin.articles.count', { n: posts.length })}。修改会立即保存到本地存储。
          </p>
        </div>
        <button onClick={openCreate} className="admin-create-btn">
          <Plus size={20} strokeWidth={2} />
          <span>{t('admin.articles.new')}</span>
        </button>
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
                <span className="blog-card-actions">
                  <button onClick={() => openEdit(post)} className="blog-action-btn" title={t('admin.articles.editBtn')} style={{ color: 'var(--accent)' }}>
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => handleDelete(post)} className="blog-action-btn" title={t('admin.articles.deleteBtn')} style={{ color: 'var(--danger, #ef4444)' }}>
                    <Trash2 size={15} />
                  </button>
                </span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="admin-empty">{t('admin.articles.empty')}</div>
      )}

      {editorOpen && (
        <BlogEditor
          existing={editingPost}
          onSave={handleSave}
          onClose={() => { setEditorOpen(false); setEditingPost(undefined) }}
        />
      )}
    </div>
  )
}

/* ── Ad section ── */

function AdSection() {
  const { t } = useTranslation()
  const adEnabled = useAdStore((s) => s.adEnabled)
  const setAdEnabled = useAdStore((s) => s.setAdEnabled)
  const googlePublisherId = useAdStore((s) => s.googlePublisherId)
  const googleSidebarSlotId = useAdStore((s) => s.googleSidebarSlotId)
  const googleBannerSlotId = useAdStore((s) => s.googleBannerSlotId)
  const baiduSidebarSlotId = useAdStore((s) => s.baiduSidebarSlotId)
  const baiduSidebarToken = useAdStore((s) => s.baiduSidebarToken)
  const baiduBannerSlotId = useAdStore((s) => s.baiduBannerSlotId)
  const baiduBannerToken = useAdStore((s) => s.baiduBannerToken)
  const updateGoogle = useAdStore((s) => s.updateGoogle)
  const updateBaidu = useAdStore((s) => s.updateBaidu)

  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="admin-content" style={{ maxWidth: 720 }}>
      <div className="admin-section-header">
        <div>
          <h1 className="admin-section-title">{t('admin.ads.title')}</h1>
          <p className="admin-section-desc">
            配置 Google AdSense 和百度联盟广告代码，保存后前台即刻生效。
          </p>
        </div>

        {/* Global toggle */}
        <label className="admin-toggle-wrap">
          <span className="admin-toggle-label">{t('admin.ads.globalEnable')}</span>
          <button
            onClick={() => { setAdEnabled(!adEnabled); handleSave() }}
            className={`admin-toggle ${adEnabled ? 'admin-toggle-on' : ''}`}
            role="switch"
            aria-checked={adEnabled}
          >
            <span className="admin-toggle-knob" />
          </button>
        </label>
      </div>

      {/* Google AdSense */}
      <div className="admin-form-card">
        <div className="admin-form-card-header">
          <span className="admin-platform-badge google">{t('admin.ads.adsenseTitle')}</span>
          <span className="admin-platform-desc">
            在 <a href="https://adsense.google.com" target="_blank" rel="noopener noreferrer">Google AdSense 后台</a> 获取 publisher ID 和广告单元 ID
          </span>
        </div>

        <div className="admin-form-grid">
          <div className="admin-form-field">
            <label className="admin-form-label">{t('admin.ads.publisherId')}</label>
            <input
              type="text"
              value={googlePublisherId}
              onChange={(e) => updateGoogle({ googlePublisherId: e.target.value })}
              placeholder="ca-pub-XXXXXXXXXXXXXXXX"
              className="blog-editor-input"
            />
            <span className="admin-form-hint">格式：ca-pub-xxxxxxxxxxxxxxxx</span>
          </div>

          <div className="admin-form-field">
            <label className="admin-form-label">{t('admin.ads.sidebarSlot')}</label>
            <input
              type="text"
              value={googleSidebarSlotId}
              onChange={(e) => updateGoogle({ googleSidebarSlotId: e.target.value })}
              placeholder="XXXXXXXXXX"
              className="blog-editor-input"
            />
            <span className="admin-form-hint">{t('admin.ads.sizeHint', { size: '300×250' })}</span>
          </div>

          <div className="admin-form-field">
            <label className="admin-form-label">{t('admin.ads.bottomSlot')}</label>
            <input
              type="text"
              value={googleBannerSlotId}
              onChange={(e) => updateGoogle({ googleBannerSlotId: e.target.value })}
              placeholder="XXXXXXXXXX"
              className="blog-editor-input"
            />
            <span className="admin-form-hint">{t('admin.ads.sizeHint', { size: '728×90 或 970×90' })}</span>
          </div>
        </div>
      </div>

      {/* Baidu */}
      <div className="admin-form-card">
        <div className="admin-form-card-header">
          <span className="admin-platform-badge baidu">{t('admin.ads.baiduTitle')}</span>
          <span className="admin-platform-desc">
            在 <a href="https://union.baidu.com" target="_blank" rel="noopener noreferrer">百度联盟后台</a> 获取代码位 ID 和 token
          </span>
        </div>

        <div className="admin-form-grid">
          <div className="admin-form-field">
            <label className="admin-form-label">{t('admin.ads.codeId')}</label>
            <input
              type="text"
              value={baiduSidebarSlotId}
              onChange={(e) => updateBaidu({ baiduSidebarSlotId: e.target.value })}
              placeholder="xxxxxxxxxx"
              className="blog-editor-input"
            />
          </div>

          <div className="admin-form-field">
            <label className="admin-form-label">{t('admin.ads.token')}</label>
            <input
              type="text"
              value={baiduSidebarToken}
              onChange={(e) => updateBaidu({ baiduSidebarToken: e.target.value })}
              placeholder="xxxxxxxxxxxxxxxx"
              className="blog-editor-input"
            />
            <span className="admin-form-hint">300×250 固定尺寸</span>
          </div>

          <div className="admin-form-field">
            <label className="admin-form-label">{t('admin.ads.codeId')}</label>
            <input
              type="text"
              value={baiduBannerSlotId}
              onChange={(e) => updateBaidu({ baiduBannerSlotId: e.target.value })}
              placeholder="xxxxxxxxxx"
              className="blog-editor-input"
            />
          </div>

          <div className="admin-form-field">
            <label className="admin-form-label">{t('admin.ads.token')}</label>
            <input
              type="text"
              value={baiduBannerToken}
              onChange={(e) => updateBaidu({ baiduBannerToken: e.target.value })}
              placeholder="xxxxxxxxxxxxxxxx"
              className="blog-editor-input"
            />
            <span className="admin-form-hint">960×90 固定尺寸</span>
          </div>
        </div>
      </div>

      {/* Save confirmation */}
      {saved && (
        <div className="admin-save-toast">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {t('admin.ads.saved')}
        </div>
      )}
    </div>
  )
}

/* ── Site settings section ── */

function SiteSection() {
  const { t } = useTranslation()
  const icpFilingNumber = useSiteStore((s) => s.icpFilingNumber)
  const publicSecurityFilingNumber = useSiteStore((s) => s.publicSecurityFilingNumber)
  const companyName = useSiteStore((s) => s.companyName)
  const friendLinks = useSiteStore((s) => s.friendLinks)
  const seo = useSiteStore((s) => s.seo)
  const setFilingInfo = useSiteStore((s) => s.setFilingInfo)
  const setSeo = useSiteStore((s) => s.setSeo)
  const addFriendLink = useSiteStore((s) => s.addFriendLink)
  const updateFriendLink = useSiteStore((s) => s.updateFriendLink)
  const deleteFriendLink = useSiteStore((s) => s.deleteFriendLink)

  /* ── Friend link editor modal ── */
  const [linkEditorOpen, setLinkEditorOpen] = useState(false)
  type EditingLink = { mode: 'create' } | { mode: 'edit'; link: FriendLink }
  const [editingLink, setEditingLink] = useState<EditingLink>({ mode: 'create' })
  const [linkName, setLinkName] = useState('')
  const [linkUrl, setLinkUrl] = useState('')

  const openCreateLink = () => {
    setLinkName('')
    setLinkUrl('')
    setEditingLink({ mode: 'create' })
    setLinkEditorOpen(true)
  }

  const openEditLink = (link: FriendLink) => {
    setLinkName(link.name)
    setLinkUrl(link.url)
    setEditingLink({ mode: 'edit', link })
    setLinkEditorOpen(true)
  }

  const handleLinkSave = () => {
    const name = linkName.trim()
    let url = linkUrl.trim()
    if (!name || !url) return

    // Auto-prefix https:// if missing
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url
    }

    if (editingLink.mode === 'edit') {
      updateFriendLink(editingLink.link.id, { name, url })
    } else {
      addFriendLink({ name, url })
    }

    setLinkEditorOpen(false)
    setLinkName('')
    setLinkUrl('')
  }

  const handleDeleteLink = (link: FriendLink) => {
    if (window.confirm(`确定要删除友情链接「${link.name}」吗？`)) {
      deleteFriendLink(link.id)
    }
  }

  return (
    <div className="admin-content" style={{ maxWidth: 760 }}>
      <div className="admin-section-header">
        <div>
          <h1 className="admin-section-title">{t('admin.settings.title')}</h1>
          <p className="admin-section-desc">
            管理页面底部的备案信息、版权信息和友情链接，修改后前台即刻生效。
          </p>
        </div>
      </div>

      {/* ── 备案信息 ── */}
      <div className="admin-form-card">
        <div className="admin-form-card-header">
          <span className="admin-platform-badge filing">{t('admin.settings.icpTitle')}</span>
          <span className="admin-platform-desc">
            ICP 备案号会在底部链接到工信部备案查询网站
          </span>
        </div>

        <div className="admin-form-grid">
          <div className="admin-form-field">
            <label className="admin-form-label">{t('admin.settings.icpLabel')}</label>
            <input
              type="text"
              value={icpFilingNumber}
              onChange={(e) => setFilingInfo({ icpFilingNumber: e.target.value })}
              placeholder="如：京ICP备XXXXXXXX号"
              className="blog-editor-input"
            />
          </div>

          <div className="admin-form-field">
            <label className="admin-form-label">{t('admin.settings.policeLabel')}（选填）</label>
            <input
              type="text"
              value={publicSecurityFilingNumber}
              onChange={(e) => setFilingInfo({ publicSecurityFilingNumber: e.target.value })}
              placeholder="如：京公网安备 XXXXXXXXXX 号"
              className="blog-editor-input"
            />
          </div>

          <div className="admin-form-field">
            <label className="admin-form-label">{t('admin.settings.copyrightLabel')}</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setFilingInfo({ companyName: e.target.value })}
              placeholder="如：某科技有限公司（留空则显示 Zan Pic）"
              className="blog-editor-input"
            />
            <span className="admin-form-hint">显示在版权信息 © 2026 之后</span>
          </div>
        </div>
      </div>

      {/* ── SEO 设置 ── */}
      <div className="admin-form-card">
        <div className="admin-form-card-header">
          <span className="admin-platform-badge" style={{ background: 'rgba(99, 102, 241, 0.12)', color: '#6366f1' }}>
            <Search size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
            {t('admin.settings.seoTitle')}
          </span>
          <span className="admin-platform-desc">
            {t('admin.settings.seoDesc')}
          </span>
        </div>

        <div className="admin-form-grid">
          <div className="admin-form-field" style={{ gridColumn: '1 / -1' }}>
            <label className="admin-form-label">{t('admin.settings.seoPageTitle')}</label>
            <input
              type="text"
              value={seo.title}
              onChange={(e) => setSeo({ title: e.target.value })}
              placeholder={t('admin.settings.seoPageTitlePlaceholder')}
              className="blog-editor-input"
            />
            <span className="admin-form-hint">{t('admin.settings.seoPageTitleHint')}</span>
          </div>

          <div className="admin-form-field" style={{ gridColumn: '1 / -1' }}>
            <label className="admin-form-label">{t('admin.settings.seoDescription')}</label>
            <textarea
              value={seo.description}
              onChange={(e) => setSeo({ description: e.target.value })}
              placeholder={t('admin.settings.seoDescriptionPlaceholder')}
              className="blog-editor-input blog-editor-textarea"
              rows={3}
            />
            <span className="admin-form-hint">{t('admin.settings.seoDescriptionHint')}</span>
          </div>

          <div className="admin-form-field" style={{ gridColumn: '1 / -1' }}>
            <label className="admin-form-label">{t('admin.settings.seoKeywords')}</label>
            <input
              type="text"
              value={seo.keywords}
              onChange={(e) => setSeo({ keywords: e.target.value })}
              placeholder={t('admin.settings.seoKeywordsPlaceholder')}
              className="blog-editor-input"
            />
            <span className="admin-form-hint">{t('admin.settings.seoKeywordsHint')}</span>
          </div>

          <div className="admin-form-field">
            <label className="admin-form-label">{t('admin.settings.seoAuthor')}</label>
            <input
              type="text"
              value={seo.author}
              onChange={(e) => setSeo({ author: e.target.value })}
              placeholder={t('admin.settings.seoAuthorPlaceholder')}
              className="blog-editor-input"
            />
            <span className="admin-form-hint">{t('admin.settings.seoAuthorHint')}</span>
          </div>

          <div className="admin-form-field">
            <label className="admin-form-label">{t('admin.settings.seoOgImage')}</label>
            <input
              type="text"
              value={seo.ogImage}
              onChange={(e) => setSeo({ ogImage: e.target.value })}
              placeholder={t('admin.settings.seoOgImagePlaceholder')}
              className="blog-editor-input"
            />
            <span className="admin-form-hint">{t('admin.settings.seoOgImageHint')}</span>
          </div>
        </div>

        {/* Reset button */}
        <div style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={() => {
              if (window.confirm(t('admin.settings.seoResetConfirm'))) {
                setSeo({
                  title: 'Zan Pic - 免费在线图片编辑器 | AI抠图 证件照 滤镜裁剪',
                  description: 'Zan Pic 是一款免费在线图片编辑器，支持AI智能抠图、证件照生成、滤镜调色、裁剪旋转、图片压缩、格式转换、自定义水印等功能。所有处理在浏览器本地完成，无需上传，保护隐私。',
                  keywords: '图片编辑,在线修图,AI抠图,证件照制作,图片压缩,格式转换,图片滤镜,裁剪工具,免费图片编辑器,在线PS,背景移除,照片处理',
                  author: 'Zan Pic',
                  ogImage: '',
                })
              }
            }}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors"
            style={{ color: 'var(--text-tertiary)', background: 'var(--bg-tertiary)' }}
          >
            <RotateCcw size={13} />
            {t('admin.settings.seoReset')}
          </button>
        </div>
      </div>

      {/* ── 友情链接 ── */}
      <div className="admin-form-card">
        <div className="admin-form-card-header">
          <span className="admin-platform-badge links">{t('admin.settings.linksTitle')}</span>
          <span className="admin-platform-desc">
            交换链接、推荐站点等，留空则不显示友链区域
          </span>
        </div>

        {/* Link list */}
        {friendLinks.length > 0 && (
          <div className="site-links-table">
            <div className="site-links-table-header">
              <span className="site-links-col-name">{t('admin.settings.linkName')}</span>
              <span className="site-links-col-url">{t('admin.settings.linkUrl')}</span>
              <span className="site-links-col-actions">{t('admin.settings.linkActions')}</span>
            </div>
            {friendLinks.map((link) => (
              <div key={link.id} className="site-links-row">
                <span className="site-links-col-name">{link.name}</span>
                <span className="site-links-col-url">
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="site-links-url-link">
                    {link.url}
                    <ExternalLink size={11} />
                  </a>
                </span>
                <span className="site-links-col-actions">
                  <button
                    onClick={() => openEditLink(link)}
                    className="blog-action-btn"
                    title={t('admin.articles.editBtn')}
                    style={{ color: 'var(--accent)' }}
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteLink(link)}
                    className="blog-action-btn"
                    title={t('admin.articles.deleteBtn')}
                    style={{ color: 'var(--danger, #ef4444)' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {friendLinks.length === 0 && (
          <div className="admin-empty" style={{ padding: '28px 0' }}>还没有友情链接，点击下方按钮添加。</div>
        )}

        <div style={{ marginTop: friendLinks.length > 0 ? 14 : 0 }}>
          <button onClick={openCreateLink} className="admin-create-btn" style={{ height: 38, fontSize: 14 }}>
            <PlusCircle size={16} strokeWidth={2} />
            <span>{t('admin.settings.addLink')}</span>
          </button>
        </div>
      </div>

      {/* ── Link editor modal ── */}
      {linkEditorOpen && (
        <>
          <div className="blog-editor-backdrop" onClick={() => setLinkEditorOpen(false)} />
          <div className="blog-editor-modal" style={{ width: 420 }} onClick={(e) => e.stopPropagation()}>
            <h3 className="text-[17px] font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              {editingLink.mode === 'edit' ? t('admin.settings.editLink') : t('admin.settings.addLinkTitle')}
            </h3>

            <div className="admin-form-field">
              <label className="admin-form-label">{t('admin.settings.linkName')}</label>
              <input
                type="text"
                value={linkName}
                onChange={(e) => setLinkName(e.target.value)}
                placeholder="如：某某博客"
                className="blog-editor-input"
                autoFocus
                onKeyDown={(e) => { if (e.key === 'Enter') handleLinkSave() }}
              />
            </div>

            <div className="admin-form-field" style={{ marginTop: 14 }}>
              <label className="admin-form-label">{t('admin.settings.linkUrl')}</label>
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="如：example.com（自动补全 https://）"
                className="blog-editor-input"
                onKeyDown={(e) => { if (e.key === 'Enter') handleLinkSave() }}
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 mt-5">
              <button
                onClick={() => setLinkEditorOpen(false)}
                className="rounded-lg px-4 py-2 text-[14px] font-medium transition-colors"
                style={{ color: 'var(--text-secondary)', background: 'var(--bg-tertiary)' }}
              >
                {t('admin.settings.cancel')}
              </button>
              <button
                onClick={handleLinkSave}
                disabled={!linkName.trim() || !linkUrl.trim()}
                className="rounded-lg px-5 py-2 text-[14px] font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: (linkName.trim() && linkUrl.trim()) ? 'var(--accent)' : 'var(--bg-tertiary)',
                  color: (linkName.trim() && linkUrl.trim()) ? '#fff' : 'var(--text-tertiary)',
                }}
              >
                {t('admin.settings.save')}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
