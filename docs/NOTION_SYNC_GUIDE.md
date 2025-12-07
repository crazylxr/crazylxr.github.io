# Notion 文章同步使用指南

本项目已配置从 Notion Database 自动同步文章内容到博客。

## 📋 目录

- [前置准备](#前置准备)
- [配置步骤](#配置步骤)
- [Notion Database 设置](#notion-database-设置)
- [本地测试](#本地测试)
- [GitHub Actions 配置](#github-actions-配置)
- [使用说明](#使用说明)
- [常见问题](#常见问题)

---

## 🎯 前置准备

### 1. 创建 Notion Integration

1. 访问 [Notion Integrations](https://www.notion.so/my-integrations)
2. 点击 **"+ New integration"**
3. 填写以下信息：
   - **Name**: 博客内容同步（或任意名称）
   - **Associated workspace**: 选择你的工作区
   - **Type**: Internal
4. 点击 **"Submit"** 创建
5. 复制 **Internal Integration Token**（格式：`secret_xxxx...`）

### 2. 创建 Notion Database

在 Notion 中创建一个 Database，包含以下属性（字段）：

| 属性名称 | 类型 | 必填 | 说明 |
|---------|------|------|------|
| **Title** 或 **Name** | Title | ✅ | 文章标题 |
| **Description** | Text | ⭕ | 文章描述/摘要 |
| **PublishDate** | Date | ⭕ | 发布日期（默认使用创建时间） |
| **Tags** | Multi-select | ⭕ | 文章标签 |
| **Status** | Select | ⭕ | 状态（Draft/Published） |
| **Featured** | Checkbox | ⭕ | 是否精选 |
| **Author** | Text 或 Person | ⭕ | 作者 |
| **Slug** | Text | ⭕ | 自定义 URL slug |
| **OGImage** | URL 或 Files | ⭕ | 分享图片 |
| **CanonicalURL** | URL | ⭕ | 规范链接 |

> **注意**: 字段名称需要与上表**完全一致**（区分大小写），或根据需要修改脚本中的字段映射。

### 3. 连接 Integration 到 Database

1. 打开你创建的 Notion Database 页面
2. 点击右上角 **"..."** 菜单
3. 选择 **"Add connections"**
4. 找到并选择你创建的 Integration
5. 点击 **"Confirm"**

### 4. 获取 Database ID

1. 打开 Notion Database 页面
2. 点击右上角 **"Share"** 或复制页面链接
3. 链接格式如下：
   ```
   https://www.notion.so/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx?v=...
   ```
4. 其中 `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` 就是你的 **Database ID**（32位字符）

---

## ⚙️ 配置步骤

### 本地配置

1. **安装依赖**
   ```bash
   npm install
   ```

2. **创建环境变量文件**
   ```bash
   cp .env.example .env.local
   ```

3. **编辑 `.env.local`**
   ```env
   NOTION_TOKEN=secret_你的Token
   NOTION_DATABASE_ID=你的DatabaseID
   ```

### GitHub 配置

1. **打开你的 GitHub 仓库**
2. 进入 **Settings** → **Secrets and variables** → **Actions**
3. 点击 **"New repository secret"**，添加以下 secrets：

   | Name | Value |
   |------|-------|
   | `NOTION_TOKEN` | 你的 Notion Integration Token |
   | `NOTION_DATABASE_ID` | 你的 Database ID |

---

## 📝 Notion Database 设置

### 字段详细说明

#### 必填字段
- **Title/Name**: 文章标题，会显示在博客首页和文章页

#### 可选字段
- **Description**: 文章简介，显示在列表页和 SEO meta
- **PublishDate**: 发布日期，影响文章排序和归档目录（如 `2024/`）
- **Tags**: 标签，多选，用于文章分类
- **Status**: 
  - `Draft`: 草稿，不会同步
  - `Published`: 已发布，会同步到博客
- **Featured**: 勾选后会在首页置顶或高亮显示
- **Author**: 作者名称
- **Slug**: 自定义 URL，如 `my-awesome-post`（不填则自动生成）
- **OGImage**: 分享图片 URL
- **CanonicalURL**: 原文链接（如果是转载）

### 文章内容编写

在 Notion Database 的每一行点击打开，即可编写文章正文。支持：

- ✅ 标题（H1-H6）
- ✅ 段落文本
- ✅ 列表（有序/无序）
- ✅ 代码块
- ✅ 引用
- ✅ 图片
- ✅ 链接
- ✅ 表格
- ✅ 分隔线

---

## 🧪 本地测试

### 手动同步测试

```bash
npm run sync:notion
```

执行后会：
1. 连接 Notion API
2. 获取所有文章
3. 转换为 Markdown
4. 保存到 `src/content/blog/年份/` 目录

### 查看生成的文件

```bash
ls -la src/content/blog/2024/
```

### 本地预览博客

```bash
npm run dev
```

访问 `http://localhost:4321` 查看效果。

---

## 🤖 GitHub Actions 配置

已创建自动化工作流：`.github/workflows/sync-content.yml`

### 触发方式

1. **定时触发**: 每 6 小时自动同步一次
2. **手动触发**: 
   - 进入仓库的 **Actions** 标签
   - 选择 **"Sync Content from Notion"**
   - 点击 **"Run workflow"**
3. **脚本变更触发**: 当同步脚本或工作流文件变更时

### 工作流程

```
触发 → 拉取代码 → 安装依赖 → 同步 Notion → 检查变更 → 提交 → 推送 → Vercel 部署
```

### 查看同步日志

1. 进入仓库的 **Actions** 标签
2. 点击最近的 **"Sync Content from Notion"** 运行记录
3. 查看各步骤的日志输出

---

## 📖 使用说明

### 发布新文章

1. 在 Notion Database 中点击 **"New"** 创建新行
2. 填写标题、标签等字段
3. 点击打开编写文章内容
4. 将 **Status** 设置为 **"Published"**
5. 等待自动同步（最长 6 小时）或手动触发 GitHub Actions

### 更新文章

1. 在 Notion 中找到对应文章
2. 修改内容或字段
3. 保存（Notion 自动保存）
4. 等待下次同步

### 删除文章

方式一（推荐）：
1. 将 **Status** 改为 **"Draft"**
2. 下次同步时会跳过该文章

方式二：
1. 直接删除 Notion 中的行
2. 手动删除 `src/content/blog/` 中对应的 `.md` 文件

### 文件命名规则

生成的文件名格式：
```
YYYY-MM-DD-slug.md
```

示例：
- `2024-12-07-my-first-post.md`
- `2024-12-08-notion-sync-guide.md`

文件会按年份自动归档到对应目录：
```
src/content/blog/
  ├── 2023/
  ├── 2024/
  └── 2025/
```

---

## ❓ 常见问题

### 1. 同步失败，提示 "unauthorized"

**原因**: Integration 没有权限访问 Database

**解决**:
1. 打开 Notion Database 页面
2. 点击右上角 **"..."** → **"Add connections"**
3. 选择你的 Integration

### 2. 某些文章没有同步

**可能原因**:
- Status 字段为 "Draft"
- Database 没有连接 Integration
- 文章在 Notion 中被删除

### 3. 图片无法显示

**原因**: Notion 内部图片链接有时效限制

**建议**:
- 使用外部图床（如 Cloudinary, 七牛云, 腾讯云 COS）
- 或在同步脚本中添加图片下载逻辑

### 4. 修改同步频率

编辑 `.github/workflows/sync-content.yml`:

```yaml
schedule:
  - cron: '0 */6 * * *'  # 改为你想要的频率
```

常用 cron 表达式：
- 每小时: `0 * * * *`
- 每 3 小时: `0 */3 * * *`
- 每天凌晨: `0 0 * * *`
- 每周一: `0 0 * * 1`

### 5. 自定义字段映射

如果你的 Notion Database 字段名称不同，需要修改 `scripts/sync-from-notion.js` 中的 `extractProperties` 函数。

例如，如果你的标题字段叫 "标题" 而不是 "Title"：

```javascript
title: props.标题?.title?.[0]?.plain_text || 'Untitled',
```

---

## 🔧 进阶配置

### 增量同步

当前脚本会同步所有文章。如需只同步更新的文章，可以：

1. 记录上次同步时间
2. 使用 Notion API 的 filter 参数过滤

### 图片本地化

在 `syncPost` 函数中添加图片下载逻辑：

```javascript
// 下载 Notion 图片到 public/assets/
// 替换 Markdown 中的图片链接
```

### Webhook 触发

如需实时同步，可以：
1. 使用 Notion API 的 webhook（需第三方服务如 Zapier）
2. 或使用 GitHub webhook 触发 Actions

---

## 📚 相关链接

- [Notion API 文档](https://developers.notion.com/)
- [notion-to-md 文档](https://github.com/souvikinator/notion-to-md)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)

---

## 💬 需要帮助？

如遇到问题，可以：
1. 查看 GitHub Actions 的运行日志
2. 检查 Notion Integration 权限
3. 验证环境变量配置
4. 提交 Issue 到仓库

---

祝你使用愉快！🎉
