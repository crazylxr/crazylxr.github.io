#!/usr/bin/env node

/**
 * Notion 文章同步脚本
 * 从 Notion Database 同步文章到本地 Markdown 文件
 */

import 'dotenv/config';
import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配置
const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;
const WITHDRAW_PAGE_ID = process.env.WITHDRAW_PAGE_ID;
const OUTPUT_DIR = path.join(__dirname, '../src/content/blog');
const PUBLIC_ASSETS_DIR = path.join(__dirname, '../public/assets/notion-images');
const RELATIVE_ASSETS_PATH = '/assets/notion-images'; // 在 Markdown 中使用的相对路径

// 初始化 Notion 客户端
const notion = new Client({ auth: NOTION_TOKEN });
const n2m = new NotionToMarkdown({ notionClient: notion });

/**
 * 格式化日期为 YYYY-MM-DD
 */
function formatDate(date) {
  if (!date) return new Date().toISOString().split('T')[0];
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

/**
 * 生成文件名（使用日期 + slug）
 */
function generateFileName(title, date, slug) {
  const formattedDate = formatDate(date);
  const safeSlug = (slug || title)
    .toLowerCase()
    .replace(/[^\u4e00-\u9fa5a-z0-9]+/gi, '-')
    .replace(/^-|-$/g, '');
  return `${formattedDate}-${safeSlug}.md`;
}

/**
 * 生成 frontmatter
 */
function generateFrontmatter(properties) {
  const {
    title,
    description,
    pubDatetime,
    author,
    tags,
    draft,
    featured,
    ogImage,
  } = properties;

  let frontmatter = '---\n';
  if (title) frontmatter += `title: "${title.replace(/"/g, '\\"')}"\n`;
  if (description) frontmatter += `description: "${description.replace(/"/g, '\\"')}"\n`;
  if (author) frontmatter += `author: "${author}"\n`;
  if (pubDatetime) frontmatter += `date: ${new Date(pubDatetime).toISOString()}\n`;
  if (tags && tags.length > 0) {
    frontmatter += `tags:\n${tags.map(tag => `  - ${tag}`).join('\n')}\n`;
  }
  if (featured !== undefined) frontmatter += `featured: ${featured}\n`;
  if (draft !== undefined) frontmatter += `draft: ${draft}\n`;
  if (ogImage) frontmatter += `ogImage: "${ogImage}"\n`;
  frontmatter += '---\n\n';

  return frontmatter;
}

/**
 * 从 Notion 属性中提取数据
 */
function extractProperties(page) {
  const props = page.properties;
  
  return {
    title: props.Title?.title?.[0]?.plain_text || props.Name?.title?.[0]?.plain_text || 'Untitled',
    description: props.Description?.rich_text?.[0]?.plain_text || '',
    author: props.Author?.rich_text?.[0]?.plain_text || props.Author?.people?.[0]?.name || '',
    pubDatetime: props.PublishDate?.date?.start || props.Created?.created_time || page.created_time,
    modDatetime: props.UpdatedDate?.date?.start || props.LastEdited?.last_edited_time || page.last_edited_time,
    tags: props.Tags?.multi_select?.map(tag => tag.name) || [],
    draft: props.Status?.select?.name === 'Draft' || props.Draft?.checkbox || false,
    featured: props.Featured?.checkbox || false,
    ogImage: props.OGImage?.url || props.OGImage?.files?.[0]?.file?.url || '',
    canonicalURL: props.CanonicalURL?.url || '',
    slug: props.Slug?.rich_text?.[0]?.plain_text || ''
  };
}

/**
 * 确保目录存在
 */
async function ensureDir(dirPath) {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

/**
 * 读取文件内容，如果不存在则返回 null
 */
async function readFileIfExists(filePath) {
  try {
    return await fs.readFile(filePath, 'utf-8');
  } catch {
    return null;
  }
}

/**
 * 获取年份目录
 */
function getYearDirectory(date, outputDir = OUTPUT_DIR) {
  const year = new Date(date).getFullYear();
  return path.join(outputDir, year.toString());
}

function getPostFilePath(properties, outputDir = OUTPUT_DIR) {
  const yearDir = getYearDirectory(properties.pubDatetime, outputDir);
  const fileName = generateFileName(
    properties.title,
    properties.pubDatetime,
    properties.slug
  );
  return path.join(yearDir, fileName);
}

async function removePublishedPost(properties, outputDir = OUTPUT_DIR) {
  const filePath = getPostFilePath(properties, outputDir);

  try {
    await fs.unlink(filePath);
    console.log(`🗑️  已撤回网站文章: ${path.basename(filePath)}`);
    return { removed: true, title: properties.title, path: filePath };
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(`⏭️  草稿未在网站发布: ${properties.title}`);
      return { skipped: true, title: properties.title };
    }
    throw error;
  }
}

/**
 * 下载图片文件
 */
async function downloadImage(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, { 
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Notion-Sync/1.0)'
      }
    }, async (response) => {
      try {
        // 检查响应状态
        if (response.statusCode !== 200) {
          reject(new Error(`HTTP ${response.statusCode}: ${url}`));
          return;
        }

        const chunks = [];
        response.on('data', chunk => chunks.push(chunk));
        response.on('end', () => {
          resolve(Buffer.concat(chunks));
        });
      } catch (error) {
        reject(error);
      }
    }).on('error', reject);
  });
}

/**
 * 生成安全的文件名
 */
function generateSafeFileName(url) {
  // 从 URL 获取原始文件名或扩展名
  const urlPath = new URL(url).pathname;
  const originalName = path.basename(urlPath).split('?')[0] || 'image';
  
  // 使用 URL 的哈希作为唯一标识符，保留原始扩展名
  const hash = crypto.createHash('md5').update(url).digest('hex').slice(0, 8);
  const ext = path.extname(originalName) || '.jpg';
  
  return `${hash}${ext}`;
}

/**
 * 保存图片到本地
 */
async function saveImage(url) {
  try {
    // 确保资源目录存在
    await ensureDir(PUBLIC_ASSETS_DIR);

    // 生成本地文件名
    const fileName = generateSafeFileName(url);
    const filePath = path.join(PUBLIC_ASSETS_DIR, fileName);

    // 如果文件已存在，直接返回
    try {
      await fs.access(filePath);
      console.log(`  📸 图片已存在: ${RELATIVE_ASSETS_PATH}/${fileName}`);
      return `${RELATIVE_ASSETS_PATH}/${fileName}`;
    } catch {
      // 文件不存在，继续下载
    }

    // 下载图片
    console.log(`  ⬇️  下载图片: ${url.slice(0, 80)}...`);
    const imageBuffer = await downloadImage(url);

    // 保存到本地
    await fs.writeFile(filePath, imageBuffer);
    console.log(`  ✅ 图片已保存: ${RELATIVE_ASSETS_PATH}/${fileName}`);

    return `${RELATIVE_ASSETS_PATH}/${fileName}`;
  } catch (error) {
    console.error(`  ❌ 图片下载失败: ${error.message}`);
    // 返回原始 URL，降级处理
    return url;
  }
}

/**
 * 替换 Markdown 中的 Notion 图片链接为本地链接
 */
async function replaceNotionImages(content) {
  // 匹配 Markdown 中的图片语法: ![alt](url)
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  
  let updatedContent = content;
  const matches = [...content.matchAll(imageRegex)];

  for (const match of matches) {
    const fullMatch = match[0];
    const altText = match[1];
    const imageUrl = match[2];

    // 只处理 Notion 的图片 URL（包含 amazonaws 或 notion 的 CDN）
    if (imageUrl.includes('amazonaws') || imageUrl.includes('notion') || imageUrl.includes('s3')) {
      try {
        const localPath = await saveImage(imageUrl);
        const newImageMarkdown = `![${altText}](${localPath})`;
        updatedContent = updatedContent.replace(fullMatch, newImageMarkdown);
      } catch (error) {
        console.error(`  ❌ 处理图片失败: ${error.message}`);
      }
    }
  }

  return updatedContent;
}

/**
 * 同步单篇文章
 */
async function syncPost(page) {
  try {
    const properties = extractProperties(page);
    
    // 普通同步不处理草稿，撤回由 workflow input 精确指定
    if (properties.draft) {
      console.log(`⏭️  跳过草稿: ${properties.title}`);
      return { skipped: true, title: properties.title };
    }

    console.log(`\n📄 处理文章: ${properties.title}`);

    // 获取文章内容
    const mdBlocks = await n2m.pageToMarkdown(page.id);
    const mdString = n2m.toMarkdownString(mdBlocks);
    let content = mdString.parent || '';

    // 替换 Notion 图片为本地图片
    console.log(`  🔄 处理文章中的图片...`);
    content = await replaceNotionImages(content);

    // 生成完整的 Markdown 文件
    const frontmatter = generateFrontmatter(properties);
    const fullContent = frontmatter + content;

    // 确定保存路径（按年份分类）
    const yearDir = getYearDirectory(properties.pubDatetime);
    await ensureDir(yearDir);

    const filePath = getPostFilePath(properties);
    const fileName = path.basename(filePath);

    // 如果文件存在且内容相同，则跳过写入，避免无意义的 diff
    const existingContent = await readFileIfExists(filePath);
    if (existingContent && existingContent === fullContent) {
      console.log(`⚖️  无变化，跳过写入: ${fileName}`);
      return { skipped: true, title: properties.title };
    }

    // 写入文件
    await fs.writeFile(filePath, fullContent, 'utf-8');
    
    console.log(`✅ 同步成功: ${properties.title} -> ${fileName}`);
    return { success: true, title: properties.title, path: filePath };
  } catch (error) {
    console.error(`❌ 同步失败: ${page.id}`, error.message);
    return { error: true, title: page.id, message: error.message };
  }
}

/**
 * 从 Notion Database 获取所有已发布的文章
 */
async function fetchPublishedPosts() {
  const posts = [];
  let cursor = undefined;

  try {
    do {
      const queryParams = {
        database_id: NOTION_DATABASE_ID,
        start_cursor: cursor,
        sorts: [
          {
            timestamp: 'created_time',
            direction: 'descending'
          }
        ]
      };

      // 如果需要过滤，可以添加 filter 参数
      // queryParams.filter = {
      //   property: 'Status',
      //   select: {
      //     equals: 'Published'
      //   }
      // };

      const response = await notion.databases.query(queryParams);

      posts.push(...response.results);
      cursor = response.next_cursor;
    } while (cursor);

    return posts;
  } catch (error) {
    console.error('获取 Notion 文章列表失败:', error);
    throw error;
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('🚀 开始从 Notion 同步文章...\n');

  // 检查必要的环境变量
  if (!NOTION_TOKEN) {
    console.error('❌ 错误: 未设置 NOTION_TOKEN 环境变量');
    process.exit(1);
  }

  if (!NOTION_DATABASE_ID) {
    console.error('❌ 错误: 未设置 NOTION_DATABASE_ID 环境变量');
    process.exit(1);
  }

  try {
    // 确保输出目录存在
    await ensureDir(OUTPUT_DIR);

    if (WITHDRAW_PAGE_ID) {
      console.log(`📤 正在撤回 Notion 页面: ${WITHDRAW_PAGE_ID}`);
      const page = await notion.pages.retrieve({ page_id: WITHDRAW_PAGE_ID });
      const properties = extractProperties(page);

      if (!properties.draft) {
        throw new Error(`撤回失败：《${properties.title}》的 Notion 状态不是 Draft`);
      }

      await removePublishedPost(properties);
      console.log('✅ 撤回处理完成');
      return;
    }

    // 获取文章列表
    console.log('📥 正在获取 Notion 文章列表...');
    const posts = await fetchPublishedPosts();
    console.log(`📝 找到 ${posts.length} 篇文章\n`);

    // 同步所有文章
    const results = [];
    for (const post of posts) {
      const result = await syncPost(post);
      results.push(result);
      // 添加延迟避免 API 限流
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // 统计结果
    const successful = results.filter(r => r.success).length;
    const skipped = results.filter(r => r.skipped).length;
    const failed = results.filter(r => r.error).length;

    console.log('\n📊 同步完成!');
    console.log(`✅ 成功: ${successful} 篇`);
    console.log(`⏭️  跳过: ${skipped} 篇`);
    console.log(`❌ 失败: ${failed} 篇`);

    if (failed > 0) {
      console.log('\n失败的文章:');
      results.filter(r => r.error).forEach(r => {
        console.log(`  - ${r.title}: ${r.message}`);
      });
    }

  } catch (error) {
    console.error('❌ 同步过程出错:', error);
    process.exit(1);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  main();
}

export { generateFileName, getPostFilePath, removePublishedPost };
