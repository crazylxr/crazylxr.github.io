# 桃翁的博客 📝

![Typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Astro](https://img.shields.io/badge/Astro-5.15.4-FF5D01?style=for-the-badge&logo=astro&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwindcss-3.4.18-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)

一个基于 [Astro](https://astro.build/) 构建的个人技术博客，专注于前端开发、技术分享和个人思考。

本项目基于 [AstroPaper](https://github.com/satnaing/astro-paper) 主题开发，并根据个人需求进行了定制化改造。

## 🌐 在线访问

网站地址：[https://taoweng.site/](https://taoweng.site/)

## ✨ 主要特色

- [x] 🎯 类型安全的 Markdown 内容管理
- [x] ⚡ 极速性能表现（Astro 静态生成）
- [x] 📱 完全响应式设计（移动端到桌面端）
- [x] 🔍 SEO 友好
- [x] 🌓 亮色/暗色主题切换
- [x] 🔎 模糊搜索功能
- [x] ✍️ 草稿文章与分页功能
- [x] 📡 自动生成 Sitemap 和 RSS 订阅
- [x] 🖼️ 文章动态 OG 图片生成
- [x] 🤖 AI 工具导航页面
- [x] 🔗 网站导航收藏页面
- [x] 🏷️ 灵活的标签分类系统
- [x] 💬 评论系统集成（Twikoo）
- [x] 🔄 Notion 数据同步功能

## 🚀 项目结构

```bash
/
├── public/
│   ├── assets/
│   │   └── ai-icons/         # AI 工具图标
│   ├── robots.txt
│   └── toggle-theme.js        # 主题切换脚本
├── scripts/
│   └── update-ai-icons.js     # AI 图标更新脚本
├── src/
│   ├── assets/
│   │   └── socialIcons.ts     # 社交媒体图标配置
│   ├── components/            # 可复用组件
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── Search.tsx
│   │   └── ...
│   ├── content/
│   │   ├── blog/              # 博客文章目录
│   │   │   ├── 2022/
│   │   │   ├── 2023/
│   │   │   ├── 2024/
│   │   │   ├── 技术/
│   │   │   ├── 笔记本/
│   │   │   ├── 观点与感想/
│   │   │   ├── 桃园周刊/
│   │   │   └── 译文/
│   │   ├── _schemas.ts        # 内容类型定义
│   │   └── config.ts          # 内容集合配置
│   ├── data/
│   │   └── ai.json            # AI 工具数据
│   ├── layouts/               # 页面布局
│   │   ├── Layout.astro
│   │   ├── WideLayout.astro
│   │   └── PostDetails.astro
│   ├── pages/                 # 路由页面
│   │   ├── index.astro        # 首页
│   │   ├── about.md           # 关于页面
│   │   ├── ai.astro           # AI 工具页面
│   │   ├── nav.astro          # 导航页面
│   │   ├── search.astro       # 搜索页面
│   │   ├── posts/             # 文章列表和详情
│   │   └── tags/              # 标签页面
│   ├── styles/
│   │   └── base.css           # 基础样式
│   ├── utils/                 # 工具函数
│   └── config.ts              # 网站配置
├── astro.config.mjs           # Astro 配置
├── tailwind.config.cjs        # Tailwind 配置
└── tsconfig.json              # TypeScript 配置
```

## 💻 技术栈

| 类别         | 技术                                          | 版本   |
| ------------ | --------------------------------------------- | ------ |
| **框架**     | [Astro](https://astro.build/)                 | 5.15.4 |
| **语言**     | [TypeScript](https://www.typescriptlang.org/) | Latest |
| **UI**       | [React](https://reactjs.org/)                 | 19.2.0 |
| **样式**     | [TailwindCSS](https://tailwindcss.com/)       | 3.4.18 |
| **搜索**     | [Fuse.js](https://fusejs.io/)                 | 7.1.0  |
| **评论**     | [Twikoo](https://twikoo.js.org/)              | 1.6.44 |
| **数据同步** | [Notion API](https://developers.notion.com/)  | -      |
| **静态生成** | [Satori](https://github.com/vercel/satori)    | 0.18.3 |
| **代码检查** | [ESLint](https://eslint.org)                  | 9.39.1 |
| **代码格式** | [Prettier](https://prettier.io/)              | 3.6.2  |
| **部署**     | [Vercel](https://vercel.com/)                 | -      |

## 🛠️ 本地开发

### 克隆项目

```bash
git clone https://github.com/crazylxr/crazylxr.github.io.git
cd crazylxr.github.io
```

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:4321` 查看网站。

## 📝 内容管理

### 添加新文章

在 `src/content/blog/` 目录下创建新的 Markdown 文件，添加以下 frontmatter 元数据：

```markdown
---
title: "文章标题"
description: "文章简短描述"
pubDatetime: 2024-12-07T00:00:00Z
modDatetime: 2024-12-07T00:00:00Z
featured: false
draft: false
tags:
  - "标签1"
  - "标签2"
---

文章正文内容...
```

**frontmatter 字段说明：**

- `title` - 文章标题（必填）
- `description` - 文章描述（必填，用于 SEO）
- `pubDatetime` - 发布时间（必填）
- `modDatetime` - 修改时间（可选）
- `featured` - 是否在首页置顶（可选，默认 false）
- `draft` - 是否为草稿（可选，默认 false）
- `tags` - 文章标签数组（可选）

### 文章分类组织

博客文章按以下目录组织，便于管理和检索：

```
src/content/blog/
├── 2024/              # 2024 年文章
├── 2023/              # 2023 年文章
├── 2022/              # 2022 年文章
├── 技术/              # 技术教程和深度分析
├── 观点与感想/        # 个人想法和观察
├── 笔记本/            # 学习笔记和知识总结
├── 桃园周刊/          # 周刊内容
└── 译文/              # 翻译的文章
```

### 更新 AI 工具列表

编辑 `src/data/ai.json` 文件，添加或修改 AI 工具信息。详见 [src/data/README.md](src/data/README.md)

### Notion 数据同步

项目支持从 Notion 数据库同步博客内容：

```bash
npm run sync:notion
```

配置说明详见：[docs/NOTION_SYNC_GUIDE.md](docs/NOTION_SYNC_GUIDE.md)

## 🧞 可用命令

所有命令都在项目根目录的终端中运行：

| 命令                   | 说明                                  |
| ---------------------- | ------------------------------------- |
| `npm install`          | 安装所有依赖                          |
| `npm run dev`          | 启动本地开发服务器 `localhost:4321`   |
| `npm start`            | 启动开发服务器（别名）                |
| `npm run build`        | 构建生产版本到 `./dist/` 目录         |
| `npm run preview`      | 本地预览构建后的网站                  |
| `npm run sync`         | 为所有 Astro 模块生成 TypeScript 类型 |
| `npm run sync:notion`  | 从 Notion 同步博客数据                |
| `npm run format:check` | 使用 Prettier 检查代码格式            |
| `npm run format`       | 使用 Prettier 格式化代码              |
| `npm run lint`         | 使用 ESLint 检查代码                  |
| `npm run cz`           | 使用 commitizen 提交代码              |

## ⚙️ 配置说明

### 网站配置

网站基本配置位于 `src/config.ts`，可以修改以下内容：

```typescript
export const SITE = {
  website: "https://taoweng.site/", // 网站 URL
  author: "桃翁", // 作者名称
  desc: "一个前端工程师的博客", // 网站描述
  title: "Home", // 页面标题
  ogImage: "astropaper-og.jpg", // OG 图片
  lightAndDarkMode: true, // 是否启用暗黑模式
  postPerPage: 10, // 每页显示文章数
};
```

### 主题切换

网站支持亮色/暗色主题切换，主题切换脚本位于 `public/toggle-theme.js`

### 社交媒体配置

在 `src/config.ts` 的 `SOCIALS` 数组中配置社交媒体链接

## 📄 开源许可证

本项目基于 [MIT](LICENSE) 协议开源。

## 🙏 致谢

- [Sat Naing](https://satnaing.dev) - 创建的 [AstroPaper](https://github.com/satnaing/astro-paper) 主题
- [Astro](https://astro.build/) 团队 - 提供的优秀框架
- 所有贡献者的支持与反馈

## 📬 联系方式

- 📧 邮箱：[1076629390@qq.com](mailto:1076629390@qq.com)
- 🐙 GitHub：[@crazylxr](https://github.com/crazylxr)
- 🌐 个人网站：[taoweng.site](https://taoweng.site/)
- 🐦 Twitter：[@Tao_Weng](https://twitter.com/Tao_Weng)

---

<div align="center">

用 ❤️ 构建 by 桃翁

![GitHub](https://img.shields.io/badge/GitHub-crazylxr-blue?logo=github&style=flat-square)
![Last Commit](https://img.shields.io/github/last-commit/crazylxr/crazylxr.github.io?style=flat-square)
![License](https://img.shields.io/github/license/crazylxr/crazylxr.github.io?style=flat-square)

</div>
