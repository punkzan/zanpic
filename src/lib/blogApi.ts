// ============================================================
// blogApi — 经验分享文章 API 客户端
// 与 /api/posts 服务端函数通信
// 生产环境：Vercel KV
// 开发环境：API 不可用时 fallback 到 localStorage
// ============================================================

import type { BlogPost } from '../store/blogStore'

export interface ApiPostsResponse {
  posts: BlogPost[]
  fallback?: boolean
}

export interface ApiCreateResponse {
  post: BlogPost
  posts: BlogPost[]
}

export interface ApiUpdateResponse {
  posts: BlogPost[]
}

/** 从 admin session 中读取密码 */
function getAdminPassword(): string | null {
  try {
    return sessionStorage.getItem('zanpic_admin_pwd')
  } catch {
    return null
  }
}

/** 获取所有文章（公开） */
export async function fetchPosts(): Promise<ApiPostsResponse> {
  const res = await fetch('/api/posts')
  if (!res.ok) throw new Error(`Failed to fetch posts: ${res.status}`)
  const data = await res.json()
  return { posts: data.posts || [], fallback: !!data.fallback }
}

/** 新增文章（管理员） */
export async function createPost(post: Omit<BlogPost, 'id'>): Promise<ApiCreateResponse> {
  const password = getAdminPassword()
  const res = await fetch('/api/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-password': password || '',
    },
    body: JSON.stringify(post),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `Failed to create post: ${res.status}`)
  }
  return res.json()
}

/** 编辑文章（管理员） */
export async function updatePost(id: string, patch: Partial<BlogPost>): Promise<ApiUpdateResponse> {
  const password = getAdminPassword()
  const res = await fetch('/api/posts', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-password': password || '',
    },
    body: JSON.stringify({ id, ...patch }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `Failed to update post: ${res.status}`)
  }
  return res.json()
}

/** 删除文章（管理员） */
export async function removePost(id: string): Promise<ApiUpdateResponse> {
  const password = getAdminPassword()
  const res = await fetch('/api/posts', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-password': password || '',
    },
    body: JSON.stringify({ id }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `Failed to delete post: ${res.status}`)
  }
  return res.json()
}
