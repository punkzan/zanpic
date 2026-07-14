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
  content?: string;  // Full article body text
  seedKey?: string;  // i18n key prefix for seed posts
}

const KV_KEY = "blog:posts";

/** 默认预置文章（首次访问或 KV 为空时填充） */
const DEFAULT_POSTS: BlogPost[] = [
  {
    id: 'seed-1', seedKey: 'seed1', date: '2026-07-05',
    title: '如何拍出适合证件照的照片',
    category: '证件照技巧',
    excerpt: '证件照是很多人头疼的问题。本文从光线、角度、表情、着装四个方面，教你用手机拍出高质量的证件照原图，配合 Zan Pic 一键生成标准证件照。',
    content: `## 拍好证件照的四大要素\n\n一张合格的证件照需要满足光线均匀、正面平视、表情自然、着装得体四个基本条件。下面我们逐一讲解。\n\n### 1. 光线\n\n选择**自然光**是最好的方案。面向窗户拍摄，让光线均匀地洒在脸上。避免侧光造成面部阴影过重，也避免顶光（如天花板灯直射）产生难看的阴影。\n\n如果没有自然光条件：\n- 使用两盏台灯分别放在左右两侧 **45° 角**\n- 保持灯光高度与眼睛齐平或略高\n- 避免使用闪光灯直射（会产生红眼和油光）\n\n### 2. 角度\n\n手机摄像头应与眼睛保持**同一水平线**。可以靠墙站立，将手机固定在视线高度。\n\n- 手机距离：**手臂长度 + 20-30cm** 最佳\n- 构图：头部和肩部占画面 **70-80%**\n- 背景：纯色墙面（白墙最佳）\n\n### 3. 表情\n\n证件照不需要微笑（大多数官方要求中性表情），但要做到：\n\n- **双眼睁开**，目视镜头\n- **嘴巴自然闭合**，不露齿\n- **眉毛放松**，不要挑眉或皱眉\n- 头部**端正**，不歪头\n\n### 4. 着装\n\n根据证件类型选择合适的服装：\n\n| 证件类型 | 推荐着装 |\n|---------|---------|\n| 身份证 | 深色上衣（避免白色，会与背景融合）|\n| 护照 | 有领衬衫或正式服装 |\n| 签证照 | 按目标国要求，通常为正装 |\n| 驾驶证 | 日常整洁服装即可 |\n\n### 后期处理\n\n拍好后，使用 Zan Pic 的**证件照功能**即可一键完成：\n1. 上传你拍摄的原始照片\n2. AI 自动抠图移除原背景\n3. 选择需要的背景颜色（红/白/蓝）\n4. 自动裁剪到标准尺寸（1寸/2寸等）\n\n整个过程不超过 10 秒，效果媲美照相馆专业出品。`,
  },
  {
    id: 'seed-2', seedKey: 'seed2', date: '2026-07-03',
    title: 'AI 抠图技术原理：IS-Net 模型详解',
    category: '技术解析',
    excerpt: 'Zan Pic 的 AI 抠图功能基于 IS-Net（Iterative Spatial Refinement Network）模型。本文深入浅出地讲解模型架构、ONNX 推理流程和 WebGPU 加速原理。',
    content: `## IS-Net：迭代空间精炼网络\n\nZan Pic 的 AI 抠图功能采用的是 **IS-Net（Iterative Spatial Refinement Network）**，这是一种专为图像前景分割设计的深度学习模型。\n\n### 为什么选 IS-Net？\n\n传统的前景分割方法（如 GrabCut、DeepLab）在处理以下场景时表现不佳：\n\n- **发丝级边缘** — 细碎的头发边缘难以精确分离\n- **半透明物体** — 如烟雾、薄纱、玻璃\n- **复杂背景** — 背景色与前景色接近时容易混淆\n\nIS-Net 通过**迭代精炼机制**逐层细化分割边界，在这些场景下显著优于其他模型。\n\n### 模型架构\n\nIS-Net 由三个核心模块组成：\n\n输入图像 (RGB) → 特征提取器(Backbone) → 空间精炼器(Refiner) → 输出头 → 前景蒙版 (alpha matte)\n\n### ONNX Runtime：浏览器中的推理引擎\n\n模型文件以 **ONNX（Open Neural Network Exchange）** 格式存储，这是业界标准的模型交换格式。在浏览器中，我们通过 **ONNX Runtime Web** 执行推理。\n\n支持的运行后端：\n- WebGPU 可用：WGPU 后端 - 快 5~10x\n- 仅 WebGL：WebGL 后端\n- CPU 回退：WASM CPU 后端\n\n### WebGPU 加速\n\n当用户的浏览器支持 WebGPU 时（Chrome 113+、Edge 113+），推理速度可提升 **5-10 倍**：\n\n| 后端 | 典型耗时 |\n|------|----------|\n| WASM CPU | 3-8 秒 |\n| WebGL | 1-3 秒 |\n| **WebGPU** | **0.3-0.8 秒** |\n\n这就是为什么 Zan Pic 在支持的浏览器上能实现"秒级抠图"体验的原因。`,
  },
  {
    id: 'seed-3', seedKey: 'seed3', date: '2026-06-28',
    title: '电商商品图背景移除最佳实践',
    category: '实用教程',
    excerpt: '商品图背景移除是电商运营的高频需求。本文介绍如何用涂抹抠图功能处理复杂边缘（如毛绒玩具、透明材质），以及如何批量处理商品图。',
    content: `## 电商商品图背景移除完全指南\n\n对于电商平台卖家来说，一张干净的商品主图直接影响点击率和转化率。\n\n### 常见商品类型的处理策略\n\n#### 1. 服饰类（最容易）\n服装照片通常背景对比明显，AI 智能抠图一次成功率高。\n\n#### 2. 毛绒玩具（中等难度）\n毛绒玩具的毛发边缘是 AI 抠图的挑战点：\n- **智能抠图**作为第一轮，处理主体轮廓\n- **涂抹抠图**精细调整：绿色笔刷保留区域、红色笔刷删除区域\n- **技巧**：放大到 200%+ 进行精细涂抹\n\n#### 3. 透明/半透明材质（高难度）\n玻璃制品、塑料包装、透明材质需要特殊处理。\n\n#### 4. 首饰珠宝类\n金属反光和宝石透明度增加了难度。\n\n### 平台规格参考\n\n| 平台 | 主图要求 | 推荐尺寸 |\n|------|---------|----------|\n| 淘宝 | 白底，无文字水印 | 800×800+ |\n| 京东 | 白底，产品占比>80% | 800×1200 |\n| 拼多多 | 白底或纯色底 | 740×740+ |\n| Amazon | 纯白底，255 白色值 | 1600×1600+ |`,
  },
  {
    id: 'seed-4', seedKey: 'seed4', date: '2026-06-20',
    title: '证件照背景色选择指南',
    category: '证件照技巧',
    excerpt: '红色、白色、蓝色背景分别用于什么场景？各国签证照片对背景有什么要求？本文汇总了常见证件照规格和背景色标准。',
    content: `## 证件照背景色完全指南\n\n不同用途的证件照对背景颜色有明确的规定。选错背景可能导致照片被拒收。\n\n### 三种标准背景色\n\n| 背景色 | 色值参考 | 适用场景 |\n|-------|---------|---------|\n| 🔴 **红色** | #D9001B | 中国身份证、结婚证、部分企业证件 |\n| ⚪ **白色** | #FFFFFF | 签证（多数国家）、护照、简历照、驾照 |\n| 🔵 **蓝色** | #438EDB | 中国护照/签证、毕业证、部分国家入境材料 |\n\n### 国内常见证件照规格\n\n- **身份证**：26mm × 32mm，白色背景\n- **护照/通行证**：33mm × 48mm，蓝色背景\n- **驾驶证**：22mm × 32mm，白色背景\n- **结婚登记照**：红色或蓝色背景，双人合影\n\n### 国际签证背景色要求\n\n| 国家/地区 | 背景色 | 尺寸 |\n|----------|-------|------|\n| 美国 | 白色 | 51×51 |\n| 申根区 | 白色/浅色 | 35×45 |\n| 英国 | 浅奶油色/浅灰 | 35×45 |\n| 日本 | 白色/浅蓝 | 35×45 |\n\nZan Pic 支持一键切换背景色（红/白/蓝），轻松适配不同需求。`,
  },
  {
    id: 'seed-5', seedKey: 'seed5', date: '2026-06-15',
    title: '图片滤镜调色入门',
    category: '后期调色',
    excerpt: '亮度、对比度、饱和度是图片调色的三要素。本文从基础概念讲起，配合 Zan Pic 的实时预览功能，帮你快速掌握调色技巧。',
    content: `## 图片滤镜调色入门教程\n\n好的调色可以让一张普通照片焕然一新。\n\n### 调色三剑客\n\n#### 1. 亮度 (Brightness)\n控制图像的整体明暗程度。提高亮度适合曝光不足的照片；降低亮度营造低沉氛围。\n\n#### 2. 对比度 (Contrast)\n控制明暗之间的差距。高对比度更有冲击力；低对比度更柔和朦胧。\n\n#### 3. 饱和度 (Saturation)\n控制颜色的鲜艳程度。设为 0 变成黑白照片。\n\n### Zan Pic 内置预设滤镜\n\n8 种预设滤镜：黑白、复古、暖色、冷色、鲜艳、褪色、锐化、模糊、反转。\n\n### 经典调色配方\n\n- **日系清新风**：亮度 +10 / 对比度 -5 / 饱和度 -10\n- **电影质感**：亮度 -8 / 对比度 +15 / 饱和度 -15\n- **社交媒体爆款**：亮度 +12 / 对比度 +8 / 饱和度 +20`,
  },
  {
    id: 'seed-6', seedKey: 'seed6', date: '2026-06-10',
    title: 'WebGPU 加速：让浏览器 AI 推理快 10 倍',
    category: '技术解析',
    excerpt: 'WebGPU 是新一代浏览器图形 API，不仅用于渲染，还能加速 AI 推理。本文介绍 Zan Pic 如何利用 WebGPU 将抠图速度提升数倍。',
    content: `## WebGPU：下一代 Web 计算平台\n\n**WebGPU** 是 WebGL 的继任者，不仅图形能力更强，还引入了**通用计算（GPGPU）** 能力。\n\n### 性能对比\n\n- WASM CPU：~5 秒\n- WebGL：~2 秒\n- **WebGPU：~0.5 秒（比 CPU 快约 10 倍）**\n\n### WebGPU 如何加速 AI 推理\n\n传统方式（WASM）：CPU 逐层串行计算，大量数据需要在 CPU/GPU 之间搬运。\n\nWebGPU 方式：整个模型运算在 GPU 上完成，数据全程驻留在 GPU 显存中，几乎零传输开销。\n\n### 浏览器支持情况\n\n- Chrome 113+ ✅\n- Edge 113+ ✅\n- Firefox ⚠️ 实验性标志\n- Safari ❌ 不支持\n\n### Zan Pic 三级降级策略\n\nWebGPU 可用 → 使用 WebGPU 后端（最快 ⚡）→ 否则检查 WebGL → 使用 WebGL 后端 → 最后使用 WASM CPU（兼容最好）。对用户完全透明。`,
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
        content: (req.body.content || "").trim() || undefined,
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
      const { id, title, date, category, excerpt, content } = req.body;
      const updated = posts.map((p) =>
        p.id === id
          ? {
              ...p,
              title: title !== undefined ? ((title || "").trim() || "未命名文章") : p.title,
              date: date || p.date,
              category: category !== undefined ? ((category || "").trim() || "未分类") : p.category,
              excerpt: excerpt !== undefined ? ((excerpt || "").trim()) : p.excerpt,
              content: content !== undefined ? ((content || "").trim() || undefined) : p.content,
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
