# Zan Pic — Vercel 部署指南

## 前置准备

项目已配置好以下文件，无需额外修改：
- `vercel.json` — Vercel 部署配置（SPA 路由回退、WASM 文件 MIME type、缓存策略、安全头）
- `.gitignore` — 排除 node_modules、dist、临时文件等
- Git 仓库已初始化并提交

---

## 部署步骤

### 方法一：通过 GitHub 部署（推荐，支持自动部署）

#### 第 1 步：创建 GitHub 仓库

1. 打开 https://github.com/new
2. Repository name 填 `zan-pic`
3. 选择 **Private**（私有）或 **Public**（公开）
4. **不要**勾选 "Add a README file"、"Add .gitignore"、"Choose a license"（项目已有这些文件）
5. 点击 **Create repository**

#### 第 2 步：推送代码到 GitHub

在项目目录 `pixel-studio` 下执行：

```bash
# 如果还没有配置 git 用户信息，先设置一次
git config user.name "你的名字"
git config user.email "你的邮箱"

# 添加远程仓库（替换成你的仓库地址）
git remote add origin https://github.com/你的用户名/zan-pic.git

# 推送代码
git branch -M main
git push -u origin main
```

如果提示需要登录，使用 GitHub Personal Access Token（不是密码）：
1. 打开 https://github.com/settings/tokens
2. Generate new token (classic) → 勾选 `repo` 权限
3. 推送时密码处粘贴 Token

#### 第 3 步：在 Vercel 导入项目

1. 打开 https://vercel.com → 用 GitHub 账号登录
2. 点击 **Add New** → **Project**
3. 在 "Import Git Repository" 列表中找到 `zan-pic` 仓库
4. 点击 **Import**

#### 第 4 步：配置部署（通常自动识别）

Vercel 会自动检测 Vite 框架，确认以下配置：

| 配置项 | 值 |
|--------|-----|
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

> 这些已在 `vercel.json` 中固化，即使 Vercel 没自动识别也会按配置执行。

#### 第 5 步：部署

1. 点击 **Deploy**
2. 等待 1-2 分钟，构建完成
3. 获得 `https://zan-pic-xxx.vercel.app` 临时域名

#### 第 6 步：绑定自定义域名（可选）

1. 进入 Vercel 项目 → **Settings** → **Domains**
2. 输入你的域名（如 `zanpic.com`）
3. 按提示到域名注册商添加 DNS 记录：
   - 添加 `A` 记录指向 `76.76.21.21`
   - 或添加 `CNAME` 记录指向 `cname.vercel-dns.com`
4. 等待 DNS 生效（通常几分钟到几小时）
5. Vercel 自动签发 SSL 证书

---

### 方法二：通过 Vercel CLI 部署（无需 GitHub）

#### 第 1 步：安装 Vercel CLI

```bash
npm install -g vercel
```

#### 第 2 步：登录 Vercel

```bash
vercel login
```
输入邮箱，按提示在浏览器确认。

#### 第 3 步：部署

在项目目录下：

```bash
# 预览部署（生成临时测试链接）
vercel

# 生产部署（正式上线）
vercel --prod
```

#### 第 4 步：绑定域名（同方法一第 6 步）

---

## 部署后验证清单

部署完成后，依次检查：

- [ ] 首页正常加载，图片编辑器功能正常
- [ ] 访问 `/admin` 能打开管理后台（不会 404）
- [ ] 上传图片后 AI 抠图功能正常（WASM 模型加载成功）
- [ ] 证件照生成功能正常
- [ ] 语言切换功能正常
- [ ] 主题切换（亮/暗/系统）正常
- [ ] 移动端响应式布局正常

## 常见问题

### Q: 部署后 /admin 页面 404？
A: `vercel.json` 已配置 SPA 路由回退，所有路径都会返回 `index.html`。如果仍 404，检查 `vercel.json` 是否正确推送到了仓库。

### Q: AI 抠图功能不工作？
A: 项目有一个 23MB 的 WASM 文件（ONNX 运行时）。`vercel.json` 已配置正确的 `Content-Type: application/wasm`。如果仍有问题，检查浏览器控制台是否有跨域或加载错误。

### Q: 构建失败？
A: 常见原因：
- Node 版本不匹配 → Vercel 默认用 Node 20，项目需要 Node 18+
- 依赖安装失败 → 检查 `package-lock.json` 是否已提交

### Q: 部署体积过大？
A: 当前构建约 26MB（主要是 WASM 模型文件 23MB）。Vercel 免费计划限制：
- 单个文件最大 100MB ✅
- 部署总体积最大 100MB（解压后）✅
- 带宽每月 100GB ✅

### Q: 如何更新网站？
A: 
- GitHub 方式：推送代码到 main 分支，Vercel 自动重新部署
- CLI 方式：在项目目录运行 `vercel --prod`

---

## 文件说明

| 文件 | 作用 |
|------|------|
| `vercel.json` | Vercel 部署配置：框架、构建命令、SPA 路由回退、WASM MIME type、缓存策略、安全响应头 |
| `.gitignore` | Git 忽略规则：node_modules、dist、环境变量、Vite 临时文件 |
| `vite.config.ts` | Vite 构建配置：terser 压缩混淆、source map 关闭、console 清除 |
