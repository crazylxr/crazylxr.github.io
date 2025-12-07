# Notion 图片访问问题解决方案

## 问题描述

当从 Notion 同步文章到网站时，图片显示失败，返回 `AccessDenied` 错误：

```xml
<Error>
  <Code>AccessDenied</Code>
  <Message>Access Denied</Message>
</Error>
```

### 根本原因

- **Notion 内部图片链接有时效限制**，通常仅有效 1-2 小时
- Notion 使用私有的 AWS S3 预签名 URL
- 超时后链接会失效，返回访问拒绝错误
- 即使链接有效，也容易被 IP 限制或速率限制

## 解决方案

已在同步脚本中实现了**自动图片下载和本地化**功能。

### 工作原理

```
┌─────────────────┐
│  Notion Database │
└────────┬────────┘
         │
         ├─ 提取 Markdown 内容
         ├─ 识别图片 URL（S3, Notion CDN）
         │
         ▼
  ┌──────────────┐
  │ 下载图片      │
  └──────┬───────┘
         │
         ▼
  ┌──────────────────────────────┐
  │ 保存到 /public/assets/        │
  │ notion-images/               │
  └──────┬───────────────────────┘
         │
         ▼
  ┌──────────────────────────────┐
  │ 替换 Markdown 中的图片链接   │
  │ 为本地路径                    │
  └──────┬───────────────────────┘
         │
         ▼
  ┌──────────────────────────────┐
  │ 保存完整的 Markdown 文件      │
  │ 到 src/content/blog/         │
  └──────────────────────────────┘
```

### 技术实现

#### 关键函数

**1. `downloadImage(url)` - 下载图片**
- 支持 HTTP 和 HTTPS 协议
- 包含超时控制（10 秒）
- 添加 User-Agent 头，避免被 CDN 拒绝

**2. `generateSafeFileName(url)` - 生成文件名**
- 使用 URL 的 MD5 哈希作为唯一标识（8 位）
- 保留原始文件扩展名（.png, .jpg 等）
- 避免文件名冲突

**3. `saveImage(url)` - 保存图片**
- 检查文件是否已存在（避免重复下载）
- 第一次同步会下载所有图片
- 后续同步会跳过已存在的文件，加快速度

**4. `replaceNotionImages(content)` - 替换链接**
- 使用正则表达式匹配 Markdown 图片语法：`![alt](url)`
- 识别 Notion 来源的 URL：
  - amazonaws.com（AWS S3）
  - notion（Notion 官方 CDN）
  - s3（其他 S3 服务）
- 将 URL 替换为本地相对路径

#### 文件存储结构

```
public/
└── assets/
    └── notion-images/
        ├── da0e3143.png       # URL: https://...image.png
        ├── f2b4c891.jpg       # URL: https://...image.jpg
        └── ...
```

> **注意**：`public/assets/notion-images/` 已添加到 `.gitignore`，避免提交大量图片文件到 Git 仓库

## 使用说明

### 自动执行

运行同步命令时自动处理图片：

```bash
npm run sync:notion
```

脚本会输出类似这样的日志：

```
📄 处理文章: 我的文章标题
  🔄 处理文章中的图片...
  ⬇️  下载图片: https://prod-files-secure.s3.us-west-2.amazonaws.com/...
  ✅ 图片已保存: /assets/notion-images/da0e3143.png
✅ 同步成功: 我的文章标题 -> 2025-12-07-my-post.md
```

### GitHub Actions 自动同步

在 GitHub Actions 工作流中也会自动处理：

- 提交的 Markdown 文件中图片已替换为本地路径
- 图片文件保存在工作区的 `public/assets/notion-images/`
- 部署时 Vercel 会自动服务这些图片

### 部署到生产环境

#### 方案 A：使用本地图片（推荐）

无需额外配置，部署到 Vercel 时：

1. `public/assets/notion-images/` 中的文件会自动复制到 CDN
2. 网站用户可以直接访问这些文件
3. 优势：完全独立，不依赖 Notion 或 AWS

#### 方案 B：上传到外部 CDN（可选）

如果想减少仓库大小，可以在同步脚本中添加上传到 CDN 的逻辑：

```javascript
// 伪代码示例
const localPath = await saveImage(url);
const cdnUrl = await uploadToCDN(localPath);  // 上传到 Cloudinary 等
const markdownWithCdnUrl = imageUrl.replace(url, cdnUrl);
```

支持的 CDN 服务：
- Cloudinary
- 七牛云
- 腾讯云 COS
- 阿里云 OSS

## 常见问题

### Q: 图片下载失败怎么办？

**A:** 脚本会自动降级处理：
- 如果图片下载失败，会保留原始 URL
- 文章仍会正常同步
- 会输出错误日志便于调试

检查日志中的错误信息：

```bash
npm run sync:notion 2>&1 | grep "❌"
```

### Q: 下载速度很慢怎么办？

**A:** 这是正常的，可以通过以下方式优化：

1. **首次同步最慢**（需要下载所有图片）
2. **后续同步会跳过已存在的文件**
3. 如果有超大图片，可以：
   - 在 Notion 中压缩图片
   - 在同步脚本中添加图片压缩逻辑
   - 使用 CDN 托管而不是本地存储

### Q: 如何强制重新下载所有图片？

**A:** 删除本地图片后重新同步：

```bash
rm -rf public/assets/notion-images/
npm run sync:notion
```

### Q: 图片大小会不会很大？

**A:** 取决于 Notion 中的图片数量和尺寸。

**监控大小**：

```bash
du -sh public/assets/notion-images/
```

**优化建议**：
- 在 Notion 中使用适当的图片尺寸
- 定期清理不使用的图片
- 考虑使用图片压缩工具

### Q: 支持哪些图片格式？

**A:** 支持所有常见格式：
- PNG
- JPG/JPEG
- GIF
- WebP
- SVG
- 等等

脚本会自动检测并保留原始格式。

### Q: 本地链接会不会影响 SEO？

**A:** 不会，反而更好：
- 搜索引擎能够正常抓取本地图片
- 不依赖外部链接，更稳定可靠
- 图片加载速度可能更快（取决于托管方式）

## 技术细节

### 脚本修改

主文件：`scripts/sync-from-notion.js`

新增内容：
- 图片下载模块
- 链接替换模块
- 错误处理和降级逻辑

### 环境变量

无需添加新的环境变量，现有配置足够：
- `NOTION_TOKEN` - 用于 API 认证
- `NOTION_DATABASE_ID` - 数据库 ID

### 性能影响

- **首次同步**：取决于图片数量和大小（可能 1-5 分钟）
- **增量同步**：仅处理新文章，已存在的图片不重复下载
- **API 调用**：无额外 Notion API 调用

### 内存使用

- 按流式处理下载和保存，不会一次性加载整个文件
- 即使处理大图片也不会导致内存溢出

## 故障排查

### 常见错误

**错误 1：HTTP 403 Forbidden**
```
❌ 图片下载失败: HTTP 403: https://...
```
- 原因：AWS S3 链接已过期或被限制
- 解决：这正是脚本设计来解决的问题！确保脚本正在运行

**错误 2：Connection Timeout**
```
❌ 图片下载失败: Error: socket hang up
```
- 原因：网络连接问题或 CDN 服务器无响应
- 解决：检查网络连接，稍后重试

**错误 3：文件系统权限**
```
❌ 图片下载失败: EACCES: permission denied
```
- 原因：没有权限写入 `public/assets/notion-images/`
- 解决：检查文件权限：`chmod 755 public/assets/`

### 调试模式

添加更详细的日志输出：

编辑 `scripts/sync-from-notion.js`，在 `downloadImage` 函数中添加：

```javascript
console.log(`  📊 图片大小: ${imageBuffer.length} bytes`);
```

## 总结

✅ **已解决的问题**：
- Notion 图片链接过期导致的 AccessDenied 错误
- 图片在生产环境中无法访问
- 依赖 Notion 图片 CDN 的稳定性问题

✅ **优势**：
- 完全自动化，无需手动处理
- 图片永久保存在网站仓库中
- 加快网站加载速度
- 不依赖外部服务

🚀 **下次同步**时新上传的图片会自动处理，无需任何额外操作！

