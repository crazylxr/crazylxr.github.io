import assert from 'node:assert/strict';
import test from 'node:test';
import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import { markdownProcessorOptions } from '../astro.config.mjs';

async function render(markdown) {
  const processor = await createMarkdownProcessor(markdownProcessorOptions);
  return (await processor.render(markdown)).code;
}

test('renders display math with KaTeX', async () => {
  const html = await render(String.raw`$$
股东总回报\approx每股价值增长+现金分红
$$`);

  assert.match(html, /class="katex-display"/);
  assert.match(html, /aria-hidden="true"/);
  assert.doesNotMatch(html, /class="katex-error"/);
});

test('renders GFM tables as semantic HTML', async () => {
  const html = await render(`| 方式 | 优点 | 缺点 |
| --- | --- | --- |
| 手动复制 | 简单直接 | 每次都要改格式 |`);

  assert.match(html, /<table>/);
  assert.match(html, /<th>方式<\/th>/);
  assert.match(html, /<td>手动复制<\/td>/);
});
