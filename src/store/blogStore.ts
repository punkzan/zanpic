import { create } from 'zustand'
import * as blogApi from '../lib/blogApi'

export interface BlogPost {
  id: string
  title: string // default text (Chinese or whatever admin types)
  date: string // YYYY-MM-DD
  category: string
  excerpt: string
  /** Full article body text (markdown or plain HTML supported) */
  content?: string
  /** For seed posts: i18n key prefix, e.g. "seed1" → blog.seed1.title */
  seedKey?: string
}

/** Default seed posts — shipped with the app. Content comes from i18n locale files. */
const SEED_POSTS: BlogPost[] = [
  {
    id: 'seed-1', seedKey: 'seed1', date: '2026-07-05',
    title: '如何拍出适合证件照的照片',
    category: '证件照技巧',
    excerpt: '证件照是很多人头疼的问题。本文从光线、角度、表情、着装四个方面，教你用手机拍出高质量的证件照原图，配合 Zan Pic 一键生成标准证件照。',
    content: `## 拍好证件照的四大要素

一张合格的证件照需要满足光线均匀、正面平视、表情自然、着装得体四个基本条件。下面我们逐一讲解。

### 1. 光线

选择**自然光**是最好的方案。面向窗户拍摄，让光线均匀地洒在脸上。避免侧光造成面部阴影过重，也避免顶光（如天花板灯直射）产生难看的阴影。

如果没有自然光条件：
- 使用两盏台灯分别放在左右两侧 **45° 角**
- 保持灯光高度与眼睛齐平或略高
- 避免使用闪光灯直射（会产生红眼和油光）

### 2. 角度

手机摄像头应与眼睛保持**同一水平线**。可以靠墙站立，将手机固定在视线高度。

- 手机距离：**手臂长度 + 20-30cm** 最佳
- 构图：头部和肩部占画面 **70-80%**
- 背景：纯色墙面（白墙最佳）

### 3. 表情

证件照不需要微笑（大多数官方要求中性表情），但要做到：

- **双眼睁开**，目视镜头
- **嘴巴自然闭合**，不露齿
- **眉毛放松**，不要挑眉或皱眉
- 头部**端正**，不歪头

### 4. 着装

根据证件类型选择合适的服装：

| 证件类型 | 推荐着装 |
|---------|---------|
| 身份证 | 深色上衣（避免白色，会与背景融合）|
| 护照 | 有领衬衫或正式服装 |
| 签证照 | 按目标国要求，通常为正装 |
| 驾驶证 | 日常整洁服装即可 |

### 后期处理

拍好后，使用 Zan Pic 的**证件照功能**即可一键完成：
1. 上传你拍摄的原始照片
2. AI 自动抠图移除原背景
3. 选择需要的背景颜色（红/白/蓝）
4. 自动裁剪到标准尺寸（1寸/2寸等）

整个过程不超过 10 秒，效果媲美照相馆专业出品。`,
  },
  {
    id: 'seed-2', seedKey: 'seed2', date: '2026-07-03',
    title: 'AI 抠图技术原理：IS-Net 模型详解',
    category: '技术解析',
    excerpt: 'Zan Pic 的 AI 抠图功能基于 IS-Net（Iterative Spatial Refinement Network）模型。本文深入浅出地讲解模型架构、ONNX 推理流程和 WebGPU 加速原理。',
    content: `## IS-Net：迭代空间精炼网络

Zan Pic 的 AI 抠图功能采用的是 **IS-Net（Iterative Spatial Refinement Network）**，这是一种专为图像前景分割设计的深度学习模型。

### 为什么选 IS-Net？

传统的前景分割方法（如 GrabCut、DeepLab）在处理以下场景时表现不佳：

- **发丝级边缘** — 细碎的头发边缘难以精确分离
- **半透明物体** — 如烟雾、薄纱、玻璃
- **复杂背景** — 背景色与前景色接近时容易混淆

IS-Net 通过**迭代精炼机制**逐层细化分割边界，在这些场景下显著优于其他模型。

### 模型架构

IS-Net 由三个核心模块组成：

\`\`\`
输入图像 (RGB)
    │
    ▼
┌─────────────┐
│  特征提取器   │  ← 预训练 CNN（ResNet/MobileNet 变体）
│  (Backbone)  │     提取多尺度特征
└──────┬──────┘
       │ 多尺度特征图
       ▼
┌─────────────┐
│  空间精炼器   │  ← IS-Net 核心：多次迭代优化
│  (Refiner)   │     每次迭代聚焦于不确定区域
└──────┬──────┘
       │ 精细化的 alpha mask
       ▼
┌─────────────┐
│  输出头      │  → 前景蒙版 (alpha matte)
│  Output Head │    取值范围 [0, 1]
└─────────────┘
\`\`\`

### ONNX Runtime：浏览器中的推理引擎

模型文件以 **ONNX（Open Neural Network Exchange）** 格式存储，这是业界标准的模型交换格式。在浏览器中，我们通过 **ONNX Runtime Web** 执行推理：

\`\`\`mermaid
graph LR
    A[ONNX 模型文件 .onnx] --> B[ONNX Runtime Web]
    B --> C{运行后端}
    C -->|WebGPU 可用| D[WGPU 后端 - 快 5~10x]
    C -->|仅 WebGL| E[WebGL 后端]
    C -->|CPU 回退| F[WASM CPU 后端]
    D & E & F G--> G[输出 Alpha Mask]
\`\`\`

### WebGPU 加速

当用户的浏览器支持 WebGPU 时（Chrome 113+、Edge 113+），推理速度可提升 **5-10 倍**：

| 后端 | 典型耗时 (1024×1024 图像) |
|------|------------------------|
| WASM CPU | 3-8 秒 |
| WebGL | 1-3 秒 |
| **WebGPU** | **0.3-0.8 秒** |

这就是为什么 Zan Pic 在支持的浏览器上能实现"秒级抠图"体验的原因。`,
  },
  {
    id: 'seed-3', seedKey: 'seed3', date: '2026-06-28',
    title: '电商商品图背景移除最佳实践',
    category: '实用教程',
    excerpt: '商品图背景移除是电商运营的高频需求。本文介绍如何用涂抹抠图功能处理复杂边缘（如毛绒玩具、透明材质），以及如何批量处理商品图。',
    content: `## 电商商品图背景移除完全指南

对于电商平台卖家来说，一张干净的商品主图直接影响点击率和转化率。本文详细介绍如何用 Zan Pic 高效处理各类商品图片。

### 常见商品类型的处理策略

#### 1. 服饰类（最容易）

服装照片通常背景对比明显，AI 智能抠图一次成功率高：

- **建议**：直接使用「智能抠图」按钮
- **注意**：确保衣服没有透明/半透明的薄纱部分
- **后期**：换白底或浅灰底，符合平台要求

#### 2. 毛绒玩具（中等难度）

毛绒玩具的毛发边缘是 AI 抠图的挑战点：

- **智能抠图**作为第一轮，处理主体轮廓
- **涂抹抠图**精细调整：
  - 🟢 绿色笔刷涂抹需要**保留**的发丝区域
  - 🔴 红色笔刷涂抹需要**删除**的多余背景
- **技巧**：放大到 200%+ 进行精细涂抹

#### 3. 透明/半透明材质（高难度）

玻璃制品、塑料包装、透明材质需要特殊处理：

- 先用智能抠图获得初始结果
- 如果边缘有锯齿，使用涂抹抠图的绿色笔刷在边缘微调
- 对于完全透明的区域，可能需要手动辅助

#### 4. 首饰珠宝类

金属反光和宝石透明度增加了难度：

- 尽量使用**纯色深色背景**拍摄原始照片
- 智能抠图 + 涂抹抠图组合使用
- 细小处（戒指内圈、项链链节）需放大涂抹

### 批量处理工作流

如果你有大量商品图需要处理：

\`\`\`
1. 准备所有原始图片（建议统一尺寸和背景）
2. 逐一打开每张图片
3. 点击「智能抠图」
4. 如有瑕疵，用「涂抹抠图」修正
5. 导出 PNG（保留透明通道）
6. 如需白底：在导出设置中选择背景色
\`\`\`

### 平台规格参考

| 平台 | 主图要求 | 推荐尺寸 |
|------|---------|---------|
| 淘宝 | 白底，无文字水印 | 800×800+ |
| 京东 | 白底，产品占比>80% | 800×1200 |
| 拼多多 | 白底或纯色底 | 740×740+ |
| Amazon | 纯白底，255 白色值 | 1600×1600+ |

处理完成后，记得检查图片是否符合各平台的详细规范。`,
  },
  {
    id: 'seed-4', seedKey: 'seed4', date: '2026-06-20',
    title: '证件照背景色选择指南',
    category: '证件照技巧',
    excerpt: '红色、白色、蓝色背景分别用于什么场景？各国签证照片对背景有什么要求？本文汇总了常见证件照规格和背景色标准。',
    content: `## 证件照背景色完全指南

不同用途的证件照对背景颜色有明确的规定。选错背景可能导致照片被拒收。本文汇总了最常见的背景色标准。

### 三种标准背景色

| 背景色 | 色值参考 | 适用场景 |
|-------|---------|---------|
| 🔴 **红色** | #D9001B / RGB(217,0,27) | 中国身份证、结婚证、部分企业证件 |
| ⚪ **白色** | #FFFFFF / RGB(255,255,255) | 签证（多数国家）、护照、简历照、驾照 |
| 🔵 **蓝色** | #438EDB / RGB(67,142,219) | 中国护照/签证、毕业证、部分国家入境材料 |

### 国内常见证件照规格

#### 身份证
- 尺寸：26mm × 32mm
- 背景：**白色**
- 要求：免冠正面照，头部占照片 2/3

#### 护照/通行证
- 尺寸：33mm × 48mm
- 背景：**蓝色**
- 要求：正面免冠，表情自然

#### 驾驶证
- 尺寸：22mm × 32mm
- 背景：**白色**
- 各省略有差异，以当地车管所要求为准

#### 结婚登记照
- 尺寸：53mm × 35mm 或 40mm × 60mm（横版）
- 背景：**红色**或**蓝色**
- 双人合影，需穿正装

### 国际签证背景色要求

不同国家对签证照片背景的要求差异较大：

| 国家/地区 | 背景色 | 尺寸 (mm) | 特殊要求 |
|----------|-------|----------|---------|
| 美国 | 白色 | 51×51 | 近 6 个月内拍摄 |
| 申根区 | 白色/浅色 | 35×45 | 不戴眼镜（镜片不能反光）|
| 英国 | 浅奶油色/浅灰 | 35×45 | — |
| 日本 | 白色/浅蓝 | 35×45 | 露耳朵 |
| 韩国 | 白色 | 35×45 | — |
| 澳大利亚 | 白色 | 35×45 | 不能露齿笑 |
| 加拿大 | 白色/浅色 | 51×51 | 表情中性 |

> 💡 **提示**：各国使馆要求可能随时变化，申请前务必查看最新官方说明。Zan Pic 支持一键切换背景色，轻松适配不同需求。

### Zan Pic 操作步骤

1. 上传原始照片
2. 选择「证件照」模式
3. AI 自动抠图 + 人脸检测定位
4. 在右侧面板选择背景色：**红色 / 白色 / 蓝色**
5. 选择输出规格：**1寸 / 2寸 / 小2寸 / 自定义**
6. 点击「导出」，自动生成符合要求的证件照`,
  },
  {
    id: 'seed-5', seedKey: 'seed5', date: '2026-06-15',
    title: '图片滤镜调色入门',
    category: '后期调色',
    excerpt: '亮度、对比度、饱和度是图片调色的三要素。本文从基础概念讲起，配合 Zan Pic 的实时预览功能，帮你快速掌握调色技巧。',
    content: `## 图片滤镜调色入门教程

好的调色可以让一张普通照片焕然一新。本文从基础概念出发，教你用 Zan Pic 实现专业的调色效果。

### 调色三剑客

#### 1. 亮度 (Brightness)

亮度控制图像的整体明暗程度。

- **提高亮度**：让暗部变亮，适合曝光不足的照片
- **降低亮度**：压暗整体，营造低沉氛围
- **⚠️ 注意**：过度提亮会导致高光溢出（变纯白），丢失细节

**适用场景**：夜景提亮、逆光补偿、阴天照片

#### 2. 对比度 (Contrast)

对比度控制明暗之间的差距。

- **提高对比度**：亮的更亮、暗的更暗，画面更有冲击力
- **降低对比度**：画面更柔和、朦胧，适合柔美风格
- **⚠️ 注意**：过高对比度会丢失中间色调细节

**适用场景**：风景照增强、人像立体感、胶片风格

#### 3. 饱和度 (Saturation)

饱和度控制颜色的鲜艳程度。

- **提高饱和度**：颜色更浓郁、生动
- **降低饱和度**：颜色趋向灰色（去色效果）
- **设为 0**：变成黑白照片

**适用场景**：美食摄影、旅行风光、复古怀旧风

### Zan Pic 内置预设滤镜

除了手动调节三要素，Zan Pic 还提供 **8 种预设滤镜**：

| 滤镜 | 效果 | 适用场景 |
|------|------|---------|
| 黑白 | 完全去色 | 纪实、人像、建筑 |
| 复古 | 暖黄偏色 | 怀旧、老照片风格 |
| 暖色 | 整体偏暖 | 日落、室内温馨 |
| 冷色 | 整体偏冷 | 科技、清新、海洋 |
| 鲜艳 | 高饱和+高对比 | 美食、花卉、广告 |
| 褪色 | 低饱和+低对比 | 文艺、情绪片 |
| 锐化 | 增强边缘清晰度 | 产品、风景细节 |
| 模糊 | 高斯模糊效果 | 背景虚化、艺术效果 |
| 反转 | 颜色反转 | 艺术、创意 |

### 经典调色配方

#### 配方一：日系清新风
\`\`\`
亮度: +10
对比度: -5
饱和度: -10
滤镜: 冷色（轻度）
\`\`\`

#### 配方二：电影质感
\`\`\`
亮度: -8
对比度: +15
饱和度: -15
滤镜: 复古
\`\`\`

#### 配方三：社交媒体爆款
\`\`\`
亮度: +12
对比度: +8
饱和度: +20
滤镜: 鲜艳
\`\`\`

### 操作技巧

1. **先调亮度，再调对比度，最后调饱和度** — 这个顺序不容易翻车
2. **使用实时预览** — Zan Pic 所有调节都是即时反馈，方便反复尝试
3. **适度原则** — 宁可少调也不要过头，轻微调整往往最自然
4. **保存参数** — 调到满意的效果后记住数值，以后同类照片可直接套用`,
  },
  {
    id: 'seed-6', seedKey: 'seed6', date: '2026-06-10',
    title: 'WebGPU 加速：让浏览器 AI 推理快 10 倍',
    category: '技术解析',
    excerpt: 'WebGPU 是新一代浏览器图形 API，不仅用于渲染，还能加速 AI 推理。本文介绍 Zan Pic 如何利用 WebGPU 将抠图速度提升数倍。',
    content: `## WebGPU：下一代 Web 计算平台

你可能听说过 WebGL——它让浏览器能进行 3D 图形渲染。而 **WebGPU** 是 WebGL 的继任者，不仅图形能力更强，还引入了**通用计算（GPGPU）** 能力，这意味着可以直接利用 GPU 运行 AI 模型。

### WebGPU vs WebGL vs WASM CPU

\`\`\`
性能对比（以 1024×1024 图片 IS-Net 推理为例）

WASM (CPU)  ████████████████████  ~5 秒
WebGL       ██████████            ~2 秒
WebGPU      ██                     ~0.5 秒
\`\`\`

**WebGPU 比 CPU 快约 10 倍，比 WebGL 快约 4 倍。**

为什么差距这么大？核心原因在于架构差异：

| 特性 | WASM CPU | WebGL | WebGPU |
|------|----------|-------|--------|
| 执行方式 | 单线程 CPU | GPU 片段着色器 | GPU Compute Shader |
| 内存模型 | 严格顺序 | 受限随机写入 | 完整通用计算 |
| 数据传输 | CPU↔GPU 每次同步 | 纹理绑定 | GPU Buffer 直接映射 |
| 并行度 | 低 | 中 | 极高 |

### WebGPU 如何加速 AI 推理

传统方式（WASM）：
\`\`\`
CPU 逐层执行神经网络运算
→ 每次矩阵乘法都在 CPU 上串行计算
→ 大量数据需要在 CPU/GPU 之间搬运
→ 瓶颈：内存带宽 + 单线程限制
\`\`\`

WebGPU 方式：
\`\`\`
整个模型运算在 GPU 上完成
→ Compute Shader 并行处理数千个神经元
→ 数据全程驻留在 GPU 显存中
→ 几乎零数据传输开销
\`\`\`

### 浏览器支持情况

截至 2026 年 7 月：

| 浏览器 | 版本 | WebGPU 支持 |
|-------|------|-------------|
| Chrome | 113+ | ✅ 默认启用 |
| Edge | 113+ | ✅ 默认启用 |
| Firefox | 待定 | ⚠️ 实验性标志 |
| Safari | 待定 | ❌ 不支持 |
| 360 浏览器 | 基于 Chromium 113+ | ✅ 通常支持 |

### Zan Pic 中的自动降级

Zan Pic 的 AI 抠图功能实现了**三级降级策略**：

\`\`\`
用户打开 ZanPic
    │
    ▼
检测浏览器是否支持 WebGPU？
    ├─ YES → 使用 WebGPU 后端（最快 ⚡）
    │
    └─ NO → 检测是否支持 WebGL？
              ├─ YES → 使用 WebGL 后端（较快）
              └─ NO → 使用 WASM CPU（兼容最好）
\`\`\`

这个过程对用户**完全透明**——无需任何配置，系统自动选择最优后端。你唯一能感知的就是：在现代浏览器里，AI 抠图真的很快。

### 如何开启 WebGPU（如果未默认启用）

1. 地址栏输入 \`chrome://flags\`
2. 搜索 "WebGPU"
3. 确保 "WebGPU" 标志设置为 Enabled
4. 重启浏览器`,
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
      if (apiPosts.length > 0) {
        // Always trust the server response — whether from KV or DEFAULT_POSTS fallback.
        // This guarantees ALL visitors see the same baseline articles.
        set({ posts: apiPosts, usingApi: !fallback, loading: false })
        persist(apiPosts)
      } else {
        set({ usingApi: false, loading: false })
      }
    } catch (err) {
      // API unreachable (local dev or network error) — keep localStorage data
      console.warn(DIAG_PREFIX, 'syncFromApi: fetch failed, using localStorage', err)
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

      // Always attempt API call if admin password is available.
      // Fallback: post stays in localStorage if API is unreachable.
      const pwd = sessionStorage.getItem('zanpic_admin_pwd')
      if (pwd) {
        blogApi.createPost(post).then((res) => {
          // Replace the temporary id with the server-assigned one
          set({ posts: res.posts, usingApi: true })
          persist(res.posts)
        }).catch((err) => {
          console.error(DIAG_PREFIX, 'addPost API failed:', err.message)
          set({ error: 'Failed to sync with server. Saved locally.' })
        })
      }

      return { posts: updated, error: '' }
    }),

  updatePost: (id, patch) =>
    set((s) => {
      const updated = s.posts.map((p) => (p.id === id ? { ...p, ...patch } : p))
      persist(updated)

      const pwd = sessionStorage.getItem('zanpic_admin_pwd')
      if (pwd) {
        blogApi.updatePost(id, patch).catch((err) => {
          console.error(DIAG_PREFIX, 'updatePost API failed:', err.message)
          set({ error: 'Failed to sync with server. Saved locally.' })
        })
      }

      return { posts: updated, error: '' }
    }),

  deletePost: (id: string) =>
    set((s) => {
      const updated = s.posts.filter((p) => p.id !== id)
      persist(updated)

      const pwd = sessionStorage.getItem('zanpic_admin_pwd')
      if (pwd) {
        blogApi.removePost(id).catch((err) => {
          console.error(DIAG_PREFIX, 'deletePost API failed:', err.message)
          set({ error: 'Failed to sync with server. Saved locally.' })
        })
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
  field: 'title' | 'category' | 'excerpt' | 'content',
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
  return post[field] || ''
}
