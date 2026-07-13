// ============================================================
// /api/posts — 经验分享文章 CRUD（Vercel Serverless Function）
// 存储：Upstash Redis / Vercel KV（自动检测环境变量）
// GET    /api/posts        → 公开读取所有文章
// POST   /api/posts        → 管理员新增文章（需 x-admin-password 头）
// PUT    /api/posts        → 管理员编辑文章（需 x-admin-password 头）
// DELETE /api/posts        → 管理员删除文章（需 x-admin-password 头）
// ============================================================

import { createClient, type VercelKV } from "@vercel/kv";

interface BlogPost {
  id: string;
  title: string;
  date: string;      // YYYY-MM-DD
  category: string;
  excerpt: string;
  seedKey?: string;  // i18n key prefix for seed posts
}

const KV_KEY = "blog:posts";

/** 默认预置文章（首次访问或 KV 为空时填充） */
const DEFAULT_POSTS: BlogPost[] = [
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
];

/** 校验管理员密码 */
function verifyAdmin(req: any): boolean {
  const password = req.headers["x-admin-password"];
  // Use env variable if set, otherwise fallback to default password
  const adminPassword = process.env.ADMIN_PASSWORD || "slimage2024";
  return password === adminPassword;
}

/** 自动扫描环境变量，找到 Upstash Redis / KV 配置 */
function getKvClient(): VercelKV | null {
  // 1. 标准名
  const stdUrl = process.env.KV_REST_API_URL;
  const stdToken = process.env.KV_REST_API_TOKEN;
  if (stdUrl && stdToken) {
    try { return createClient({ url: stdUrl, token: stdToken }); } catch { /* fall through */ }
  }

  // 2. 通配扫描
  for (const [key, value] of Object.entries(process.env)) {
    if (key.endsWith("_REST_API_URL") && value && key !== "KV_REST_API_URL") {
      const tokenKey = key.replace("_URL", "_TOKEN");
      const token = process.env[tokenKey];
      if (token) {
        try { return createClient({ url: value, token }); } catch { /* continue */ }
      }
    }
  }

  return null;
}

/** 模块级缓存 */
let _kvClient: VercelKV | null | undefined;
function kv(): VercelKV | null {
  if (_kvClient === undefined) _kvClient = getKvClient();
  return _kvClient;
}

export default async function handler(req: any, res: any) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-admin-password");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  if (req.method === "OPTIONS") return res.status(200).end();

  const client = kv();

  // ============ GET：公开读取 ============
  if (req.method === "GET") {
    try {
      if (!client) {
        return res.status(200).json({ posts: DEFAULT_POSTS, fallback: true });
      }
      let posts = await client.get<BlogPost[]>(KV_KEY);
      if (!posts || posts.length === 0) {
        posts = DEFAULT_POSTS;
        await client.set(KV_KEY, posts);
      }
      return res.status(200).json({ posts });
    } catch {
      return res.status(200).json({ posts: DEFAULT_POSTS, fallback: true });
    }
  }

  // ============ 写操作需管理员权限 ============
  if (!verifyAdmin(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!client) {
    return res.status(503).json({ 
      error: "KV is not configured. Please add Upstash Redis in Vercel Storage." 
    });
  }

  // ============ POST：新增文章 ============
  if (req.method === "POST") {
    try {
      const posts = (await client.get<BlogPost[]>(KV_KEY)) || DEFAULT_POSTS;
      const newPost: BlogPost = {
        id: `post-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
        title: (req.body.title || "").trim() || "未命名文章",
        date: req.body.date || new Date().toISOString().slice(0, 10),
        category: (req.body.category || "").trim() || "未分类",
        excerpt: (req.body.excerpt || "").trim(),
      };
      const updated = [newPost, ...posts];
      await client.set(KV_KEY, updated);
      return res.status(201).json({ post: newPost, posts: updated });
    } catch {
      return res.status(500).json({ error: "Failed to add post" });
    }
  }

  // ============ PUT：编辑文章 ============
  if (req.method === "PUT") {
    try {
      const posts = (await client.get<BlogPost[]>(KV_KEY)) || DEFAULT_POSTS;
      const { id, title, date, category, excerpt } = req.body;
      const updated = posts.map((p) =>
        p.id === id
          ? {
              ...p,
              title: title !== undefined ? ((title || "").trim() || "未命名文章") : p.title,
              date: date || p.date,
              category: category !== undefined ? ((category || "").trim() || "未分类") : p.category,
              excerpt: excerpt !== undefined ? ((excerpt || "").trim()) : p.excerpt,
              seedKey: undefined, // clear seedKey so edits take effect
            }
          : p
      );
      await client.set(KV_KEY, updated);
      return res.status(200).json({ posts: updated });
    } catch {
      return res.status(500).json({ error: "Failed to update post" });
    }
  }

  // ============ DELETE：删除文章 ============
  if (req.method === "DELETE") {
    try {
      const posts = (await client.get<BlogPost[]>(KV_KEY)) || DEFAULT_POSTS;
      const { id } = req.body;
      const updated = posts.filter((p) => p.id !== id);
      await client.set(KV_KEY, updated);
      return res.status(200).json({ posts: updated });
    } catch {
      return res.status(500).json({ error: "Failed to delete post" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
