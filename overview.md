# 站点导航组件 — 首页分类链接

## 完成内容

将 sitemap 中的 73 个 URL 按功能类别分类，在首页提供链接入口。

### 双重 SEO 保障

**1. React 组件（SiteDirectory.tsx）**
- 集成在 Footer 组件中，首页底部显示
- 可折叠面板，点击"站点导航 · 72 个页面"展开/收起
- 链接始终在 DOM 中（CSS max-height 折叠，非条件渲染）
- 响应式 grid：1/2/3/4 列自适应

**2. Noscript HTML 回退（index.html）**
- `<noscript>` 块包含全部 72 个分类链接
- Googlebot 无需执行 JS 即可发现所有页面
- 语义化 H2 + ul>li>a 结构

### 7 个功能类别

| 类别 | 数量 | URL 模式 |
|------|------|---------|
| 核心工具 | 4 | /id-photo-maker, /background-remover, /photo-resizer, /photo-filter |
| 证件照规格大全 | 25 | /id-photo/:slug |
| 社媒图片尺寸 | 15 | /resize/:slug |
| 背景色工具 | 4 | /background/:slug |
| 图片格式转换 | 10 | /convert/:slug |
| 博客教程 | 10 | /blog/:slug |
| 关于与帮助 | 3 | /about, /privacy, /contact |

### 改动文件

| 文件 | 改动 |
|------|------|
| `src/components/SiteDirectory.tsx` | 新建 — 可折叠站点导航组件 |
| `src/components/Footer.tsx` | 集成 SiteDirectory |
| `index.html` | 新增 noscript 块（72 个分类链接） |

### 构建结果
- tsc ✅ | vite build 20.20s ✅ | 预渲染 72 页 ✅
- Commit: `e0c3339`

### 待处理
GitHub push 网络不通，commit 已在本地。网络恢复后执行：
```bash
cd C:\Users\Administrator\WorkBuddy\2026-07-04-22-05-57\pixel-studio
git push origin main
```
