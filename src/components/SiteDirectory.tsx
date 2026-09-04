import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, Wrench, CreditCard, Smartphone, Palette, RefreshCw, BookOpen, Info } from 'lucide-react'
import { ID_PHOTO_SPECS } from '../data/id-photo-specs'
import { SOCIAL_MEDIA_SIZES } from '../data/social-media-sizes'
import { BACKGROUND_COLORS } from '../data/background-colors'
import { CONVERT_SPECS } from '../data/convert-specs'
import { useBlogStore } from '../store/blogStore'

const IS_MOBILE = typeof navigator !== 'undefined' && /Mobi|Android|iPhone/i.test(navigator.userAgent)

interface LinkItem {
  path: string
  label: string
}

interface LinkCategory {
  title: string
  icon: typeof Wrench
  links: LinkItem[]
}

export function SiteDirectory({ isEditor }: { isEditor: boolean }) {
  const [expanded, setExpanded] = useState(false)
  const blogPosts = useBlogStore((s) => s.posts)

  const openInNewTab = !IS_MOBILE && isEditor

  const categories: LinkCategory[] = useMemo(() => {
    // Core tools
    const coreTools: LinkItem[] = [
      { path: '/id-photo-maker', label: '证件照制作' },
      { path: '/background-remover', label: 'AI 智能抠图' },
      { path: '/photo-resizer', label: '图片裁剪缩放' },
      { path: '/photo-filter', label: '图片滤镜调色' },
    ]

    // ID photo specs (25)
    const idPhotoSpecs: LinkItem[] = ID_PHOTO_SPECS.map((s) => ({
      path: `/id-photo/${s.slug}`,
      label: s.title.replace(/（.+$/, '').replace(/\s*Requirements.*$/, '').replace(/\s*Size.*$/, '').replace(/\s*Photo.*$/, '').trim() || s.title,
    }))

    // Social media sizes (15)
    const socialMediaSizes: LinkItem[] = SOCIAL_MEDIA_SIZES.map((s) => ({
      path: `/resize/${s.slug}`,
      label: s.title.replace(/\s*\(.+$/, '').trim(),
    }))

    // Background colors (4)
    const backgroundColors: LinkItem[] = BACKGROUND_COLORS.map((s) => ({
      path: `/background/${s.slug}`,
      label: s.title.replace(/\s*—.*$/, '').trim(),
    }))

    // Convert specs (10)
    const convertSpecs: LinkItem[] = CONVERT_SPECS.map((s) => ({
      path: `/convert/${s.slug}`,
      label: s.title.replace(/\s*—.*$/, '').trim(),
    }))

    // Blog posts (10)
    const blogLinks: LinkItem[] = blogPosts.map((p) => ({
      path: `/blog/${p.slug || p.id}`,
      label: p.title.length > 30 ? p.title.slice(0, 28) + '…' : p.title,
    }))

    // Info pages (4)
    const infoPages: LinkItem[] = [
      { path: '/about', label: '关于我们' },
      { path: '/privacy', label: '隐私政策' },
      { path: '/terms', label: '服务条款' },
      { path: '/contact', label: '联系我们' },
    ]

    return [
      { title: '核心工具', icon: Wrench, links: coreTools },
      { title: '证件照规格大全', icon: CreditCard, links: idPhotoSpecs },
      { title: '社媒图片尺寸', icon: Smartphone, links: socialMediaSizes },
      { title: '背景色工具', icon: Palette, links: backgroundColors },
      { title: '图片格式转换', icon: RefreshCw, links: convertSpecs },
      { title: '博客教程', icon: BookOpen, links: blogLinks },
      { title: '关于与帮助', icon: Info, links: infoPages },
    ]
  }, [blogPosts])

  const totalLinks = categories.reduce((sum, c) => sum + c.links.length, 0)

  function renderLink(item: LinkItem): React.ReactNode {
    if (openInNewTab) {
      return (
        <a
          key={item.path}
          href={item.path}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-md px-2.5 py-1 text-[13px] transition-colors hover:bg-[var(--bg-tertiary)] hover:text-[var(--accent)]"
          style={{ color: 'inherit', textDecoration: 'none' }}
        >
          {item.label}
        </a>
      )
    }
    return (
      <Link
        key={item.path}
        to={item.path}
        className="block rounded-md px-2.5 py-1 text-[13px] transition-colors hover:bg-[var(--bg-tertiary)] hover:text-[var(--accent)]"
        style={{ color: 'inherit', textDecoration: 'none' }}
      >
        {item.label}
      </Link>
    )
  }

  return (
    <div style={{ borderTop: '1px solid var(--border-light)' }}>
      {/* Toggle button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-center gap-1.5 py-1.5 text-[13px] transition-colors hover:text-[var(--accent)]"
        style={{ color: 'inherit', background: 'transparent', border: 'none', cursor: 'pointer' }}
        aria-expanded={expanded}
      >
        站点导航 · {totalLinks} 个页面
        <ChevronDown
          size={14}
          style={{
            transform: expanded ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s ease',
          }}
        />
      </button>

      {/* Collapsible content — always in DOM for SEO, visually hidden when collapsed */}
      <div
        style={{
          maxHeight: expanded ? '2000px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.3s ease',
        }}
      >
        <div className="grid grid-cols-1 gap-x-6 gap-y-3 px-4 pb-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((cat) => (
            <div key={cat.title}>
              <div
                className="mb-1 flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wide"
                style={{ color: 'var(--accent)', opacity: 0.85 }}
              >
                <cat.icon size={13} />
                {cat.title}
                <span style={{ opacity: 0.5, fontWeight: 400 }}>({cat.links.length})</span>
              </div>
              <div className="flex flex-col gap-0.5">
                {cat.links.map(renderLink)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
