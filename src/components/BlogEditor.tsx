import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import type { BlogPost } from '../store/blogStore'

export interface BlogEditorPayload {
  title: string
  date: string
  category: string
  excerpt: string
  content?: string // Full article body (supports basic markdown)
}

interface Props {
  /** If provided, we are editing. Otherwise creating. */
  existing?: BlogPost
  onSave: (payload: BlogEditorPayload) => void
  onClose: () => void
}

export function BlogEditor({ existing, onSave, onClose }: Props) {
  const { t } = useTranslation()
  const [title, setTitle] = useState(existing?.title ?? '')
  const [date, setDate] = useState(existing?.date ?? new Date().toISOString().slice(0, 10))
  const [category, setCategory] = useState(existing?.category ?? '')
  const [excerpt, setExcerpt] = useState(existing?.excerpt ?? '')
  const [content, setContent] = useState(existing?.content ?? '')

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const handleSave = () => {
    if (!title.trim()) return
    if (!excerpt.trim()) return
    onSave({
      title: title.trim(),
      date,
      category: category.trim() || t('admin.blogEditor.uncategorized'),
      excerpt: excerpt.trim(),
      content: content.trim() || undefined,
    })
  }

  const isValid = title.trim() && excerpt.trim()

  return createPortal(
    <>
      <div className="blog-editor-backdrop" onClick={onClose} />
      <div className="blog-editor-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[18px] font-semibold" style={{ color: 'var(--text-primary)' }}>
            {existing ? t('admin.blogEditor.editTitle') : t('admin.blogEditor.newTitle')}
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
            style={{ color: 'var(--text-tertiary)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--bg-tertiary)'
              e.currentTarget.style.color = 'var(--text-primary)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = 'var(--text-tertiary)'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block mb-1.5 text-[13px] font-medium" style={{ color: 'var(--text-secondary)' }}>
              {t('admin.blogEditor.titleLabel')} <span style={{ color: 'var(--danger, #ef4444)' }}>*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('admin.blogEditor.titlePlaceholder')}
              className="blog-editor-input"
              autoFocus
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1.5 text-[13px] font-medium" style={{ color: 'var(--text-secondary)' }}>
                {t('admin.blogEditor.dateLabel')}
              </label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="blog-editor-input" />
            </div>
            <div>
              <label className="block mb-1.5 text-[13px] font-medium" style={{ color: 'var(--text-secondary)' }}>
                {t('admin.blogEditor.categoryLabel')}
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder={t('admin.blogEditor.categoryPlaceholder')}
                className="blog-editor-input"
              />
            </div>
          </div>
          <div>
            <label className="block mb-1.5 text-[13px] font-medium" style={{ color: 'var(--text-secondary)' }}>
              {t('admin.blogEditor.excerptLabel')} <span style={{ color: 'var(--danger, #ef4444)' }}>*</span>
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder={t('admin.blogEditor.excerptPlaceholder')}
              className="blog-editor-input blog-editor-textarea"
              rows={5}
            />
            <div className="mt-1 text-right text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
              {t('admin.blogEditor.wordCount', { n: excerpt.length })}
            </div>
          </div>
          <div>
            <label className="block mb-1.5 text-[13px] font-medium" style={{ color: 'var(--text-secondary)' }}>
              {t('admin.blogEditor.contentLabel') || '正文内容'}
              <span style={{ color: 'var(--text-tertiary)', fontWeight: 400, marginLeft: 4 }}>({t('admin.blogEditor.contentHint') || '支持 Markdown，选填'})</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t('admin.blogEditor.contentPlaceholder') || '在此输入文章正文内容（支持标题、粗体、列表、表格等 Markdown 格式）...'}
              className="blog-editor-input blog-editor-textarea"
              rows={12}
              style={{ minHeight: 180 }}
            />
            <div className="mt-1 text-right text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
              {content.length > 0 ? t('admin.blogEditor.wordCount', { n: content.length }) : ''}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 mt-6">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-[14px] font-medium transition-colors"
            style={{ color: 'var(--text-secondary)', background: 'var(--bg-tertiary)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-secondary)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-tertiary)' }}
          >
            {t('admin.blogEditor.cancel')}
          </button>
          <button
            onClick={handleSave}
            disabled={!isValid}
            className="rounded-lg px-5 py-2 text-[14px] font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: isValid ? 'var(--accent)' : 'var(--bg-tertiary)',
              color: isValid ? '#fff' : 'var(--text-tertiary)',
            }}
          >
            {existing ? t('admin.blogEditor.saveEdit') : t('admin.blogEditor.publish')}
          </button>
        </div>
      </div>
    </>,
    document.body,
  )
}
