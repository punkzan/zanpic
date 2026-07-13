import { create } from 'zustand'

export interface BlogPost {
  id: string
  title: string // default text (Chinese or whatever admin types)
  date: string // YYYY-MM-DD
  category: string
  excerpt: string
  /** For seed posts: i18n key prefix, e.g. "seed1" → blog.seed1.title */
  seedKey?: string
  /** Optional per-language translations for user-created posts */
  translations?: Record<string, { title?: string; category?: string; excerpt?: string }>
}

/** Default seed posts — shipped with the app. Content comes from i18n locale files. */
const SEED_POSTS: BlogPost[] = [
  {
    id: 'seed-1',
    seedKey: 'seed1',
    date: '2026-07-05',
    title: '如何拍出适合证件照的照片',
    category: '证件照技巧',
    excerpt:
      '证件照是很多人头疼的问题。本文从光线、角度、表情、着装四个方面，教你用手机拍出高质量的证件照原图，配合 Zan Pic 一键生成标准证件照。',
  },
  {
    id: 'seed-2',
    seedKey: 'seed2',
    date: '2026-07-03',
    title: 'AI 抠图技术原理：IS-Net 模型详解',
    category: '技术解析',
    excerpt:
      'Zan Pic 的 AI 抠图功能基于 IS-Net（Iterative Spatial Refinement Network）模型。本文深入浅出地讲解模型架构、ONNX 推理流程和 WebGPU 加速原理。',
  },
  {
    id: 'seed-3',
    seedKey: 'seed3',
    date: '2026-06-28',
    title: '电商商品图背景移除最佳实践',
    category: '实用教程',
    excerpt:
      '商品图背景移除是电商运营的高频需求。本文介绍如何用涂抹抠图功能处理复杂边缘（如毛绒玩具、透明材质），以及如何批量处理商品图。',
  },
  {
    id: 'seed-4',
    seedKey: 'seed4',
    date: '2026-06-20',
    title: '证件照背景色选择指南',
    category: '证件照技巧',
    excerpt:
      '红色、白色、蓝色背景分别用于什么场景？各国签证照片对背景有什么要求？本文汇总了常见证件照规格和背景色标准。',
  },
  {
    id: 'seed-5',
    seedKey: 'seed5',
    date: '2026-06-15',
    title: '图片滤镜调色入门',
    category: '后期调色',
    excerpt:
      '亮度、对比度、饱和度是图片调色的三要素。本文从基础概念讲起，配合 Zan Pic 的实时预览功能，帮你快速掌握调色技巧。',
  },
  {
    id: 'seed-6',
    seedKey: 'seed6',
    date: '2026-06-10',
    title: 'WebGPU 加速：让浏览器 AI 推理快 10 倍',
    category: '技术解析',
    excerpt:
      'WebGPU 是新一代浏览器图形 API，不仅用于渲染，还能加速 AI 推理。本文介绍 Zan Pic 如何利用 WebGPU 将抠图速度提升数倍。',
  },
]

const STORAGE_KEY = 'zanpic_blog_posts'
const DIAG_PREFIX = '[ZanPic BlogStore]'

function loadPosts(): BlogPost[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        console.log(DIAG_PREFIX, 'loadPosts: loaded', parsed.length, 'posts from localStorage')
        // Migration: add seedKey to seed posts that were stored before the i18n update
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
        if (needsPersist) {
          safeSetItem(STORAGE_KEY, JSON.stringify(migrated))
        }
        return migrated
      }
      // Data exists but is empty/invalid — don't overwrite user data
      console.warn(DIAG_PREFIX, 'loadPosts: data exists but is empty/invalid, returning []')
      return []
    }
    console.log(DIAG_PREFIX, 'loadPosts: no data in localStorage, will seed')
  } catch (err) {
    // Data is corrupt — back it up to prevent data loss, then seed
    console.error(DIAG_PREFIX, 'loadPosts: corrupt data, backing up', err)
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      try { localStorage.setItem(STORAGE_KEY + '_backup', raw) } catch {}
    }
  }
  // First visit — seed and persist
  console.log(DIAG_PREFIX, 'loadPosts: first visit, seeding', SEED_POSTS.length, 'default posts')
  safeSetItem(STORAGE_KEY, JSON.stringify(SEED_POSTS))
  return [...SEED_POSTS]
}

/** localStorage.setItem with error handling and diagnostics */
function safeSetItem(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value)
    // Verify the write actually took effect
    const verify = localStorage.getItem(key)
    if (verify !== value) {
      console.error(DIAG_PREFIX, 'safeSetItem: VERIFY FAILED for', key, '- written value differs from read-back')
      return false
    }
    return true
  } catch (err) {
    console.error(DIAG_PREFIX, 'safeSetItem: WRITE FAILED for', key, '-', err, '- value length:', value.length)
    return false
  }
}

function persist(posts: BlogPost[]) {
  const json = JSON.stringify(posts)
  const ok = safeSetItem(STORAGE_KEY, json)
  if (!ok) {
    console.error(DIAG_PREFIX, 'persist: FAILED to save', posts.length, 'posts. Check browser console for details.')
    // Attempt emergency write to sessionStorage as fallback
    try { sessionStorage.setItem(STORAGE_KEY + '_emergency', json) } catch {}
  } else {
    console.log(DIAG_PREFIX, 'persist: saved', posts.length, 'posts OK')
  }
}

// Expose diagnostic function for debugging
if (typeof window !== 'undefined') {
  ;(window as any).__zanpic_blog_diag__ = () => {
    const raw = localStorage.getItem(STORAGE_KEY)
    const sessionBackup = sessionStorage.getItem(STORAGE_KEY + '_emergency')
    const state = useBlogStore.getState()
    console.group(DIAG_PREFIX + ' DIAGNOSTIC')
    console.log('Zustand state posts:', state.posts.length)
    console.log('localStorage     posts:', raw ? JSON.parse(raw).length : '(empty)')
    console.log('sessionStorage emergency:', sessionBackup ? JSON.parse(sessionBackup).length : '(empty)')
    if (raw) console.log('localStorage sample (first 200 chars):', raw.slice(0, 200))
    console.groupEnd()
    return { zustand: state.posts.length, localStorage: raw ? JSON.parse(raw).length : 0, sessionEmergency: sessionBackup ? JSON.parse(sessionBackup).length : 0 }
  }
}

let _idCounter = 0
function nextId(): string {
  _idCounter++
  return `post-${Date.now()}-${_idCounter}`
}

interface BlogStore {
  posts: BlogPost[]
  /** Add a new post (auto-generates id + today's date if empty) */
  addPost: (post: Omit<BlogPost, 'id'>) => void
  /** Update an existing post by id */
  updatePost: (id: string, patch: Partial<Omit<BlogPost, 'id'>>) => void
  /** Delete a post by id */
  deletePost: (id: string) => void
}

export const useBlogStore = create<BlogStore>((set) => ({
  posts: loadPosts(),

  addPost: (post) =>
    set((s) => {
      const next: BlogPost = {
        ...post,
        id: nextId(),
        date: post.date || new Date().toISOString().slice(0, 10),
      }
      const updated = [next, ...s.posts]
      console.log(DIAG_PREFIX, 'addPost: creating post id=' + next.id + ', title="' + next.title.slice(0, 30) + '", total now=' + updated.length)
      persist(updated)
      return { posts: updated }
    }),

  updatePost: (id, patch) =>
    set((s) => {
      const updated = s.posts.map((p) => (p.id === id ? { ...p, ...patch } : p))
      persist(updated)
      return { posts: updated }
    }),

  deletePost: (id: string) =>
    set((s) => {
      const updated = s.posts.filter((p) => p.id !== id)
      persist(updated)
      return { posts: updated }
    }),
}))

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
      // Not customized — use i18n translation
      const key = `blog.${post.seedKey}.${field}`
      const translated = t(key)
      if (translated && translated !== key) return translated
    }
    // Customized — fall through to return the user's custom value
  }
  // User posts: always return original text
  return post[field]
}
