// ============================================================
// /api/sitemap — 动态站点地图
// 包含静态页面 URL + 从 KV 读取的博客文章 URL
// KV 不可用时回退到仅静态 URL + 预置文章 ID
// ============================================================

import { createClient, type VercelKV } from "@vercel/kv";

interface BlogPost {
  id: string;
  slug?: string;
  date: string;
}

const KV_KEY = "blog:posts";
const SITE_URL = "https://www.superzan.net";

const SEED_POSTS = [
  { id: 'seed-1', slug: 'how-to-take-id-photo', date: '2026-07-05' },
  { id: 'seed-2', slug: 'ai-background-removal-isnet', date: '2026-07-03' },
  { id: 'seed-3', slug: 'ecommerce-product-background-removal', date: '2026-06-28' },
  { id: 'seed-4', slug: 'id-photo-background-color-guide', date: '2026-06-20' },
  { id: 'seed-5', slug: 'photo-filter-color-grading-guide', date: '2026-06-15' },
  { id: 'seed-6', slug: 'webgpu-ai-inference-acceleration', date: '2026-06-10' },
];

function getKvClient(): VercelKV | null {
  const stdUrl = process.env.KV_REST_API_URL;
  const stdToken = process.env.KV_REST_API_TOKEN;
  if (stdUrl && stdToken) {
    try { return createClient({ url: stdUrl, token: stdToken }); } catch { /* fall through */ }
  }
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

let _kvClient: VercelKV | null | undefined;
function kv(): VercelKV | null {
  if (_kvClient === undefined) _kvClient = getKvClient();
  return _kvClient;
}

export default async function handler(_req: any, res: any) {
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600");

  const today = new Date().toISOString().slice(0, 10);

  // Static URLs
  const staticUrls = [
    { loc: `${SITE_URL}/`, lastmod: today, changefreq: 'weekly', priority: '1.0' },
    { loc: `${SITE_URL}/about`, lastmod: today, changefreq: 'monthly', priority: '0.5' },
    { loc: `${SITE_URL}/privacy`, lastmod: today, changefreq: 'monthly', priority: '0.3' },
    { loc: `${SITE_URL}/contact`, lastmod: today, changefreq: 'monthly', priority: '0.3' },
    { loc: `${SITE_URL}/blog`, lastmod: today, changefreq: 'weekly', priority: '0.8' },
  ];

  // Blog post URLs — try KV first, fallback to seed posts
  let blogPosts: { id: string; slug?: string; date: string }[] = SEED_POSTS;
  try {
    const client = kv();
    if (client) {
      const posts = await client.get<BlogPost[]>(KV_KEY);
      if (posts && posts.length > 0) {
        blogPosts = posts.map(p => ({ id: p.id, slug: p.slug, date: p.date }));
      }
    }
  } catch {
    // KV error — use seed posts as fallback
  }

  const blogUrls = blogPosts.map(p => ({
    loc: `${SITE_URL}/blog/${p.slug || p.id}`,
    lastmod: p.date,
    changefreq: 'monthly',
    priority: '0.6',
  }));

  const allUrls = [...staticUrls, ...blogUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return res.status(200).send(xml);
}
