````markdown
# AI 数据 — 使用说明（中文）

本目录用于存放 `/ai` 页面所需的 AI 工具列表数据与说明文件。

数据文件：`src/data/ai.json`

- 格式：一个 JSON 数组，数组中的每项表示一个工具对象。
- 推荐字段：
  - `title`（字符串）: 显示名称
  - `category`（字符串）: 分类或分组名称（显示时用于分组）
  - `description`（字符串）: 简短描述
  - `href`（字符串）: 工具或服务的链接
  - `icon`（字符串，可选）: 图标 URL（可以是外部 URL，也可以是本地路径）
  - `tags`（字符串数组，可选）: 用于搜索/筛选的关键词标签

如何编辑 / 更新

- 直接编辑 `src/data/ai.json`，添加、修改或删除条目。
- 建议保持条目简洁并使用权威链接（canonical URL）。

可选：迁移到 Astro 的 Content Collection

- 如果希望每条工具成为独立的内容文件（例如用于 CMS 或更细粒度管理），可以将条目拆成单个 markdown/JSON 文件并放入 `src/content/ai/`，同时在页面中使用 `getCollection` 加载。
- 优点：每条可用 frontmatter 管理，便于内容编辑与版本控制。
- 缺点：文件数量会增加，需要为 collection 编写或调整 schema。

图标（icon）处理建议

- 为了提高稳定性、避免外部依赖并利于缓存，推荐将 favicon/图标下载到仓库并使用本地路径（例如：`/assets/ai-icons/<host>.png`）。
- 仓库内提供了一个辅助脚本：`scripts/fetch-ai-icons.sh`（需手动在本机运行，脚本会把图标保存到 `public/assets/ai-icons/`）。

如何使用脚本下载图标（在项目根目录执行）：

```bash
# 赋予执行权限（若尚未设置）
chmod +x scripts/fetch-ai-icons.sh

# 运行脚本（会请求网络并把图标写入 public/assets/ai-icons/）
bash scripts/fetch-ai-icons.sh
```
````

备注与注意事项

- 当前 `/ai` 页面在客户端使用 Fuse.js 做模糊搜索。如果你改变了用于搜索的字段（例如增加 `author` 或 `provider`），请同步更新 `src/pages/ai.astro` 中的 Fuse 配置（keys、权重等）。
- 页面在客户端使用简单的 HTML 插入来做高亮（将匹配文本用 `<mark>` 包裹），若后续数据可能包含不受信任的 HTML，请改用 HTML 转义或更严格的高亮库以避免 XSS 风险。

```

```
