# 🖼️ Notion 图片问题 - 快速解决方案

## 问题

从 Notion 同步的图片无法访问：
```
AccessDenied - The document tree is shown below
```

## 原因

Notion 图片 URL 是私有的、有时效的预签名链接，1-2 小时后会失效。

## ✅ 已解决

已更新同步脚本自动处理：

### 做了什么
1. ✅ **自动下载** Notion 中的所有图片
2. ✅ **本地保存** 到 `/public/assets/notion-images/`
3. ✅ **自动替换** Markdown 中的链接为本地路径
4. ✅ **加入 .gitignore** 避免提交大量文件

### 工作流
```
Notion 图片 (会过期)
    ↓
自动下载到本地
    ↓
永久保存在网站
    ↓
网站加载本地图片 ✅
```

## 使用

直接运行同步命令，脚本自动处理所有图片：

```bash
npm run sync:notion
```

日志会显示：
```
📄 处理文章: 你的文章
  🔄 处理文章中的图片...
  ⬇️  下载图片: https://...
  ✅ 图片已保存: /assets/notion-images/da0e3143.png
✅ 同步成功
```

## 技术细节

| 功能 | 说明 |
|-----|------|
| **下载** | 支持 HTTP/HTTPS，包含超时控制 |
| **去重** | 使用 URL 哈希避免重复下载 |
| **格式** | 保留原始图片格式（PNG, JPG 等） |
| **链接** | 将 S3/Notion CDN 链接替换为本地相对路径 |
| **存储** | 图片保存在 `public/assets/notion-images/` |

## 结果

✅ 图片永久可用  
✅ 不依赖 Notion CDN  
✅ 加快网站加载  
✅ 完全自动化  

## 相关文件

- 📝 详细说明：`docs/NOTION_IMAGE_FIX.md`
- 🔧 同步脚本：`scripts/sync-from-notion.js`
- 📋 同步指南：`docs/NOTION_SYNC_GUIDE.md`

---

**现在就可以继续使用 Notion 发布文章，图片会自动处理！** 🚀

