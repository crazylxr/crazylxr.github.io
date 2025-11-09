# AI 工具数据自动更新

## 简介

这个脚本可以从 https://ai-bot.cn 自动获取 AI 工具的完整信息，包括标题、分类、描述、图标和跳转链接。你只需要在配置文件中列出工具名称即可。

## 使用方法

### 1. 配置需要的 AI 工具

编辑 `src/data/ai-config.json` 文件，添加你想要收录的 AI 工具名称：

```json
[
  "ChatGPT",
  "Claude",
  "Gemini",
  "豆包",
  "文心一言"
]
```

### 2. 运行更新脚本

```bash
node scripts/update-ai-icons.js
```

脚本会自动：
- 从 ai-bot.cn 抓取所有 AI 工具信息
- 匹配你配置的工具名称
- 获取每个工具的详细信息（分类、描述、官网链接）
- 下载图标地址
- 自动生成相关标签
- 更新 `src/data/ai.json` 文件

### 3. 查看结果

更新后的数据会保存在 `src/data/ai.json`，包含完整的工具信息：

```json
[
  {
    "title": "ChatGPT",
    "category": "AI聊天助手",
    "description": "OpenAI推出的AI聊天机器人...",
    "href": "https://chat.openai.com/",
    "icon": "https://ai-bot.cn/wp-content/uploads/xxx.png",
    "tags": ["chat", "assistant", "llm"]
  }
]
```

## 文件说明

- **`src/data/ai-config.json`** - 配置文件，只需列出工具名称
- **`src/data/ai.json`** - 生成的完整数据文件
- **`scripts/update-ai-icons.js`** - 自动更新脚本

## 优势

✅ **配置简单** - 只需写工具名称，无需手动填写其他信息  
✅ **自动更新** - 所有信息从源网站自动获取  
✅ **数据完整** - 包含分类、描述、链接、图标等完整信息  
✅ **智能匹配** - 支持中英文名称、模糊匹配  
✅ **自动标签** - 根据内容自动生成相关标签

## 注意事项

- 脚本运行可能需要几分钟，因为需要访问多个详情页
- 如果某个工具名称无法匹配，请尝试使用更准确的名称
- 建议定期运行脚本保持数据最新
