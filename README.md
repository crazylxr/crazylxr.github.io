<div align="center">

# 桃翁的博客

一个记录前端技术、学习笔记与个人思考的个人博客。

[在线访问](https://taoweng.site/) · [浏览文章](https://taoweng.site/posts/) · [RSS 订阅](https://taoweng.site/rss.xml)

[![Deploy to GitHub Pages](https://github.com/crazylxr/crazylxr.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/crazylxr/crazylxr.github.io/actions/workflows/deploy.yml)
[![Astro](https://img.shields.io/badge/Astro-5-FF5D01?logo=astro&logoColor=white)](https://astro.build/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/github/license/crazylxr/crazylxr.github.io)](LICENSE)

</div>

## 关于项目

本站基于 [AstroPaper](https://github.com/satnaing/astro-paper) 主题开发，在保留简洁阅读体验的基础上，加入了内容分类、全文搜索、评论、AI 工具导航、网站收藏导航和 Notion 内容同步等能力。

网站使用 Astro 静态生成，适合博客这类以内容为主的场景：页面加载快、部署简单，也便于通过 Markdown 和 Git 长期维护。

## 主要功能

- Markdown 内容管理与类型校验
- 响应式布局及亮色 / 暗色主题
- 文章分页、标签分类、置顶与草稿
- 基于 Fuse.js 的模糊搜索
- Sitemap、RSS 与动态 Open Graph 图片
- KaTeX 数学公式及代码高亮
- Twikoo 评论系统
- AI 工具导航与网站收藏导航
- Notion 数据库定时同步
- GitHub Actions 自动构建并部署到 GitHub Pages

## 技术栈

| 领域 | 方案                                          |
| ---- | --------------------------------------------- |
| 框架 | [Astro 5](https://astro.build/)               |
| 语言 | [TypeScript](https://www.typescriptlang.org/) |
| UI   | [React 19](https://react.dev/)                |
| 样式 | [Tailwind CSS 3](https://tailwindcss.com/)    |
| 搜索 | [Fuse.js](https://www.fusejs.io/)             |
| 内容 | Markdown + Astro Content Collections          |
| 评论 | [Twikoo](https://twikoo.js.org/)              |
| 部署 | GitHub Actions + GitHub Pages                 |

具体版本以 [`package.json`](package.json) 和 [`package-lock.json`](package-lock.json) 为准。

## 快速开始

### 环境要求

- Node.js 20 或更高版本
- npm

### 本地运行

```bash
git clone https://github.com/crazylxr/crazylxr.github.io.git
cd crazylxr.github.io
npm ci
npm run dev
```

启动后访问 <http://localhost:4321>。

提交变更前，建议执行完整检查：

```bash
npm test
npm run lint
npm run format:check
npm run build
```

## 内容维护

### 新建文章

在 `src/content/blog/` 的对应分类或年份目录中创建 Markdown 文件：

```markdown
---
title: "文章标题"
date: 2026-08-31 10:00:00
author: "桃翁"
description: "用于文章列表与 SEO 的简短摘要"
featured: false
draft: false
tags:
  - Astro
  - 前端
---

从这里开始写正文。
```

字段说明：

| 字段          | 是否必填 | 说明                         |
| ------------- | -------- | ---------------------------- |
| `title`       | 是       | 文章标题                     |
| `date`        | 是       | 发布时间                     |
| `author`      | 否       | 作者名称                     |
| `description` | 否       | 文章摘要，用于列表展示和 SEO |
| `postSlug`    | 否       | 自定义文章 URL 标识          |
| `featured`    | 否       | 是否作为精选文章展示         |
| `draft`       | 否       | 是否为草稿                   |
| `tags`        | 否       | 标签列表，默认值为 `others`  |
| `ogImage`     | 否       | 自定义社交分享图片           |

字段约束定义在 [`src/content/_schemas.ts`](src/content/_schemas.ts)。文章目前按年份和内容类型组织：

```text
src/content/blog/
├── 2022/ ... 2026/   # 按年份归档
├── 基础教程/
├── 技术/
├── 桃园周刊/
├── 笔记本/
├── 观点与感想/
└── 译文/
```

### 维护 AI 工具导航

- `src/data/ai-config.json`：需要收录的 AI 工具名称
- `src/data/ai.json`：页面使用的完整工具数据
- `scripts/update-ai-icons.js`：抓取并更新工具信息的脚本

更新数据：

```bash
node scripts/update-ai-icons.js
```

详细说明见 [`scripts/README.md`](scripts/README.md)。

### 从 Notion 同步文章

本地创建 `.env` 并配置以下变量：

```dotenv
NOTION_TOKEN=your_notion_token
NOTION_DATABASE_ID=your_database_id
```

然后运行：

```bash
npm run sync:notion
```

GitHub Actions 也会每 6 小时执行一次同步。完整配置步骤和字段映射见 [`docs/NOTION_SYNC_GUIDE.md`](docs/NOTION_SYNC_GUIDE.md)。请勿提交 `.env` 或任何真实密钥。

## 常用命令

| 命令                   | 用途                     |
| ---------------------- | ------------------------ |
| `npm run dev`          | 启动本地开发服务器       |
| `npm run build`        | 构建生产版本到 `dist/`   |
| `npm run preview`      | 预览生产构建结果         |
| `npm test`             | 运行 Markdown 渲染测试   |
| `npm run sync`         | 生成 Astro 类型定义      |
| `npm run sync:notion`  | 从 Notion 同步文章       |
| `npm run lint`         | 执行 ESLint 检查         |
| `npm run format:check` | 检查代码格式             |
| `npm run format`       | 使用 Prettier 格式化代码 |
| `npm run cz`           | 使用 Commitizen 创建提交 |

## 目录结构

```text
.
├── public/                 # 静态资源
├── scripts/                # 内容同步及数据维护脚本
├── src/
│   ├── components/        # Astro / React 组件
│   ├── content/blog/      # Markdown 文章
│   ├── data/              # AI 导航等结构化数据
│   ├── layouts/           # 页面布局
│   ├── pages/             # 文件路由
│   ├── styles/            # 全局样式
│   ├── utils/             # 通用工具
│   └── config.ts          # 网站与社交链接配置
├── tests/                  # 自动化测试
├── astro.config.mjs       # Astro 配置
└── tailwind.config.cjs    # Tailwind CSS 配置
```

## 配置与部署

网站标题、作者、描述、分页数量和社交链接集中在 [`src/config.ts`](src/config.ts) 中维护。

推送到 `master` 分支后，[`deploy.yml`](.github/workflows/deploy.yml) 会自动安装依赖、执行生产构建，并把 `dist/` 发布到 GitHub Pages。Notion 同步由独立的 [`sync-content.yml`](.github/workflows/sync-content.yml) 工作流负责。

## 致谢

- [AstroPaper](https://github.com/satnaing/astro-paper) 提供了项目的主题基础
- [Astro](https://astro.build/) 提供了优秀的内容型网站开发体验

## License

本项目基于 [MIT License](LICENSE) 开源。

---

<div align="center">

Made with ❤️ by [桃翁](https://github.com/crazylxr)

</div>
