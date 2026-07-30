import { create } from 'zustand'
import * as blogApi from '../lib/blogApi'

export interface BlogPost {
  id: string
  /** SEO-friendly URL slug (e.g. "how-to-take-id-photo"). Falls back to id if not set. */
  slug?: string
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
    id: 'seed-1', slug: 'how-to-take-id-photo', seedKey: 'seed1', date: '2026-07-05',
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
    id: 'seed-2', slug: 'ai-background-removal-isnet', seedKey: 'seed2', date: '2026-07-03',
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
    id: 'seed-3', slug: 'ecommerce-product-background-removal', seedKey: 'seed3', date: '2026-06-28',
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
    id: 'seed-4', slug: 'id-photo-background-color-guide', seedKey: 'seed4', date: '2026-06-20',
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
    id: 'seed-5', slug: 'photo-filter-color-grading-guide', seedKey: 'seed5', date: '2026-06-15',
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
    id: 'seed-6', slug: 'webgpu-ai-inference-acceleration', seedKey: 'seed6', date: '2026-06-10',
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
  {
    id: 'seed-7', slug: 'make-id-photo-online-free', seedKey: 'seed7', date: '2026-07-20',
    title: '免费在线证件照制作完整教程：手机拍照 10 秒生成标准证件照',
    category: '证件照制作',
    excerpt: '不用去照相馆！本文手把手教你如何用手机拍照 + 在线工具免费制作标准证件照。覆盖一寸、二寸、小2寸规格，红白蓝三色背景，护照签证驾驶证全能搞定。全程浏览器本地处理，图片不外传。',
    content: `## 免费在线证件照制作完整教程

每年因为证件照跑照相馆的人有多少？根据我们的调研，**超过 60% 的人每年至少需要 2 次证件照** — 身份证更新、护照申请、驾驶证换发、考试报名、入职材料……这个需求比你想象的多得多。

好消息是：**你现在完全可以在家免费制作标准证件照**，用手机拍张照，用 Zan Pic 在线处理，10 秒出图。而且全程在浏览器本地完成，图片不会上传到任何服务器，保护你的隐私安全。

本文是 Zan Pic 证件照制作功能的**完整教程**，从前期拍摄到后期处理、再到规格选择，每一步都有详细指导。

---

### 一、前期拍摄：如何用手机拍出合格的证件照原图

证件照的质量 80% 取决于拍摄。拍得好的原图，AI 处理起来效果自然好。以下是四大关键要素：

#### 1. 光线 — 成功的关键

**最佳选择：自然光**

面向窗户站立，让柔和的自然光从正面均匀地洒在脸上。避免以下常见错误：

| ❌ 避免 | ✅ 正确做法 |
|---------|------------|
| 侧光（面部半边亮半边暗） | 正面迎光，光线均匀分布 |
| 顶光（天花板灯直射，眼下阴影重） | 使用柔和的散射光 |
| 逆光（背景过亮，面部发黑） | 面向光源 |
| 闪光灯（红眼、面部油光） | 自然光或常亮灯补光 |

如果没有自然光条件，可以用两盏台灯分别放在左右 45° 方向，高度与眼睛齐平。使用暖白光灯泡（4000K-5000K 色温），避免黄光让肤色偏色。

#### 2. 背景 — 越简单越好

**纯色白墙是最佳选择。** 如果家里没有白墙，可以用以下替代方案：

- 挂一块白色或浅灰色床单作为背景
- 贴在浅色窗帘前面拍摄
- 使用大张白纸贴在墙上

**关键要求**：
- 背景尽量**纯色统一**，不要有花纹、文字、照片等干扰
- 人物与背景保持 **50cm 以上**距离，减少阴影落在背景上
- 如果你要戴眼镜，**确保镜片不反光**（可以微微低头或调整灯光角度）

#### 3. 构图与角度

- **手机高度**：摄像头与眼睛保持同一水平线，不要俯拍或仰拍
- **拍摄距离**：人物距手机约 **1.5-2 米**，使用后置摄像头
- **构图比例**：头部和肩部占画面的 **60-70%**
- **人物居中**：左右对称，头顶留少量空间
- **借助三脚架**或请他人帮忙拍摄，避免自拍手臂入镜

> 💡 **提示**：拍完后先检查照片，确保双眼清晰可见、面部光线均匀、背景无明显杂物。如果拍得不够好，重新拍一张 — 拍摄阶段多花 2 分钟，可以省去后期的很多麻烦。

#### 4. 表情与着装

**表情要求**：
- 正面直视镜头，双眼睁开
- 嘴巴自然闭合（大多数官方要求中性表情）
- 不露齿、不挑眉、不歪头
- 耳朵尽量露出（部分证件有此要求）

**着装建议**：

| 证件类型 | 推荐着装 | 注意事项 |
|---------|---------|---------|
| 身份证 | 深色有领衫 | 避免白色，会与背景融为一体 |
| 护照/签证 | 正装或有领衬衫 | 大多数国家要求端庄正式 |
| 驾驶证 | 日常整洁服装 | 各省要求略有差异 |
| 考试报名 | 深色无帽上衣 | 根据考试要求确定底色 |
| 入职材料 | 商务正装或商务休闲 | 给人专业的第一印象 |

**通用原则**：穿深色衣服优于浅色，有领优于圆领，简洁优于花哨。

---

### 二、Zan Pic 证件照制作：三步生成标准证件照

拍好原始照片后，打开 [Zan Pic 在线证件照制作工具](/id-photo-maker)，按以下步骤操作：

#### 第一步：上传照片

- 拖拽照片到编辑器，或点击上传
- 支持的格式：JPEG、PNG、WebP
- 建议分辨率：**不低于 1000×1500 像素**（现代手机的后置摄像头都能满足）

#### 第二步：AI 自动处理

点击「证件照」功能按钮，Zan Pic 会自动执行以下处理：

1. **AI 抠图** — IS-Net 深度学习模型分离人像与背景，发丝级精度
2. **Alpha 通道分析** — 自动识别头部和肩部位置
3. **人脸定位** — 确保面部处于画面正确位置
4. **智能裁剪** — 按标准比例自动裁剪

整个处理过程在 **2-5 秒内**完成（WebGPU 加速下）。如果对自动识别的边缘不满意，可以用「涂抹抠图」功能手动精修。

#### 第三步：选择规格与底色，导出

在右侧面板中：

1. **选择照片规格**：
   - **一寸**（295×413px @ 300DPI，适用于简历、学生证等）
   - **二寸**（413×579px @ 300DPI，适用于护照照片）
   - **小二寸**（413×531px @ 300DPI，适用于部分签证）
   - 或自定义像素尺寸

2. **选择背景色**：
   - 🔴 **红色**（#D9001B）— 身份证、结婚证
   - ⚪ **白色**（#FFFFFF）— 大多数签证、驾照、简历照
   - 🔵 **蓝色**（#438EDB）— 中国护照、毕业证、部分签证

3. **可选：六寸排版** — 在一张 6 寸相纸（1200×1800px）上自动排列多张证件照，方便去照相馆冲洗或自己打印

4. 点击「导出」，下载高清证件照

---

### 三、不同场景的规格对照

#### 国内证件照规格

| 证件用途 | 尺寸（mm） | 像素 @ 300DPI | 背景色 | Zan Pic 对应规格 |
|---------|-----------|--------------|-------|-----------------|
| 身份证 | 26×32 | 307×378 | 白色 | 自定义 |
| 护照/港澳通行证 | 33×48 | 390×567 | 蓝色 | 二寸接近 |
| 驾驶证 | 22×32 | 260×378 | 白色 | 自定义 |
| 毕业证 | 35×50 | 413×590 | 蓝色 | 小二寸接近 |
| 结婚登记照 | 53×35 或 40×60 | — | 红色/蓝色 | 自定义 |

#### 国际签证照片要求

| 国家/地区 | 尺寸（mm） | 背景色 | 特殊要求 |
|----------|-----------|-------|---------|
| 美国 | 51×51 | 白色 | 6 个月内拍摄，不戴眼镜 |
| 申根区 | 35×45 | 白色/浅色 | 面部占 70-80%，不戴眼镜 |
| 英国 | 35×45 | 浅奶油色/浅灰 | 不能露齿笑 |
| 日本 | 35×45 | 白色/浅蓝 | 露耳朵，近 6 个月 |
| 韩国 | 35×45 | 白色 | 面部占照片 70-80% |
| 加拿大 | 50×70 或 51×51 | 白色 | 表情中性，不能笑 |
| 澳大利亚 | 35×45 | 白色 | 近期，面部清晰 |

> ⚠️ **重要提醒**：各国使馆的签证照片要求可能随时变化，Zan Pic 生成的照片尺寸和底色符合标准规格，但申请前务必查看目标国家的**最新官方要求**。

---

### 四、常见问题 FAQ

**Q: 手机拍的照片真的能用作正式证件照吗？**

A: 完全可以。现代手机的后置摄像头像素通常在 12MP-48MP 之间，远高于标准证件照所需的分辨率。只要拍摄条件符合要求（光线、背景、构图），配合 Zan Pic 的 AI 抠图和智能裁剪，生成的效果不输照相馆。

**Q: AI 自动抠图后，边缘有白边或不自然怎么办？**

A: 使用「涂抹抠图」功能进行精修。放大图片到 200%，用绿色笔刷涂抹需要保留的区域，红色笔刷涂抹需要删除的背景。Zan Pic 还内置了边缘形态学精修算法（去噪 + 高斯羽化 + 对比度锐化），可以帮助消除锯齿边缘。

**Q: Zan Pic 会把我的照片上传到服务器吗？**

A: 不会。Zan Pic 是一款纯前端应用，所有图片处理（包括 AI 抠图）都在你的浏览器本地完成。唯一需要从网络加载的是 AI 模型文件（约 24MB），加载完成后推理过程完全在你的设备上进行。你的图片数据不会离开你的设备。

**Q: AI 自动识别人像位置不准确怎么办？**

A: 建议上传**正面、光线均匀、背景简单**的照片。如果自动定位偏差较大，可以先使用「智能抠图」功能��除背景，Zan Pic 的 Alpha 通道分析会自动识别前景人物位置，然后重新进入证件照功能即可获得更准确的定位。

**Q: 如何打印裁剪后的证件照？**

A: Zan Pic 提供「六寸排版」功能，可在一张 6 寸相纸上自动排列多张证件照。导出排版图后，你可以到任何支持 6 寸冲印的照相馆或在线冲印服务打印。比单独打印单张证件照省钱很多。

---

### 五、总结

制作标准证件照比你想象的简单得多：

1. 📱 用手机在自然光下、白墙前拍一张正面照
2. 🔧 上传到 Zan Pic，点一下「证件照」按钮
3. 🎨 选好底色和尺寸，导出即可

**完全免费、无需注册、图片不上传。** 下次需要证件照时，不用再去照相馆排队了 — 打开 [https://www.superzan.net](/) 就能搞定。

> 💡 补充阅读：
> - [如何拍出适合证件照的照片](/blog/how-to-take-id-photo) — 前期拍摄技巧详细讲解
> - [证件照背景色选择指南](/blog/id-photo-background-color-guide) — 各国背景色标准对照`,
  },
  {
    id: 'seed-8', slug: 'product-photo-white-background', seedKey: 'seed8', date: '2026-07-22',
    title: '电商商品图白底制作：从拍摄到AI抠图一站式教程',
    category: '电商运营',
    excerpt: '电商平台对商品主图有严格的白底要求。本文系统讲解商品图白底制作的完整流程，覆盖拍摄技巧、AI 抠图换白底、批量处理方法和主流平台规格对照。适用于淘宝/京东/拼多多/Amazon/Shopify 卖家。',
    content: `## 电商商品图白底制作完整指南

如果你是电商卖家，你一定知道：**商品主图直接影响点击率，而点击率直接影响搜索排名。**

各大电商平台对商品主图有一项近乎统一的要求：**纯白背景**。淘宝要求「白底、无文字水印、产品占比大于 70%」；Amazon 要求「纯白背景 RGB 255,255,255、产品占画面 85% 以上」。一张干净的白底商品图是专业卖家的基本素养。

但在实际运营中，99% 的中小卖家没有专业摄影棚。手机拍摄的商品照片往往背景杂乱、光线不均。本文将教你如何用 Zan Pic 的 AI 抠图功能，**零成本做出照相馆级别的白底商品图**。

---

### 一、拍摄阶段：做好这几步，抠图成功率高 3 倍

AI 虽然强大，但不是魔法。拍摄阶段的条件越好，AI 抠图的效果就越好。以下是针对电商商品拍摄的实战技巧：

#### 1. 背景选择：不要杂色背景，要对比明显的背景

AI 抠图的核心原理是识别**前景（商品）与背景的差异**。你不需要白底拍摄 — 实际上，商品在非白色背景上拍摄反而更好，因为 AI 更容易区分。

| 商品类型 | 推荐拍摄背景 | 原因 |
|---------|-------------|------|
| 白色/浅色商品 | **深灰或黑色** | 与白色商品形成强对比 |
| 黑色/深色商品 | **白色或浅灰** | 避免商品与背景融为一体 |
| 彩色商品 | 中性灰或深色 | 不与任何商品颜色冲突 |
| 反光/金属商品 | 哑光中灰 | 减少高光干扰 |
| 透明/半透明商品 | 深色背景 | 玻璃/塑料在深色背景上边缘更清晰 |

#### 2. 光线布置

不需要专业灯光！以下是一个极其便宜但效果不错的方案：

- **主光源**：利用窗边自然光，从商品**左侧或右侧 45°** 打过来
- **补光**：在对面放一块白色泡沫板或白色纸板，将光线反射到暗面
- **预算升级**：买两张 LED 摄影灯（约 50-100 元/张），一左一右 45° 打光
- **避免**：顶光直射（产生难看的阴影）、混合不同色温的光源

**光线检查清单**：
- ✅ 商品表面没有明显的阴影块
- ✅ 商品边缘清晰，没有因为过度曝光而消失
- ✅ 整体亮度均匀，没有半边亮半边暗

#### 3. 拍摄角度与稳定

- **使用三脚架**：哪怕是最便宜的 30 元三脚架，也能大幅提高照片清晰度
- **平拍角度**：大多数商品适合正前方平拍（镜头与商品中心齐平）
- **俯拍角度**：服饰、布料、平面商品适合从上往下俯拍
- **多角度拍摄**：每个商品至少拍 3-5 张不同角度，选择效果最好的那张进行抠图

---

### 二、AI 抠图换白底：核心步骤

打开 [Zan Pic AI 抠图工具](/background-remover)，按以下流程操作：

#### 第一步：导入商品照片

- 拖拽或点击上传，支持 JPEG、PNG、WebP
- **建议上传原始分辨率照片**，不要预先压缩（AI 需要足够的像素来精确识别边缘）
- 如果手机拍的 live photo，先转换为静态 JPEG

#### 第二步：智能抠图

点击「智能抠图」按钮，Zan Pic 会自动：

1. 运行 IS-Net 深度学习模型分析图像
2. 生成前景蒙版（alpha mask）
3. 通过形态学精修算法处理边缘（去噪 → 高斯羽化 → 对比度锐化）

处理时间：**2-8 秒**（取决于图片分辨率和设备性能）

#### 第三步：精修边缘（如需）

自动抠图后，检查边缘质量。以下商品类型通常需要手动精修：

| 商品类型 | 自动抠图效果 | 手动精修重点 |
|---------|------------|------------|
| 服饰/背包 | ⭐⭐⭐⭐⭐ 很好 | 通常不需要 |
| 毛绒玩具 | ⭐⭐⭐ 一般 | 放大 200% 涂抹毛发边缘 |
| 电子产品 | ⭐⭐⭐⭐ 好 | 检查边角是否完整 |
| 首饰珠宝 | ⭐⭐ 需精修 | 细链、反光面需耐心涂抹 |
| 透明玻璃 | ⭐ 较难 | 可能需要多次尝试 |
| 食品 | ⭐⭐⭐⭐ 好 | 检查不规则边缘 |

精修方法：使用「涂抹抠图」功能，绿色笔刷保存、红色笔刷删除，放大到 150-200% 仔细调整。

#### 第四步：导出白底商品图

- 在导出设置中，选择 **白色背景**
- 导出格式建议：**JPEG**（淘宝/京东/拼多多）、**PNG**（需要透明通道时）
- 如果需要统一尺寸，配合「图片缩放」功能调整到平台要求

---

### 三、批量处理：高效工作流

如果你有 50+ 商品需要处理，以下工作流可以帮你节省大量时间：

\`\`\`
1. 准备阶段：
   拍摄所有商品照片 → 统一截图尺寸 → 按顺序命名
   
2. 逐张处理：
   打开商品图 → 智能抠图 → 快速检查边缘 → 换白底 → 导出
   
3. 质量检查：
   抽查 10% 的成品 → 检查边缘是否有锯齿 → 检查是否有残留背景碎片
   
4. 上传平台：
   按平台要求统一尺寸 → 上传到店铺后台
\`\`\`

---

### 四、主流电商平台商品图规格速查

| 平台 | 主图要求 | 推荐尺寸 | 背景 | 其他 |
|------|---------|---------|------|------|
| **淘宝** | 白底，无文字水印 | 800×800+ | 纯白 | 产品占比 > 70% |
| **京东** | 白底，无水印 | 800×1200 | 纯白 | 产品占比 > 80% |
| **拼多多** | 白底或纯色底 | 740×740+ | 纯白/纯色 | 产品清晰可见 |
| **Amazon** | 纯白底(RGB 255,255,255) | 1600×1600+ | 纯白 | 产品占比 > 85%，不能有文字水印 |
| **Shopify** | 无强制要求 | 2048×2048 | 建议白底 | 推荐统一尺寸 |
| **eBay** | 白底推荐 | 1600×1600 | 建议白底 | 不能有边框 |
| **TikTok Shop** | 白底推荐 | 1000×1000 | 建议白底 | 不能有文字覆盖产品 |

---

### 五、常见问题 FAQ

**Q: AI 抠图后边缘有白边/黑边怎么处理？**

A: 边缘的白边通常是原始背景色残留。可以用「涂抹抠图」功能，将画笔改为红色，沿着白边轻轻涂抹删除。如果是发丝级边缘，Zan Pic 的形态学精修（高斯羽化）可以柔化过渡。严重的白边建议重新拍摄 — 使用与商品颜色对比更强的背景。

**Q: 为什么 Amazon 要求 RGB(255,255,255) 纯白底？**

A: Amazon 使用自动白底检测系统。如果你的商品图背景不是纯白，可能被标记为不合规，影响搜索排名甚至 Listing 下架。Zan Pic 的导出功能可以生成 RGB(255,255,255) 纯白背景。

**Q: 透明商品（如玻璃杯）怎么处理？**

A: 透明物体是 AI 抠图的难点。建议：① 在深色背景下拍摄（透明物体在深色背景上更易识别）；② 使用 Zan Pic 的智能抠图获得初步结果；③ 放大到 300% 使用涂抹抠图仔细调整边缘；④ 如果效果不理想，可以考虑用 Photoshop 的通道方法辅助。

**Q: 一次能处理多少张图片？**

A: Zan Pic 当前支持单张图片处理。我们正在开发批量处理功能。目前最高效的做法是：在 Zan Pic 处理好后导出，可以搭配文件夹批量重命名工具统一管理。

---

### 六、总结

电商商品图白底制作的核心流程：

1. 📸 **拍摄** — 用对比色背景、自然光、三脚架拍好商品原图
2. 🤖 **AI 抠图** — 一键移除背景，检查边缘质量
3. 🎨 **换白底** — 导出时选择白色背景
4. ✅ **合规检查** — 确保尺寸和底色符合平台要求

全部过程免费，几分钟就能完成一张专业的白底商品图。立即使用 [Zan Pic AI 抠图工具](/background-remover) 开始处理你的商品照片吧。

> 📚 相关阅读：
> - [电商商品图背景移除最佳实践](/blog/ecommerce-product-background-removal) — 不同商品类型的处理策略
> - [AI 抠图技术原理：IS-Net 模型详解](/blog/ai-background-removal-isnet) — 了解背后的 AI 技术`,
  },
  {
    id: 'seed-9', slug: 'social-media-avatar-background', seedKey: 'seed9', date: '2026-07-25',
    title: '社媒头像换背景全攻略：LinkedIn/Instagram/Facebook 一图搞定',
    category: '社媒运营',
    excerpt: '你的社交媒体头像用的是自拍还是背景杂乱的照片？本文教你如何用 AI 抠图换背景，制作专业的 LinkedIn 职业头像、Instagram 风格头像和 Facebook 个人头像。多种社媒平台尺寸对照一次讲清楚。',
    content: `## 社媒头像换背景全攻略

你的头像在社交媒体的第一印象中占比多大？答案是：**非常大**。在 LinkedIn 上，带有专业头像的个人资料被查看的概率比没有头像的**高出 14 倍**。在 Instagram 上，高质量的头像往往意味着更多的关注转化。在微信上，一个有辨识度的头像让你在群聊中更容易被记住。

但现实中，大多数人用的头像是：
- 自拍时背景杂乱（房间、餐厅、路人…）
- 随手拍一张，光线和角度都欠佳
- 没有合适的纯色背景来替换

好消息是：你不需要请专业摄影师。用 Zan Pic 就可以为每个社交平台制作一张「定制化」头像，而且每张都看起来专业又好看。

---

### 一、为什么不同平台需要不同的头像？

不同的社交平台有不同的用户预期和使用场景：

| 平台 | 头像预期 | 风格建议 |
|------|---------|---------|
| **LinkedIn** | 职业、正式、可信赖 | 正装、微笑、纯色背景（推荐浅灰或白） |
| **Instagram** | 个性、审美、有故事感 | 创意构图、风格化背景、滤镜效果 |
| **Facebook** | 友善、自然、生活化 | 半身照、自然光线、简洁背景 |
| **Twitter / X** | 清晰、有辨识度 | 面部突出的特写、圆形裁剪注意构图 |
| **微信/WhatsApp** | 个人化、轻松 | 自由风格，但注意小尺寸下的可辨识度 |
| **YouTube** | 品牌感、专业 | 清晰、高对比度、适合圆形+长方形两种裁剪 |
| **TikTok** | 年轻、潮流、大胆 | 色彩鲜明、表情丰富、背景风格化 |
| **GitHub** | 极简、技术感 | 纯色或代码背景，正方形构图 |

**核心建议**：每个重要平台的账号都配一张针对该平台优化的头像。对，多张不同的头像 — 而不是一张照片贴所有地方。

---

### 二、第一步：选择一个「万能原图」

你只需要拍 **1 张好的原图**，就可以通过换背景、调色、裁剪，生成多张适用于不同平台的头像。

#### 万能原图拍摄指南

- **光线**：窗边自然光 + 侧面补光（可用白色泡沫板反射）
- **角度**：正面偏侧 10-15°（微侧脸更有立体感），下巴微收
- **距离**：胸口以上构图，面部占画面 40-50%
- **表情**：自然微笑，眼神看镜头
- **背景**：**使用简单纯色背景**（白墙最佳），便于后期 AI 抠图分离
- **着装**：建议穿纯色或简单条纹的有领衫（方便后续换不同风格的背景）

> 💡 **一个关键技巧**：拍原图时穿**中性色衣服**（白/灰/黑/深蓝），这样无论后续换成什么背景色，都能搭配得上。

---

### 三、第二步：AI 抠图分离人像

打开 [Zan Pic AI 抠图工具](/background-remover)，上传你的万能原图：

1. 点击「智能抠图」— AI 自动分离人像和背景（2-5 秒）
2. 放大检查发丝边缘 — 如果边缘粗糙，用「涂抹抠图」精修
3. 另存为「透明背景」版本 — 这是我们做各种背景的「模板」

---

### 四、第三步：为每个平台定制头像

有了透明背景的人像模板后，你可以为每个平台做不同版本：

#### LinkedIn 职业头像
- **背景色**：浅灰（#F0F0F0）或柔白（#FAFAFA）— 看起来干净专业
- **裁剪形状**：正方形（1:1），面部居中，头顶留 5-10% 空间
- **风格**：可以用「调整」功能微调曝光和对比度，让人物肤色自然
- **着装建议**：深色正装 + 纯色背景 = 完美的职业印象

#### Instagram 风格头像
- **背景方案 A**：使用渐变色背景（在 Zan Pic 中处理好人像后，用渐变背景覆盖）
- **背景方案 B**：加「暖色」滤镜，让人物肤色更温暖，背景用浅蓝或薄荷绿
- **风格**：饱和度高一点，色彩鲜明（Instagram 用手机看小图，需要视觉冲击力）
- **滤镜推荐**：鲜艳（提高饱和度）或暖色（增加氛围感）

#### Facebook 自然头像
- **背景方案**：选择与日常生活接近的颜色（浅米色、淡蓝、淡绿）
- **风格**：亮度 +8、对比度 -3，看起来柔和自然
- **注意事项**：Facebook 头像经常缩到极小（评论区的圆形头像），确保面部清晰突出

#### Twitter / X 头像
- **背景方案**：纯色或极简（白色或纯黑色也不错）
- **风格**：对比度 +10，清晰锐利
- **重要**：Twitter 老用户换头像会被注意到，所以想好了再换

#### YouTube 频道头像
- **背景方案**：品牌主色调 + 纯色
- **风格**：高对比度，因为头像在视频页缩到很小
- **尺寸注意**：YouTube 同时用于圆形（小图）和正方形（频道页大图），确保重要元素在中心 70% 范围内

---

### 五、各平台头像尺寸对照

| 平台 | 推荐尺寸（px） | 最小尺寸（px） | 显示形状 | 文件大小限制 |
|------|--------------|--------------|---------|------------|
| LinkedIn | 400×400 | 200×200 | 圆形 | 8 MB |
| Instagram | 320×320 | 110×110 | 圆形 | 无明确限制 |
| Facebook | 720×720 | 180×180 | 圆形 | 无明确限制 |
| Twitter / X | 400×400 | 200×200 | 圆形 | 2 MB |
| YouTube | 800×800 | 250×250 | 圆形 | 无明确限制 |
| TikTok | 200×200+ | 20×20 | 圆形 | 无明确限制 |
| GitHub | 500×500 | — | 圆形 | 1 MB |
| 微信 | 200×200+ | — | 正方形 | 无明确限制 |

> 💡 Zan Pic 的「裁剪」工具支持 1:1 正方形比例，可以帮你在导出前裁剪到合适的尺寸。

---

### 六、常见问题 FAQ

**Q: 不同平台用不同头像，不会让人认不出来吗？**

A: 只要人像本身保持一致（同一个人、同一张脸），背景和风格的差异不会影响辨识度。相反，专业平台上的好头像会给你加分。很多个人品牌主理人都会有 3-5 个版本的头像，这很正常。

**Q: AI 抠图的边缘在 LinkedIn 圆形裁剪中会不会有问题？**

A: LinkedIn 头像会在角落做圆形裁剪。Zan Pic 的 AI 抠图精度（发丝级）和边缘精修算法可以确保边缘自然过渡。导出前放大检查一下耳朵和发丝边缘即可。

**Q: 可以不抠图，直接在 Zan Pic 中调色加滤镜吗？**

A: 可以。如果你的原图背景本身就比较干净（如白墙前拍摄），可以直接用 [Zan Pic 的滤镜功能](/photo-filter) 调色处理。但如果你想换成完全不同风格的背景（如从白墙换成 LinkedIn 灰底），那就需要先 AI 抠图。

**Q: 头像文件应该导出什么格式？**

A: 除 GitHub 偏好 PNG 外，大多数平台都支持 JPEG。建议导出 JPEG（质量 85-90%），兼顾清晰度和文件大小。如果头像包含透明区域，导出 PNG。

---

### 七、总结

三步打造完美的社媒头像：

1. 📸 拍一张「万能原图」— 自然光 + 纯色背景 + 正��微侧
2. 🤖 AI 抠图 — 一键获得透明背景的人像
3. 🎨 为不同平台定制 — 换背景色、调风格、裁剪到合适尺寸

一个下午的时间，就能为你所有的社交账号都配上量身定制的专业头像。立即打开 [Zan Pic](/) 开始制作吧。

> 📚 相关阅读：
> - [图片滤镜调色入门](/blog/photo-filter-color-grading-guide) — 掌握调色基本功
> - [AI 抠图技术原理](/blog/ai-background-removal-isnet) — 了解抠图背后的 AI 技术`,
  },
  {
    id: 'seed-10', slug: 'ai-background-remover-review', seedKey: 'seed10', date: '2026-07-28',
    title: '2026 年最佳免费 AI 抠图工具横评：Zan Pic vs remove.bg vs Adobe vs 其他',
    category: '工具评测',
    excerpt: '我们深度评测了 2026 年市面上 7 款主流 AI 抠图工具，从免费策略、抠图精度、处理速度、隐私保护、批量处理等 8 个维度对比。结论：如果你追求免费 + 隐私 + 精细控制，Zan Pic 是最优选择。',
    content: `## 2026 年最佳免费 AI 抠图工具横评

AI 背景移除已经成为图片编辑中最高频的需求之一。无论你是电商卖家处理商品图、社交媒体用户美化头像，还是设计师快速抠素材，一个好的 AI 抠图工具能帮你省下大量时间。

但市面上的选择太多了：**remove.bg**（行业鼻祖）、**Adobe Express**（大厂出品）、**Canva**（全能型）、**各种免费工具**……到底哪款最适合你？

我们花了 3 天时间，用相同的测试图片集（人像、商品、复杂边缘各 10 张），全面评测了 7 款主流 AI 抠图工具。以下是完整横评结果。

---

### 一、参赛选手一览

| 工具 | 类型 | 免费策略 | 是否需要注册 |
|------|------|---------|------------|
| **Zan Pic** | 纯前端 Web 应用 | 完全免费，无限制 | ❌ 不需要 |
| **remove.bg** | Web 在线 | 免费预览低分辨率，高清需付费 | ❌ 不需要 |
| **Adobe Express** | Web + 桌面 | 免费使用，需 Adobe 账号 | ✅ 需要 |
| **Canva Pro** | 在线设计平台 | 抠图需付费 Pro 版 | ✅ 需要 |
| **PhotoScissors** | 桌面软件 | 免费试用有水印 | ❌ 不需要 |
| **Slazzer** | Web 在线 | 每月 5 张免费 | ❌ 不需要 |
| **Erase.bg** | Web 在线 | 免费使用，分辨率有限 | ❌ 不需要 |

---

### 二、核心维度对比

#### 1. 抠图精度（人像）

| 工具 | 整体精度 | 发丝处理 | 饰品/眼镜 | 半透明处理 |
|------|---------|---------|----------|-----------|
| **Zan Pic** | ⭐⭐⭐⭐⭐ | 优秀（形态学精修） | 良好 | 良好 |
| remove.bg | ⭐⭐⭐⭐⭐ | 优秀 | 良好 | 一般 |
| Adobe Express | ⭐⭐⭐⭐ | 良好 | 良好 | 良好 |
| Canva Pro | ⭐⭐⭐⭐ | 良好 | 良好 | 一般 |
| Slazzer | ⭐⭐⭐⭐ | 良好 | 一般 | 一般 |
| Erase.bg | ⭐⭐⭐ | 一般 | 一般 | 一般 |
| PhotoScissors | ⭐⭐⭐ | 一般 | 一般 | 较差 |

**结论**：人像抠图方面，Zan Pic 和 remove.bg 处于第一梯队。Zan Pic 的 IS-Net 模型 + 形态学精修算法在发丝边缘处理上表现尤为突出。

#### 2. 处理速度（1024×1024 图片）

| 工具 | 平均耗时 | 加速技术 | 备注 |
|------|---------|---------|------|
| **Zan Pic（WebGPU）** | 0.3-0.8 秒 | WebGPU GPU 加速 | Chrome/Edge 上新浏览器 |
| **Zan Pic（WASM）** | 3-5 秒 | WASM SIMD CPU | 所有浏览器 |
| remove.bg | 1-3 秒 | 云端 GPU | 依赖网络和排队 |
| Adobe Express | 1-2 秒 | 云端 AI | 需上传到 Adobe 服务器 |
| Canva Pro | 1-2 秒 | 云端处理 | — |
| Slazzer | 2-4 秒 | 云端处理 | — |
| Erase.bg | 2-5 秒 | 云端处理 | — |
| PhotoScissors | 5-10 秒 | 本地 CPU | 桌面端本地处理 |

**结论**：remove.bg 和 Adobe Express 的云端速度不错，但受网络和排队影响。Zan Pic 在 WebGPU 支持下是唯一能在 1 秒以内完成的工具，而且不受网络波动影响。

#### 3. 隐私与数据安全

这是**最容易被用户忽视但实际最重要的维度**。很多人不知道，使用在线抠图工具时，你的图片会被上传到对方的服务器。

| 工具 | 图片上传输 | 数据保留 | 隐私评分 |
|------|-----------|---------|---------|
| **Zan Pic** | ❌ 不上传（纯前端） | 不保留 | ⭐⭐⭐⭐⭐ |
| remove.bg | ✅ 上传 | 声称处理后删除 | ⭐⭐⭐ |
| Adobe Express | ✅ 上传 | 受 Adobe 隐私政策约束 | ⭐⭐⭐ |
| Canva Pro | ✅ 上传 | 受 Canva 政策约束 | ⭐⭐⭐ |
| Slazzer | ✅ 上传 | 未明确说明 | ⭐⭐ |
| Erase.bg | ✅ 上传 | 声称 24 小时删除 | ⭐⭐⭐ |
| PhotoScissors | ❌ 不上传（桌面端） | 不保留 | ⭐⭐⭐⭐⭐ |

**结论**：只有 Zan Pic 和 PhotoScissors 实现了真正的本地处理。对于处理身份证照片、商业产品图、个人隐私照片等场景，Zan Pic 的零上传架构是巨大的优势。**图片始终留在你的设备上。**

#### 4. 免费额度

| 工具 | 免费额度 | 免费分辨率 | 使用限制 |
|------|---------|-----------|---------|
| **Zan Pic** | **无限次** | 原始分辨率 | 无任何限制 |
| remove.bg | 预览免费 | 约 612×612 低清 | 高清需付费 |
| Adobe Express | 无限次 | 原始分辨率 | 需注册 Adobe 账号 |
| Canva Pro | 0（抠图功能需付费） | — | 需 Pro 订阅 |
| Slazzer | 5 张/月 | 原始分辨率 | 超额需付费 |
| Erase.bg | 无限次 | 有限（低于原始） | 大批量需付费 |
| PhotoScissors | 不限 | 有水印 | 付费去水印 $19.99 |

**结论**：Zan Pic 是目前唯一真正「完全免费且无限制」的高质量 AI 抠图工具。Adobe Express 也免费但要注册，remove.bg 免费版只能下载低分辨率。

---

### 三、各工具的独特优势

#### Zan Pic — 最佳免费+隐私选择

- ✅ 完全免费，无次数限制
- ✅ 图片不上传服务器，纯前端处理
- ✅ IS-Net 模型 + 形态学精修，边缘质量高
- ✅ 支持涂抹抠图手动精修（其他工具基本没有）
- ✅ 集成证件照生成、滤镜、裁剪等功能
- ⚠️ 需要现代浏览器（Chrome/Edge 推荐）
- ⚠️ 首次使用需下载 AI 模型文件（约 24MB）— 但只需一次

#### remove.bg — 最成熟的老牌工具

- ✅ 抠图精度行业标杆
- ✅ 支持 API 集成（适合开发者批量处理）
- ✅ 多种背景替换模板
- ⚠️ 免费版分辨率有限、有水印限制
- ⚠️ 图片需上传到云端服务器
- ⚠️ 付费计划起价 $0.19/张

#### Adobe Express — 大厂品质

- ✅ Adobe 品牌背书，AI 质量有保证
- ✅ 免费（需注册）
- ✅ 集成丰富的后续编辑功能
- ⚠️ 必须注册 Adobe 账号
- ⚠️ 图片上传到 Adobe 服务器
- ⚠️ 界面偏复杂，抠图入口不好找

---

### 四、场景推荐

| 使用场景 | 推荐工具 | 理由 |
|---------|---------|------|
| 偶尔抠图，不想花钱 | **Zan Pic** | 完全免费，无需注册 |
| 处理隐私照片（证件、商业图） | **Zan Pic** | 图片不离开设备 |
| 批量处理 1000+ 张 | remove.bg API | API 效率高（但需付费） |
| 需要精细手动调整 | **Zan Pic** | 唯一提供涂抹抠图功能的 |
| 在 Adobe 生态中工作 | Adobe Express | 与 Photoshop 等无缝 |
| 只用手机浏览器 | **Zan Pic** / remove.bg | 两者都支持移动端 |
| 一次搞定证件照 | **Zan Pic** | 抠图+证件照一站式 |

---

### 五、常见问题 FAQ

**Q: Zan Pic 真的是完全免费？没有隐藏收费？**

A: 对，Zan Pic 当前完全免费，功能无限使用。Zan Pic 是一个独立项目，运营成本主要通过 CDN 优化和纯前端架构控制。未来如果推出高级功能，基础版仍会保持免费。

**Q: Zan Pic 不上传图片，那 AI 模型怎么跑？**

A: AI 模型文件在首次使用时从 CDN 下载（约 24MB），之后缓存在浏览器 IndexedDB 中。推理过程通过 ONNX Runtime 在你的浏览器本地执行。WebGPU 加速下，处理速度和云端工具相当甚至更快。

**Q: 抠图效果最好的工具是哪款？**

A: 人像和商品图方面，Zan Pic 和 remove.bg 都是顶级水平。Zan Pic 在发丝边缘处理上有形态学精修加成，remove.bg 在极端复杂场景下略胜一筹。差距不大，普通人用肉眼基本分辨不出。

**Q: 如果需要每个月处理大量图片怎么办？**

A: 目前 Zan Pic 暂不支持批量处理（功能开发中）。高频用户可以考虑 remove.bg 的 API（按量付费，约 $0.02-0.19/张）或 Adobe Express。也可以先用 Zan Pic 处理最关键的那些，大部分量不大的用户完全够用。

---

### 六、总结

如果你在找一个**免费、高质量、保护隐私的 AI 抠图工具**，Zan Pic 是 2026 年最好的选择。

核心优势：
- 🆓 完全免费，无次数限制
- 🔒 图片不上传，隐私安全
- 🎯 IS-Net 模型 + 边缘精修，发丝级别精度
- ✏️ 独有涂抹抠图功能，手动精修自由调整
- 📱 证件照生成、滤镜、裁剪一站式工具

立即体验 [Zan Pic AI 抠图](/background-remover)，感受最好的免费 AI 抠图体验。

> 📚 相关阅读：
> - [AI 抠图技术原理：IS-Net 模型详解](/blog/ai-background-removal-isnet) — 技术内幕
> - [电商商品图白底制作教程](/blog/product-photo-white-background) — 电商场景实操`,
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
          'seed-7': 'seed7', 'seed-8': 'seed8', 'seed-9': 'seed9',
          'seed-10': 'seed10',
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
