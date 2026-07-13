import { create } from 'zustand'
import * as blogApi from '../lib/blogApi'

export interface BlogPost {
  id: string
  title: string // default text (Chinese or whatever admin types)
  date: string // YYYY-MM-DD
  category: string
  excerpt: string
  /** For seed posts: i18n key prefix, e.g. "seed1" → blog.seed1.title */
  seedKey?: string
}

/** Default seed posts — shipped with the app. Content comes from i18n locale files. */
const SEED_POSTS: BlogPost[] = [
  {
    id: 'seed-1', seedKey: 'seed1', date: '2026-07-05',
    title: '如何拍出适合证件照的照片', category: '证件照技巧',
    excerpt: '证件照是很多人头疼的问题。本文从光线、角度、表情、着装四个方面，教你用手机拍出高质量的证件照原图，配合 Zan Pic 一键生成标准证件照。',
  },
  {
    id: 'seed-2', seedKey: 'seed2', date: '2026-07-03',
    title: 'AI 抠图技术原理：IS-Net 模型详解', category: '技术解析',
    excerpt: 'Zan Pic 的 AI 抠图功能基于 IS-Net（Iterative Spatial Refinement Network）模型。本文深入浅出地讲解模型架构、ONNX 推理流程和 WebGPU 加速原理。',
  },
  {
    id: 'seed-3', seedKey: 'seed3', date: '2026-06-28',
    title: '电商商品图背景移除最佳实践', category: '实用教程',
    excerpt: '商品图背景移除是电商运营的高频需求。本文介绍如何用涂抹抠图功能处理复杂边缘（如毛绒玩具、透明材质），以及如何批量处理商品图。',
  },
  {
    id: 'seed-4', seedKey: 'seed4', date: '2026-06-20',
    title: '证件照背景色选择指南', category: '证件照技巧',
    excerpt: '红色、白色、蓝色背景分别用于什么场景？各国签证照片对背景有什么要求？本文汇总了常见证件照规格和背景色标准。',
  },
  {
    id: 'seed-5', seedKey: 'seed5', date: '2026-06-15',
    title: '图片滤镜调色入门', category: '后期调色',
    excerpt: '亮度、对比度、饱和度是图片调色的三要素。本文从基础概念讲起，配合 Zan Pic 的实时预览功能，帮你快速掌握调色技巧。',
  },
  {
    id: 'seed-6', seedKey: 'seed6', date: '2026-06-10',
    title: 'WebGPU 加速：让浏览器 AI 推理快 10 倍', category: '技术解析',
    excerpt: 'WebGPU 是新一代浏览器图形 API，不仅用于渲染，还能加速 AI 推理。本文介绍 Zan Pic 如何利用 WebGPU 将抠图速度提升数倍。',
  },
]

const STORAGE_KEY = 'zanpic_blog_posts'
const DIAG_PREFIX = '[ZanPic BlogStore]'

// ── localStorage helpers ──

function loadPosts(): BlogPost[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Migration: add seedKey to seed posts stored before the i18n update
        const seedKeyMap: Record<string, string> = {
          'seed-1': 'seed1', 'seed-2': 'seed2', 'seed-3': 'seed3',
          'seed-4': 'seed4', 'seed-5': 'seed5', 'seed-6': 'seed6',
        }
        let needsPersist = false
        const migrated = parsed.map((p: BlogPost) => {
          if (seedKeyMap[p.id] && !p.seedKey) {
            needsPersist = true
            return { ...p, seedKey: seedKeyMap[p.id] }
          }
          return p
        })
        if (needsPersist) safeSetItem(STORAGE_KEY, JSON.stringify(migrated))
        return migrated
      }
      return []
    }
  } catch (err) {
    console.error(DIAG_PREFIX, 'loadPosts: corrupt data, backing up', err)
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      try { localStorage.setItem(STORAGE_KEY + '_backup', raw) } catch {}
    }
  }
  safeSetItem(STORAGE_KEY, JSON.stringify(SEED_POSTS))
  return [...SEED_POSTS]
}

function safeSetItem(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value)
    return true
  } catch { return false }
}

function persist(posts: BlogPost[]) {
  safeSetItem(STORAGE_KEY, JSON.stringify(posts))
}

let _idCounter = 0
function nextId(): string {
  _idCounter++
  return `post-${Date.now().toString(36)}-${_idCounter}`
}

// ── Store ──

interface BlogStore {
  posts: BlogPost[]
  /** Whether we're reading from the API (Vercel KV) — false = local fallback */
  usingApi: boolean
  /** True while first API call is in-flight */
  loading: boolean
  /** Last API error message, if any */
  error: string

  /** Add a new post (local + API) */
  addPost: (post: Omit<BlogPost, 'id'>) => void
  /** Update an existing post (local + API) */
  updatePost: (id: string, patch: Partial<Omit<BlogPost, 'id'>>) => void
  /** Delete a post (local + API) */
  deletePost: (id: string) => void
  /** Reload posts: API first, fallback to localStorage */
  syncFromApi: () => Promise<void>
  /** Force reload from localStorage only */
  reloadFromLocal: () => void
}

export const useBlogStore = create<BlogStore>((set, get) => ({
  posts: loadPosts(),
  usingApi: false,
  loading: false,
  error: '',

  // ── Async: pull from API on first call ──
  syncFromApi: async () => {
    const s = get()
    // Prevent duplicate in-flight requests
    if (s.loading) return
    set({ loading: true, error: '' })
    try {
      const { posts: apiPosts, fallback } = await blogApi.fetchPosts()
      if (!fallback) {
        // Got real data from KV — update both Zustand and localStorage cache
        set({ posts: apiPosts, usingApi: true, loading: false })
        persist(apiPosts)
      } else {
        // KV not configured — keep localStorage data
        set({ usingApi: false, loading: false })
      }
    } catch {
      // API unreachable (local dev or network error) — keep localStorage data
      set({ usingApi: false, loading: false })
    }
  },

  reloadFromLocal: () => {
    set({ posts: loadPosts() })
  },

  // ── Optimistic CRUD: local update first, then API ──

  addPost: (post) =>
    set((s) => {
      const next: BlogPost = {
        ...post,
        id: nextId(),
        date: post.date || new Date().toISOString().slice(0, 10),
      }
      const updated = [next, ...s.posts]
      persist(updated)

      // Fire API call in background (don't block UI)
      if (s.usingApi) {
        const pwd = sessionStorage.getItem('zanpic_admin_pwd')
        if (pwd) {
          blogApi.createPost(post).then((res) => {
            // Replace the temporary id with the server-assigned one
            set({ posts: res.posts })
            persist(res.posts)
          }).catch((err) => {
            console.error(DIAG_PREFIX, 'addPost API failed:', err.message)
            set({ error: 'Failed to sync with server. Saved locally.' })
          })
        }
      }

      return { posts: updated, error: '' }
    }),

  updatePost: (id, patch) =>
    set((s) => {
      const updated = s.posts.map((p) => (p.id === id ? { ...p, ...patch } : p))
      persist(updated)

      if (s.usingApi) {
        const pwd = sessionStorage.getItem('zanpic_admin_pwd')
        if (pwd) {
          blogApi.updatePost(id, patch).catch((err) => {
            console.error(DIAG_PREFIX, 'updatePost API failed:', err.message)
            set({ error: 'Failed to sync with server. Saved locally.' })
          })
        }
      }

      return { posts: updated, error: '' }
    }),

  deletePost: (id: string) =>
    set((s) => {
      const updated = s.posts.filter((p) => p.id !== id)
      persist(updated)

      if (s.usingApi) {
        const pwd = sessionStorage.getItem('zanpic_admin_pwd')
        if (pwd) {
          blogApi.removePost(id).catch((err) => {
            console.error(DIAG_PREFIX, 'deletePost API failed:', err.message)
            set({ error: 'Failed to sync with server. Saved locally.' })
          })
        }
      }

      return { posts: updated, error: '' }
    }),
}))

// ── Diagnostic tool ──
if (typeof window !== 'undefined') {
  ;(window as any).__zanpic_blog_diag__ = () => {
    const raw = localStorage.getItem(STORAGE_KEY)
    const state = useBlogStore.getState()
    console.group(DIAG_PREFIX + ' DIAGNOSTIC')
    console.warn('Zustand posts:', state.posts.length)
    console.warn('usingApi:', state.usingApi)
    console.warn('localStorage posts:', raw ? JSON.parse(raw).length : '(empty)')
    if (raw) console.warn('localStorage sample (first 200 chars):', raw.slice(0, 200))
    console.warn('Tip: call useBlogStore.getState().syncFromApi() to fetch from KV')
    console.groupEnd()
    return {
      zustand: state.posts.length,
      usingApi: state.usingApi,
      localStorage: raw ? JSON.parse(raw).length : 0,
    }
  }

  // Sync state when another tab/window changes localStorage
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
      console.warn(DIAG_PREFIX, 'storage event: localStorage changed in another tab, reloading')
      useBlogStore.setState({ posts: loadPosts() })
    }
  })
}

// ── getPostField helper ──

/**
 * Get a localized field from a blog post.
 * - Seed posts: use i18n keys (blog.{seedKey}.{field}), UNLESS the user has
 *   customized that field — in which case return the user's custom value.
 * - User posts: always return the original text as entered
 */
export function getPostField(
  post: BlogPost,
  field: 'title' | 'category' | 'excerpt',
  _lang: string,
  t: (key: string) => string,
): string {
  // Seed posts: check if user has customized this field
  if (post.seedKey) {
    const seedPost = SEED_POSTS.find((p) => p.id === post.id)
    const isCustomized = !seedPost || seedPost[field] !== post[field]

    if (!isCustomized) {
      const key = `blog.${post.seedKey}.${field}`
      const translated = t(key)
      if (translated && translated !== key) return translated
    }
  }
  return post[field]
}
