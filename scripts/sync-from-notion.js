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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配置
const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;
const OUTPUT_DIR = path.join(__dirname, '../src/content/blog');

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
  const safeSlug = slug || title
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
function getYearDirectory(date) {
  const year = new Date(date).getFullYear();
  return path.join(OUTPUT_DIR, year.toString());
}

/**
 * 同步单篇文章
 */
async function syncPost(page) {
  try {
    const properties = extractProperties(page);
    
    // 跳过草稿（除非需要同步草稿）
    if (properties.draft) {
      console.log(`⏭️  跳过草稿: ${properties.title}`);
      return { skipped: true, title: properties.title };
    }

    // 获取文章内容
    const mdBlocks = await n2m.pageToMarkdown(page.id);
    const mdString = n2m.toMarkdownString(mdBlocks);
    const content = mdString.parent || '';

    // 生成完整的 Markdown 文件
    const frontmatter = generateFrontmatter(properties);
    const fullContent = frontmatter + content;

    // 确定保存路径（按年份分类）
    const yearDir = getYearDirectory(properties.pubDatetime);
    await ensureDir(yearDir);

    const fileName = generateFileName(properties.title, properties.pubDatetime, properties.slug);
    const filePath = path.join(yearDir, fileName);

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
      await new Promise(resolve => setTimeout(resolve, 300));
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

// 运行主函数
main();
