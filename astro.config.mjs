import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import { unified } from "@astrojs/markdown-remark";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import sitemap from "@astrojs/sitemap";

export const markdownProcessorOptions = {
  remarkPlugins: [
    remarkMath,
    remarkToc,
    [
      remarkCollapse,
      {
        test: "Table of contents",
      },
    ],
  ],
  rehypePlugins: [[rehypeKatex, { strict: false }]],
};

// https://astro.build/config
export default defineConfig({
  site: "https://crazylxr.github.io",
  integrations: [react(), sitemap()],
  markdown: {
    processor: unified(markdownProcessorOptions),
    shikiConfig: {
      theme: "one-dark-pro",
      wrap: true,
    },
    extendDefaultPlugins: true,
  },
});
