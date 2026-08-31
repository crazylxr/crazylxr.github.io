const https = require('https');
const fs = require('fs');
const path = require('path');

// 读取配置文件
const configPath = path.join(__dirname, '../src/data/ai-config.json');
const aiJsonPath = path.join(__dirname, '../src/data/ai.json');

// 获取网页内容
function fetchPage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve(data);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// 从 HTML 中提取所有 AI 工具信息
function extractAiToolsFromHtml(html) {
  const tools = [];
  
  // 直接从 a 标签中提取信息
  // 格式: <a href="https://ai-bot.cn/sites/4189.html" ... title="描述">
  //       ... <img ... alt="工具名" />
  const regex = /<a\s+href="(https:\/\/ai-bot\.cn\/sites\/\d+\.html)"[^>]+title="([^"]*)"[^>]*>([\s\S]{0,500}?)<img[^>]+src="([^"]+)"[^>]+alt="([^"]+)"/gi;
  
  let match;
  while ((match = regex.exec(html)) !== null) {
    const detailUrl = match[1];
    const description = match[2].trim();
    const iconUrl = match[4];
    const title = match[5].trim();
    
    const fullIconUrl = iconUrl.startsWith('http') ? iconUrl : `https://ai-bot.cn${iconUrl}`;
    
    tools.push({
      title: title,
      category: '', // 分类后面从详情页获取
      description: description || `${title}`,
      detailUrl: detailUrl,
      icon: fullIconUrl
    });
  }
  
  console.log(`  调试: 提取到的前5个工具:`);
  tools.slice(0, 5).forEach(t => console.log(`    - ${t.title}`));
  
  return tools;
}

// 根据工具名称和描述智能判断分类
function smartCategoryDetection(title, description) {
  const titleLower = title.toLowerCase();
  const text = `${title} ${description}`.toLowerCase();
  
  // 先检查工具名称的精确匹配（最高优先级）
  const exactMatches = {
    'chatgpt': 'AI聊天助手',
    'claude': 'AI聊天助手',
    'gemini': 'AI聊天助手',
    'bard': 'AI聊天助手',
    '豆包': 'AI聊天助手',
    '文心一言': 'AI聊天助手',
    '文心': 'AI聊天助手',
    '通义千问': 'AI聊天助手',
    '通义': 'AI聊天助手',
    '讯飞星火': 'AI聊天助手',
    'copilot': 'AI编程工具',
    'cursor': 'AI编程工具',
    'dalle': 'AI图像工具',
    'dall·e': 'AI图像工具',
    'midjourney': 'AI图像工具',
    'stable diffusion': 'AI图像工具',
    'suno': 'AI音频工具',
    '即梦': 'AI视频工具',
    '剪映': 'AI视频工具',
    'hugging face': 'AI训练模型',
    'replicate': 'AI训练模型',
  };
  
  for (const [key, category] of Object.entries(exactMatches)) {
    if (titleLower.includes(key)) {
      return category;
    }
  }
  
  // 分类关键词映射（按优先级排序，更具体的放前面）
  const categoryMap = {
    'AI图像工具': ['图像生成', '图片生成', 'image生成', '绘画', '绘图', 'ai图', 'ai绘', '文生图', 'text-to-image', '图像合成'],
    'AI视频工具': ['视频生成', '视频创作', 'video生成', 'ai视频', '影像', '短视频'],
    'AI音频工具': ['音频', 'audio', '音乐', 'music', '配音', '声音', 'voice', '歌曲'],
    'AI编程工具': ['编程', 'code', '代码', 'coding', '开发', 'dev', 'ide', '程序', '代码编辑'],
    'AI写作工具': ['写作', 'writing', '文本生成', '文章生成', '内容创作', '笔灵', '蛙蛙写作'],
    'AI办公工具': ['office', '办公', 'ppt', '表格', '文档', 'excel', 'word', '演示'],
    'AI搜索引擎': ['搜索', 'search', '检索', 'perplexity', '秘塔'],
    'AI训练模型': ['模型', 'model hub', 'api平台', 'llm框架'],
    'AI聊天助手': ['聊天', 'chat', '对话', '助手', 'bot', '智能助手', '问答'],
  };
  
  for (const [category, keywords] of Object.entries(categoryMap)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return category;
    }
  }
  
  return 'AI工具';
}

// 从详情页获取完整信息
async function getToolDetails(detailUrl, toolName) {
  try {
    console.log(`  正在获取 ${toolName} 的详情...`);
    const html = await fetchPage(detailUrl);
    
    // 提取描述
    let description = '';
    const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) ||
                     html.match(/<p[^>]*class=["'][^"']*excerpt[^"']*["'][^>]*>([^<]+)</i) ||
                     html.match(/<div[^>]*class=["'][^"']*desc[^"']*["'][^>]*>([^<]+)</i);
    
    if (descMatch) {
      description = descMatch[1].trim().replace(/&nbsp;/g, ' ').substring(0, 200);
    }
    
    // 使用智能分类检测
    const category = smartCategoryDetection(toolName, description);
    
    // 先尝试从预设列表获取官网（最可靠）
    const commonUrls = {
      'chatgpt': 'https://chat.openai.com/',
      'claude': 'https://claude.ai/',
      'gemini': 'https://gemini.google.com/',
      'copilot': 'https://copilot.microsoft.com/',
      'cursor': 'https://www.cursor.com/',
      '豆包': 'https://doubao.com/',
      '文心一言': 'https://yiyan.baidu.com/',
      '讯飞星火': 'https://xinghuo.xfyun.cn/',
      '通义': 'https://tongyi.aliyun.com/',
      'dall': 'https://openai.com/dall-e',
      'midjourney': 'https://www.midjourney.com/',
      'stable diffusion': 'https://stability.ai/',
      'suno': 'https://suno.ai/',
      '即梦': 'https://jimeng.jianying.com/',
      'hugging face': 'https://huggingface.co/',
      '剪映': 'https://www.capcut.cn/',
    };
    
    let href = detailUrl;
    const toolLower = toolName.toLowerCase();
    
    // 先检查预设列表
    for (const [key, url] of Object.entries(commonUrls)) {
      if (toolLower.includes(key)) {
        href = url;
        console.log(`  ├─ 官网链接(预设): ${href}`);
        break;
      }
    }
    
    // 如果预设列表中没有，再尝试从详情页提取
    if (href === detailUrl) {
      // 要排除的域名和路径模式
      const excludedDomains = [
        'ai-bot.cn',
        'bing.com',
        'google.com',
        'baidu.com',
        'ai-w3cschool.com',
        'd.design',
        'ghxi.com',
        'aisharenet.com',
        'gongke.net',
        'yjpoo.com',
        'ugapk.cn',
        'beian.miit.gov.cn',
        'apple.com/cn/app',  // App Store链接
        '.exe',
        '.apk',
        '.dmg',
      ];
      
      const shouldExclude = (url) => {
        const urlLower = url.toLowerCase();
        return excludedDomains.some(domain => urlLower.includes(domain));
      };
      
      // 提取所有外部链接
      const allLinks = html.match(/<a[^>]+href=["'](https?:\/\/[^"']+)["']/gi);
      if (allLinks) {
        const validLinks = [];
        
        for (const linkTag of allLinks) {
          const linkMatch = linkTag.match(/href=["']([^"']+)["']/i);
          if (linkMatch) {
            const link = linkMatch[1];
            if (!shouldExclude(link)) {
              validLinks.push(link);
            }
          }
        }
        
        if (validLinks.length > 0) {
          console.log(`  ├─ 找到 ${validLinks.length} 个有效外部链接`);
          
          // 尝试匹配包含工具名的链接
          const toolNameClean = toolName.toLowerCase()
            .replace(/\s+/g, '')
            .replace(/[·\-_]/g, '')
            .replace(/ai$/, '')
            .replace(/^ai/, '');
          
          for (const link of validLinks) {
            const linkDomain = link.match(/https?:\/\/(?:www\.)?([^/]+)/);
            
            if (linkDomain) {
              const domain = linkDomain[1].toLowerCase();
              
              if (toolNameClean.length >= 3) {
                const searchTerm = toolNameClean.substring(0, Math.min(8, toolNameClean.length));
                if (domain.includes(searchTerm)) {
                  href = link;
                  console.log(`  ├─ 官网链接(匹配域名): ${href}`);
                  break;
                }
              }
            }
          }
          
          // 如果没有找到匹配的，使用第一个有效链接
          if (href === detailUrl) {
            href = validLinks[0];
            console.log(`  ├─ 官网链接(首个有效): ${href}`);
          }
        }
      }
    }
    
    // 最后如果还是详情页，输出警告
    if (href === detailUrl) {
      console.log(`  ⚠ 未能提取官网链接，使用详情页`);
    }
    
    return { category, description, href };
  } catch (error) {
    console.log(`  ⚠ 获取详情失败: ${error.message}`);
    return {
      category: smartCategoryDetection(toolName, ''),
      description: `${toolName} AI工具`,
      href: detailUrl
    };
  }
}

// 生成标签
function generateTags(title, category, description) {
  const tags = [];
  const text = `${title} ${category} ${description}`.toLowerCase();
  
  const tagMap = {
    'chat': ['聊天', 'chat', '对话', '助手', '机器人'],
    'image': ['图像', '图片', 'image', '绘画', '设计'],
    'video': ['视频', 'video'],
    'audio': ['音频', 'audio', '音乐', '配音', '声音'],
    'code': ['编程', 'code', '代码', 'coding', '开发'],
    'writing': ['写作', 'writing', '文本', '文章'],
    'search': ['搜索', 'search'],
    'model': ['模型', 'model', 'llm', '大模型'],
    'office': ['办公', 'office', 'ppt', '表格', '文档'],
  };
  
  for (const [tag, keywords] of Object.entries(tagMap)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      tags.push(tag);
    }
  }
  
  return tags.length > 0 ? tags.slice(0, 3) : ['ai'];
}

// 主函数
async function updateAiData() {
  console.log('📖 读取配置文件...');
  const configNames = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  console.log(`配置了 ${configNames.length} 个 AI 工具`);
  
  console.log('\n🌐 正在从 https://ai-bot.cn 获取页面内容...');
  const html = await fetchPage('https://ai-bot.cn');
  console.log('✓ 页面内容获取成功！');
  
  console.log('\n🔍 正在提取 AI 工具信息...');
  const allTools = extractAiToolsFromHtml(html);
  console.log(`✓ 提取到 ${allTools.length} 个 AI 工具信息`);
  
  console.log('\n📝 正在匹配和获取详细信息...\n');
  const aiData = [];
  
  for (const configName of configNames) {
    // 查找匹配的工具
    const tool = allTools.find(t => {
      const tLower = t.title.toLowerCase();
      const cLower = configName.toLowerCase();
      return tLower === cLower || 
             tLower.includes(cLower) || 
             cLower.includes(tLower) ||
             tLower.replace(/\s+/g, '') === cLower.replace(/\s+/g, '');
    });
    
    if (tool) {
      console.log(`✓ 找到匹配: ${configName} -> ${tool.title}`);
      
      // 获取详细信息
      const details = await getToolDetails(tool.detailUrl, tool.title);
      
      // 生成标签
      const tags = generateTags(tool.title, details.category, details.description || tool.description);
      
      aiData.push({
        title: tool.title,
        category: details.category,
        description: details.description || tool.description,
        href: details.href,
        icon: tool.icon,
        tags: tags
      });
      
      console.log(`  ├─ 分类: ${details.category}`);
      console.log(`  ├─ 描述: ${(details.description || tool.description).substring(0, 50)}...`);
      console.log(`  ├─ 链接: ${details.href}`);
      console.log(`  └─ 标签: ${tags.join(', ')}\n`);
      
      // 添加延迟避免请求过快
      await new Promise(resolve => setTimeout(resolve, 500));
    } else {
      console.log(`✗ 未找到匹配: ${configName}\n`);
    }
  }
  
  // 保存到 ai.json
  fs.writeFileSync(aiJsonPath, JSON.stringify(aiData, null, 2), 'utf-8');
  
  console.log(`\n✅ 完成！成功更新 ${aiData.length}/${configNames.length} 个 AI 工具`);
  console.log(`📄 已保存到: ${aiJsonPath}`);
}

// 运行
updateAiData().catch(error => {
  console.error('❌ 错误:', error.message);
  console.error(error.stack);
  process.exit(1);
});
