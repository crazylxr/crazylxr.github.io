# Repository Guidelines

## 项目结构与模块组织

本仓库是基于 Astro 5 的静态博客。页面路由位于 `src/pages/`，共享布局与组件分别放在 `src/layouts/`、`src/components/`；通用逻辑放在 `src/utils/`，全局样式位于 `src/styles/base.css`。文章使用 Markdown，统一存放于 `src/content/blog/`，其 frontmatter 约束由 `src/content/config.ts` 和 `src/content/_schemas.ts` 定义。AI 导航数据位于 `src/data/`，静态图片、字体和浏览器脚本放在 `public/`。自动化脚本位于 `scripts/`，Node 测试位于 `tests/`。

## 构建、测试与本地开发

- `npm ci`：按照 `package-lock.json` 安装可复现依赖。
- `npm run dev`：启动本地开发服务器，默认地址为 `http://localhost:4321`。
- `npm run build`：执行生产构建并输出到 `dist/`；提交前应运行此命令。
- `npm run preview`：本地预览已生成的生产站点。
- `npm test`：运行 `tests/*.test.mjs` 中的 Node 测试。
- `npm run format:check` / `npm run lint`：检查格式与 ESLint 规则；使用 `npm run format` 自动格式化。

## 编码风格与命名规范

遵循 Prettier 配置：2 空格缩进、80 字符行宽、保留分号、LF 换行；Astro 与 Tailwind 插件会处理模板及类名排序。组件文件使用 PascalCase，如 `PostDetails.astro`；工具函数使用 camelCase，如 `getSortedPosts.ts`。页面文件遵循 Astro 路由约定，动态路由使用 `[slug].astro`。新增文章应保持现有目录分类，并提供 `title`、`date` 等必需 frontmatter。

## 测试指南

测试使用 `node:test` 与 `node:assert/strict`，文件命名为 `*.test.mjs`。修改 Markdown 渲染、配置或工具逻辑时，应补充最小回归测试，覆盖可观察输出而非内部实现。仓库暂未设置覆盖率门槛；至少保证 `npm test` 与 `npm run build` 通过。

## 提交与 Pull Request

人工提交沿用 Conventional Commits，例如 `feat: add tag filter`、`fix: render Notion tables`、`content: publish weekly post`；Notion 自动同步提交保留现有 `🔄 自动同步 Notion 内容 - 时间` 格式。PR 应说明目的、主要改动与验证命令，关联相关 issue；涉及页面、样式或响应式布局时附前后截图。保持改动聚焦，不提交 `.env`、密钥、`dist/` 或本地缓存。

## 配置与内容同步

`npm run sync:notion` 依赖本地环境变量。仅提交示例或文档化的变量名，真实凭据保留在未跟踪的 `.env` 中。同步后检查内容差异，避免把非预期删除或草稿状态变更混入提交。
