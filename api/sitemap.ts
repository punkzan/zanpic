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
  { id: 'seed-7', slug: 'make-id-photo-online-free', date: '2026-07-20' },
  { id: 'seed-8', slug: 'product-photo-white-background', date: '2026-07-22' },
  { id: 'seed-9', slug: 'social-media-avatar-background', date: '2026-07-25' },
  { id: 'seed-10', slug: 'ai-background-remover-review', date: '2026-07-28' },
];

// Programmatic SEO: ID photo spec pages
const ID_PHOTO_SPECS = [
  { slug: 'china-one-inch', date: '2026-07-31' },
  { slug: 'china-two-inch', date: '2026-07-31' },
  { slug: 'china-small-two-inch', date: '2026-07-31' },
  { slug: 'us-passport', date: '2026-07-31' },
  { slug: 'uk-passport', date: '2026-07-31' },
  { slug: 'japan-visa', date: '2026-07-31' },
  { slug: 'schengen-visa', date: '2026-07-31' },
  { slug: 'india-passport', date: '2026-07-31' },
  { slug: 'canada-passport', date: '2026-07-31' },
  { slug: 'australia-passport', date: '2026-07-31' },
  { slug: 'korea-passport', date: '2026-07-31' },
  { slug: 'china-driving-license', date: '2026-07-31' },
  { slug: 'china-graduation', date: '2026-07-31' },
  { slug: 'china-social-security', date: '2026-07-31' },
  { slug: 'china-health-certificate', date: '2026-07-31' },
  { slug: 'china-hong-kong-macau-pass', date: '2026-07-31' },
  { slug: 'thailand-visa', date: '2026-07-31' },
  { slug: 'singapore-visa', date: '2026-07-31' },
  { slug: 'germany-visa', date: '2026-07-31' },
  { slug: 'russia-visa', date: '2026-07-31' },
  { slug: 'new-zealand-visa', date: '2026-07-31' },
  { slug: 'usa-green-card', date: '2026-07-31' },
  { slug: 'china-residence-permit', date: '2026-07-31' },
  { slug: 'icao-standard', date: '2026-07-31' },
  { slug: 'malaysia-visa', date: '2026-07-31' },
];

// Programmatic SEO: Social media size pages
const SOCIAL_MEDIA_SIZES = [
  { slug: 'instagram-profile', date: '2026-07-31' },
  { slug: 'instagram-story', date: '2026-07-31' },
  { slug: 'instagram-post-square', date: '2026-07-31' },
  { slug: 'youtube-thumbnail', date: '2026-07-31' },
  { slug: 'youtube-banner', date: '2026-07-31' },
  { slug: 'facebook-cover', date: '2026-07-31' },
  { slug: 'twitter-header', date: '2026-07-31' },
  { slug: 'linkedin-cover', date: '2026-07-31' },
  { slug: 'linkedin-profile-photo', date: '2026-07-31' },
  { slug: 'facebook-profile', date: '2026-07-31' },
  { slug: 'tiktok-profile', date: '2026-07-31' },
  { slug: 'wechat-avatar', date: '2026-07-31' },
  { slug: 'discord-avatar', date: '2026-07-31' },
  { slug: 'pinterest-pin', date: '2026-07-31' },
  { slug: 'whatsapp-profile', date: '2026-07-31' },
];

// Programmatic SEO: Background color pages
const BACKGROUND_COLORS = [
  { slug: 'white', date: '2026-07-31' },
  { slug: 'blue', date: '2026-07-31' },
  { slug: 'red', date: '2026-07-31' },
  { slug: 'gradient', date: '2026-07-31' },
];

// Programmatic SEO: Image format conversion pages
const CONVERT_SPECS = [
  { slug: 'jpg-to-png', date: '2026-07-31' },
  { slug: 'png-to-jpg', date: '2026-07-31' },
  { slug: 'jpg-to-webp', date: '2026-07-31' },
  { slug: 'webp-to-jpg', date: '2026-07-31' },
  { slug: 'png-to-webp', date: '2026-07-31' },
  { slug: 'webp-to-png', date: '2026-07-31' },
  { slug: 'bmp-to-png', date: '2026-07-31' },
  { slug: 'bmp-to-jpg', date: '2026-07-31' },
  { slug: 'gif-to-png', date: '2026-07-31' },
  { slug: 'gif-to-jpg', date: '2026-07-31' },
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

  // Tool landing page URLs
  const toolUrls = [
    { loc: `${SITE_URL}/id-photo-maker`, lastmod: today, changefreq: 'weekly', priority: '0.9' },
    { loc: `${SITE_URL}/background-remover`, lastmod: today, changefreq: 'weekly', priority: '0.9' },
    { loc: `${SITE_URL}/photo-resizer`, lastmod: today, changefreq: 'weekly', priority: '0.7' },
    { loc: `${SITE_URL}/photo-filter`, lastmod: today, changefreq: 'weekly', priority: '0.7' },
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

  // Programmatic SEO URLs
  const idPhotoUrls = ID_PHOTO_SPECS.map(s => ({
    loc: `${SITE_URL}/id-photo/${s.slug}`,
    lastmod: s.date,
    changefreq: 'monthly',
    priority: '0.8',
  }));

  const socialMediaUrls = SOCIAL_MEDIA_SIZES.map(s => ({
    loc: `${SITE_URL}/resize/${s.slug}`,
    lastmod: s.date,
    changefreq: 'monthly',
    priority: '0.7',
  }));

  const backgroundUrls = BACKGROUND_COLORS.map(s => ({
    loc: `${SITE_URL}/background/${s.slug}`,
    lastmod: s.date,
    changefreq: 'monthly',
    priority: '0.7',
  }));

  const convertUrls = CONVERT_SPECS.map(s => ({
    loc: `${SITE_URL}/convert/${s.slug}`,
    lastmod: s.date,
    changefreq: 'monthly',
    priority: '0.8',
  }));

  const allUrls = [...staticUrls, ...toolUrls, ...blogUrls, ...idPhotoUrls, ...socialMediaUrls, ...backgroundUrls, ...convertUrls];

  // Add Chinese (/zh/) variants for all SEO pages
  const prefixZh = (u: { loc: string; lastmod: string; changefreq: string; priority: string }) => ({
    ...u,
    loc: u.loc.replace(SITE_URL, `${SITE_URL}/zh`),
  });

  const zhStaticUrls = [
    prefixZh(staticUrls[0]), // homepage -> /zh/
    ...staticUrls.slice(1).map(prefixZh), // /zh/about, /zh/privacy, etc.
  ];
  // Fix homepage URL (it was /zh → now becomes /zh/)
  zhStaticUrls[0].loc = `${SITE_URL}/zh/`;

  const zhToolUrls = toolUrls.map(prefixZh);
  const zhIdPhotoUrls = idPhotoUrls.map(prefixZh);
  const zhSocialMediaUrls = socialMediaUrls.map(prefixZh);
  const zhBackgroundUrls = backgroundUrls.map(prefixZh);
  const zhConvertUrls = convertUrls.map(prefixZh);

  const allZhUrls = [...zhStaticUrls, ...zhToolUrls, ...zhIdPhotoUrls, ...zhSocialMediaUrls, ...zhBackgroundUrls, ...zhConvertUrls];

  const allFinalUrls = [...allUrls, ...allZhUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allFinalUrls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return res.status(200).send(xml);
}
