# 桃翁的博客 📄

![Typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Astro](https://img.shields.io/badge/Astro-FF5D01?style=for-the-badge&logo=astro&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwindcss-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

一个基于 Astro 构建的个人技术博客，专注于前端开发、技术分享和个人思考。

本项目基于 [AstroPaper](https://github.com/satnaing/astro-paper) 主题开发，并根据个人需求进行了定制化改造。

## 🌐 在线访问

访问地址：[https://taoweng.site/](https://taoweng.site/)

## ✨ 特色功能

- [x] 类型安全的 Markdown 内容管理
- [x] 极速性能表现
- [x] 完全响应式设计（移动端到桌面端）
- [x] SEO 友好
- [x] 亮色/暗色主题切换
- [x] 模糊搜索功能
- [x] 草稿文章与分页功能
- [x] 自动生成 Sitemap 和 RSS 订阅
- [x] 文章动态 OG 图片生成
- [x] AI 工具导航页面
- [x] 网站导航收藏页面
- [x] 标签分类系统
- [x] 评论系统集成（Twikoo）

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

**核心框架** - [Astro](https://astro.build/) 5.15.4  
**类型检查** - [TypeScript](https://www.typescriptlang.org/)  
**UI 组件** - [React](https://reactjs.org/) 19.2.0  
**样式方案** - [TailwindCSS](https://tailwindcss.com/) 3.4.18  
**模糊搜索** - [Fuse.js](https://fusejs.io/) 7.1.0  
**评论系统** - [Twikoo](https://twikoo.js.org/) 1.6.44  
**代码格式化** - [Prettier](https://prettier.io/)  
**代码检查** - [ESLint](https://eslint.org)  
**部署平台** - [Vercel](https://vercel.com/)

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

1. 在 `src/content/blog/` 目录下创建新的 Markdown 文件
2. 添加 frontmatter 元数据：

```markdown
---
title: "文章标题"
description: "文章描述"
pubDatetime: 2024-01-01T00:00:00Z
tags: ["标签1", "标签2"]
---

文章正文内容...
```

### 文章分类

博客文章按以下目录组织：

- `技术/` - 技术文章和教程
- `观点与感想/` - 个人观点和思考
- `笔记本/` - 学习笔记
- `桃园周刊/` - 周刊内容
- `译文/` - 翻译文章
- 按年份分类：`2022/`、`2023/`、`2024/`

### 更新 AI 工具列表

编辑 `src/data/ai.json` 文件，添加或修改 AI 工具信息。

详细说明参见：[src/data/README.md](src/data/README.md)

## 🧞 可用命令

所有命令都在项目根目录的终端中运行：

| 命令                   | 说明                                  |
| :--------------------- | :------------------------------------ |
| `npm install`          | 安装依赖                              |
| `npm run dev`          | 启动本地开发服务器 `localhost:4321`   |
| `npm run build`        | 构建生产版本到 `./dist/` 目录         |
| `npm run preview`      | 本地预览构建后的网站                  |
| `npm run format:check` | 使用 Prettier 检查代码格式            |
| `npm run format`       | 使用 Prettier 格式化代码              |
| `npm run sync`         | 为所有 Astro 模块生成 TypeScript 类型 |
| `npm run cz`           | 使用 commitizen 提交代码              |
| `npm run lint`         | 使用 ESLint 检查代码                  |

## 📄 配置说明

网站配置位于 `src/config.ts`，可以修改以下内容：

- 网站基本信息（标题、描述、作者等）
- 社交媒体链接
- 每页文章数量
- 主题设置

## 📜 开源协议

本项目基于 MIT 协议开源。

## 🙏 致谢

- 感谢 [Sat Naing](https://satnaing.dev) 创建的 [AstroPaper](https://github.com/satnaing/astro-paper) 主题
- 感谢 Astro 团队提供的优秀框架

## � 联系方式

- 邮箱：1076629390@qq.com
- GitHub：[@crazylxr](https://github.com/crazylxr)
- 网站：[taoweng.site](https://taoweng.site/)

---

用 ❤️ 构建 by 桃翁
