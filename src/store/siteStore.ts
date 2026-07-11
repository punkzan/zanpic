import { create } from 'zustand'

/* ========================================================
   Site Store — persisted to localStorage
   Footer settings: ICP filing, friend links, company info
   Managed from /admin panel
   ======================================================== */

export interface FriendLink {
  id: string
  name: string
  url: string
}

export interface SeoSettings {
  /** Page <title> tag, also used for og:title */
  title: string
  /** <meta name="description">, also used for og:description */
  description: string
  /** <meta name="keywords"> — comma separated */
  keywords: string
  /** <meta name="author"> */
  author: string
  /** og:image URL — social sharing preview image */
  ogImage: string
}

export interface SiteStore {
  /* ---- ICP / 备案信息 ---- */
  icpFilingNumber: string
  publicSecurityFilingNumber: string

  /* ---- 公司 / 版权 ---- */
  companyName: string

  /* ---- 友情链接 ---- */
  friendLinks: FriendLink[]

  /* ---- SEO 设置 ---- */
  seo: SeoSettings

  /* ---- Actions ---- */
  setFilingInfo: (patch: Partial<Pick<SiteStore, 'icpFilingNumber' | 'publicSecurityFilingNumber' | 'companyName'>>) => void
  setSeo: (patch: Partial<SeoSettings>) => void
  addFriendLink: (link: Omit<FriendLink, 'id'>) => void
  updateFriendLink: (id: string, patch: Partial<Omit<FriendLink, 'id'>>) => void
  deleteFriendLink: (id: string) => void
}

const STORAGE_KEY = 'zanpic_site_settings'

function load(): Partial<SiteStore> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* corrupt */ }
  return {}
}

function persist(state: SiteStore) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

const DEFAULT_SEO: SeoSettings = {
  title: 'Zan Pic - 免费在线图片编辑器 | AI抠图 证件照 滤镜裁剪',
  description: 'Zan Pic 是一款免费在线图片编辑器，支持AI智能抠图、证件照生成、滤镜调色、裁剪旋转、图片压缩、格式转换、自定义水印等功能。所有处理在浏览器本地完成，无需上传，保护隐私。',
  keywords: '图片编辑,在线修图,AI抠图,证件照制作,图片压缩,格式转换,图片滤镜,裁剪工具,免费图片编辑器,在线PS,背景移除,照片处理',
  author: 'Zan Pic',
  ogImage: '',
}

function getSaved() {
  const saved = load()
  return {
    icpFilingNumber: saved.icpFilingNumber ?? '',
    publicSecurityFilingNumber: saved.publicSecurityFilingNumber ?? '',
    companyName: saved.companyName ?? '',
    friendLinks: saved.friendLinks ?? [],
    seo: { ...DEFAULT_SEO, ...(saved.seo ?? {}) },
  }
}

let idCounter = Date.now()
function genId(): string {
  return `fl_${(++idCounter).toString(36)}`
}

export const useSiteStore = create<SiteStore>((set) => ({
  ...getSaved(),

  setFilingInfo: (patch) =>
    set((s) => {
      const next = { ...s, ...patch }
      persist(next)
      return { ...patch }
    }),

  setSeo: (patch) =>
    set((s) => {
      const next = { ...s, seo: { ...s.seo, ...patch } }
      persist(next)
      return { seo: next.seo }
    }),

  addFriendLink: (link) =>
    set((s) => {
      const next = { ...s, friendLinks: [...s.friendLinks, { ...link, id: genId() }] }
      persist(next)
      return { friendLinks: next.friendLinks }
    }),

  updateFriendLink: (id, patch) =>
    set((s) => {
      const next = {
        ...s,
        friendLinks: s.friendLinks.map((l) => (l.id === id ? { ...l, ...patch } : l)),
      }
      persist(next)
      return { friendLinks: next.friendLinks }
    }),

  deleteFriendLink: (id) =>
    set((s) => {
      const next = {
        ...s,
        friendLinks: s.friendLinks.filter((l) => l.id !== id),
      }
      persist(next)
      return { friendLinks: next.friendLinks }
    }),
}))
