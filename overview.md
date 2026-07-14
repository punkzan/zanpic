# 博客存储迁移：localStorage → Vercel KV

## 改动概要

| 文件 | 操作 | 说明 |
|------|------|------|
| `api/posts.ts` | 新建 | Vercel Serverless Function，GET/POST/PUT/DELETE |
| `src/lib/blogApi.ts` | 新建 | API 客户端，管理员密码认证 |
| `src/store/blogStore.ts` | 重写 | API 优先 + localStorage fallback |
| `src/components/PageModal.tsx` | 修改 | BlogContent 从 API 拉取文章 |
| `src/pages/AdminPage.tsx` | 修改 | 登录时存储密码用于 API 调用 |
| `vercel.json` | 修改 | `/api/*` 不被 SPA catch-all 拦截 |
| `package.json` | 修改 | 新增 `@vercel/kv` 依赖 |

## 架构

```
管理员后台 → addPost/updatePost/deletePost
    ↓
blogStore (Zustand) — 乐观更新本地状态
    ↓
blogApi.ts — fetch('/api/posts', { headers: { 'x-admin-password': ... } })
    ↓
api/posts.ts (Vercel Serverless) — 读写 Vercel KV
    ↓
所有访客打开"经验分享" → syncFromApi() → GET /api/posts → 相同内容
```

## 环境对比

| | 开发环境 (`npm run dev`) | 生产环境（Vercel + KV） |
|---|---|---|
| 数据存储 | localStorage | Vercel KV (Upstash Redis) |
| 访客可见性 | 各自浏览器独立 | 所有人看到相同内容 |
| 管理员写入 | 只影响当前浏览器 | 写入 KV，所有访客可见 |

## 部署后需做的

1. Vercel Dashboard → Storage → 创建 Upstash Redis KV
2. Vercel 自动注入 `KV_REST_API_URL` / `KV_REST_API_TOKEN` 环境变量
3. 推荐设置 `ADMIN_PASSWORD` 环境变量（用于 API 认证）
