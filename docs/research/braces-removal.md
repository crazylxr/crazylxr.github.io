# 彻底移除 braces 的迁移结果与方案

## 实施记录

已按正式上层迁移路线实施：Tailwind CSS 4.3.3 通过 Vite 插件接入，
ESLint 10.13.0 与 Astro/TypeScript 解析器同步升级，lint-staged 更新到
16.4.0，Commitizen 改为独立的 czg 1.14.0，保留 `npm run cz` 入口。
Node 版本约束与新版解析器一致，CI 仍使用满足要求的 22.23.2。

完整锁文件已不再包含 `braces`、`micromatch` 或 `fast-glob`；
删除了本地 `postinstall`、补丁脚本及补丁说明，新增依赖图回归测试。
保留 KaTeX 安全回归测试。没有采用第三方 braces 分支。

为了保持外观，迁移时保留既有断点、字体、明暗主题与文章配色，
使用官方 `@config` 加载主题配置，并为 Astro 局部样式添加 `@reference`。
适配了透明度、圆角、焦点描边、关于页行高和段落间距，
将文章覆盖规则放到与 typography 一致的样式层，并恢复表头原有内边距。

视觉验证以迁移前生产构建为基线，Chrome 以固定字体与相同资源条件比较：
9 类页面 × 1280/390 像素宽度 × 明暗主题，共 36 组整页截图，
pixelmatch 阈值 0.1 下未检测到差异。范围包含首页、关于页、文章列表、
标签、搜索、AI 导航、普通文章、公式/表格文章、代码文章。
这覆盖代表性页面，不代表穷举全部文章或浏览器。

交互状态另有 13 组截图，与迁移前同样未检测到可见像素差异。
`npm ci`、`npm run build`（201 页）、`npm test`（13 项）、
`npm run lint`、`npm run format:check` 与 `npm audit` 均通过，
完整安全审计为 0 漏洞；`npm run cz -- --help` 也已验证。

交互验收范围包括主题切换、移动菜单、关于页对话框、标签 hover/焦点、
文章搜索及 AI 输入框样式。AI 导航页原有搜索脚本包含未处理的裸模块导入和
模板插值，在迁移前后都不能初始化；此问题不是本次迁移引入，筛选功能未列为通过项。

以下保留迁移前的调研记录；其中未实施的描述指当时的调查阶段。

核对日期：2026-10-18。依据迁移前的 `package-lock.json`、本地完整依赖树、npm 官方 registry 元数据和各项目官方文档。

## 结论

可以通过升级及替换上层工具彻底移除 `braces`，但需要一次 Tailwind CSS 4 迁移，并同步更新 ESLint 工具链、替换提交交互工具。仅执行 `npm update braces`、升级 `micromatch` 或升级 `fast-glob` 不能解决：当前最新版分别是 `braces@3.0.3`、`micromatch@4.0.8`、`fast-glob@3.3.3`，后两者仍依赖 `braces`。[braces 元数据](https://registry.npmjs.org/braces/3.0.3)、[micromatch 元数据](https://registry.npmjs.org/micromatch/4.0.8)、[fast-glob 元数据](https://registry.npmjs.org/fast-glob/3.3.3)

当前漏洞是深层嵌套模式触发递归栈耗尽。GitHub 公告仍将 `<=3.0.3` 列为受影响版本，修复版本为 None。因此本地深度保护补丁是临时缓解；无补丁的长期方案应把该包从完整锁文件移除。[GitHub 安全公告](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)

另外存在改动较小的第三方修复分支替换方案，详见下文。它可以去掉本地补丁，但维护方与原项目不同，不能称为官方修复版本。

## 隔离依赖树验证结果

本次在仓库之外的临时目录复制当前包清单和锁文件，移除安装脚本，仅生成候选锁文件，没有改动主工作区依赖或网站源码。使用 `npm install --package-lock-only --ignore-scripts` 验证依赖可解析，再执行完整 `npm audit --json`：

- 候选采用 Tailwind 与 Vite 插件 4.3.3、lint-staged 16.4.0、TypeScript parser 8.71.2、Astro parser 3.2.0、Astro ESLint 插件 3.2.1、ESLint 10.13.0、`@eslint/js` 10.0.1、czg 1.14.0。
- 候选锁文件共 769 个条目，已不含 `braces`、`micromatch`、`fast-glob`。
- `npm audit` 返回所有严重程度均为 0，命令退出码为 0。

这验证了完整依赖图的可行性，未执行候选网站的实际安装、构建或视觉回归，不能视作迁移已完成。

## 改动较小的第三方替换方案

`@zklogic/braces@3.0.7` 声明兼容 braces 3.x API，并在解析器中加入默认 256 层的深度上限；更深的内容保留为字面文本，而不是继续构造递归 AST。npm 发布元数据显示包名首次发布于 2026-10-06，由一个维护账号负责；仓库是 `ArfanKhalilMughal/braces`。本次下载并检查发布 tarball，确认深度限制确实存在于代码中，并非仅改名避开扫描。[分支仓库与 README](https://github.com/ArfanKhalilMughal/braces)、[固定版本发布清单](https://registry.npmjs.org/@zklogic%2fbraces/3.0.7)、[发布时间元数据](https://registry.npmjs.org/@zklogic%2fbraces)

可通过精确固定的 override 替换所有传递调用方：

```json
{
  "overrides": {
    "braces": "npm:@zklogic/braces@3.0.7"
  }
}
```

以上仅展示新增项，实施时应合并现有 overrides。随后删除本地 `postinstall` 补丁及说明；现有深度测试需改为验证不发生栈溢出与预期字面文本行为，因为该分支不会抛出本地补丁的 `SyntaxError`。测试也应从调用方路径解析模块，不应假设 npm alias 一定提升至根目录。

本次完成的隔离验证：

- 基于发布 tarball，对 7 个普通模式的 compile/expand 输出与原库进行比较，全部一致；覆盖嵌套、转义、数值区间、字母区间、引号及圆括号。
- 花括号、圆括号、混合嵌套各 2,000 层，分别调用 parse/compile/expand/stringify，共 12 项均未抛出异常。
- 复制原依赖图，仅增加上述 override，生成的锁文件保留真实包名 `@zklogic/braces`、版本 3.0.7、registry URL 和完整性哈希；原始 `braces` 包已被替换。完整 `npm audit` 为 0。

这些是有限的兼容性检查，尚未在替换后的完整网站上运行构建、测试与钩子，也没有验证任意第三方构造 AST 的行为。采用此方案前仍需完成这些检查。它减少本地补丁维护，却引入新的维护方，且发布历史很短，因此更适合作为过渡；长期优先采用正式上层升级路线。

## 当前引入路径与可用升级

下表依据 `npm ls braces micromatch fast-glob chokidar --all` 和已发布版本元数据。多个路径共享同一个实际安装目录，普通 `npm ls braces` 会折叠间接路径。

| 直接依赖                                                                   | 当前引入路径                                                        | 官方可用路径                                                                     | 迁移影响                                                    |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `tailwindcss@3.4.19`                                                       | `chokidar@3.6.0 → braces`，以及 `fast-glob → micromatch → braces`   | `tailwindcss@4.3.3` 加 `@tailwindcss/vite@4.3.3` 或 `@tailwindcss/postcss@4.3.3` | 最大：构建接入、CSS 指令、主题及页面视觉回归                |
| `lint-staged@16.2.6`                                                       | `micromatch@4.0.8 → braces`                                         | **`lint-staged@16.4.0` 已足够**，上游已改用 `picomatch`                          | 小：验证暂存文件的匹配及 Prettier 执行                      |
| `@typescript-eslint/parser@8.46.3`                                         | `typescript-estree → fast-glob → micromatch → braces`               | `@typescript-eslint/parser@8.71.2`；相应 `typescript-estree` 已用 `tinyglobby`   | 中：重跑 TS/TSX 及 Astro 脚本检查                           |
| `astro-eslint-parser@1.2.2`，以及 `eslint-plugin-astro@1.5.0` 的间接解析器 | `fast-glob → micromatch → braces`                                   | `astro-eslint-parser@3.2.0`、`eslint-plugin-astro@3.2.1`                         | 中：插件要求 ESLint 10；应同步更新 `eslint` 和 `@eslint/js` |
| `commitizen@4.3.2`                                                         | `find-node-modules@2.1.3 → findup-sync@4.0.0 → micromatch → braces` | 用独立 CLI **`czg@1.14.0`** 替换，保留 `npm run cz` 入口                         | 小：交互提示与配置需验收                                    |

版本证据：[Tailwind 4](https://registry.npmjs.org/tailwindcss/4.3.3)、[Vite 插件](https://registry.npmjs.org/@tailwindcss%2fvite/4.3.3)、[PostCSS 插件](https://registry.npmjs.org/@tailwindcss%2fpostcss/4.3.3)、[lint-staged 16.4.0 发布说明](https://github.com/lint-staged/lint-staged/releases/tag/v16.4.0)、[typescript-estree 8.71.2](https://registry.npmjs.org/@typescript-eslint%2ftypescript-estree/8.71.2)、[Astro parser 3.2.0](https://registry.npmjs.org/astro-eslint-parser/3.2.0)、[Astro ESLint 插件 3.2.1](https://registry.npmjs.org/eslint-plugin-astro/3.2.1)。

### 为什么不只升级提交工具的间接依赖

`commitizen@4.3.2` 已是当前最新版。`find-node-modules@2.1.3` 仍使用 `findup-sync@^4.0.0`；即使强制更新到 `findup-sync@5.0.0`，其本身仍直接依赖 `micromatch`，因此没有移除效果。[commitizen 元数据](https://registry.npmjs.org/commitizen/4.3.2)、[find-node-modules 元数据](https://registry.npmjs.org/find-node-modules/2.1.3)、[findup-sync 5 元数据](https://registry.npmjs.org/findup-sync/5.0.0)

`czg@1.14.0` 的发布清单没有 npm `dependencies`，官方提供独立交互 CLI。实际替换应移除 `commitizen`、`cz-conventional-changelog` 与 `config.commitizen`，新增 `czg`，将 `scripts.cz` 改成 `czg`。只安装 `cz-git` 适配器而保留 Commitizen，不能移除旧依赖链。发布包可能包含打包代码，零 npm 依赖本身不等于完全没有第三方代码。[czg 官方说明](https://cz-git.qbb.sh/cli/)、[czg 发布元数据](https://registry.npmjs.org/czg/1.14.0)

### Node 与 ESLint 兼容性

`astro-eslint-parser@3.2.0` 和 `eslint-plugin-astro@3.2.1` 要求 Node `^22.22.3 || ^24.16.0 || >=26.3.0`。当前 CI 的 Node 22.23.2 满足，但 `package.json` 的最低版本 `>=22.19.0` 需同步收紧。最新版插件要求 `eslint>=10.0.0`；调查时可用 `eslint@10.13.0`、`@eslint/js@10.0.1`，应同时核对插件迁移说明和实际检查结果。[解析器元数据](https://registry.npmjs.org/astro-eslint-parser/3.2.0)、[插件元数据](https://registry.npmjs.org/eslint-plugin-astro/3.2.1)、[ESLint 元数据](https://registry.npmjs.org/eslint/10.13.0)、[@eslint/js 元数据](https://registry.npmjs.org/@eslint%2fjs/10.0.1)

`lint-staged` 最新版是 17.6.0，但为此漏洞升至 16.4.0 即可，不必引入额外大版本变更。[16.4.0 元数据](https://registry.npmjs.org/lint-staged/16.4.0)、[17.6.0 元数据](https://registry.npmjs.org/lint-staged/17.6.0)

保留 ESLint 9 的普通升级路径没有完成闭环：`eslint-plugin-astro@1.7.0` 是当前最后的 1.x，仍依赖 `astro-eslint-parser@^1.3.0`；最后的解析器 1.x `1.4.0` 仍用 `fast-glob`。`astro-eslint-parser@2.1.0` 虽已切换 `tinyglobby`，但不满足该插件的 1.x 依赖范围，直接新增 2.x 会留下插件内部的旧解析器。插件 2.x 已要求 ESLint 10。因此推荐正式升级整套工具，而非通过跨大版本 override 强迫插件采用未经其支持范围承诺的解析器。[插件 1.7.0](https://registry.npmjs.org/eslint-plugin-astro/1.7.0)、[解析器 1.4.0](https://registry.npmjs.org/astro-eslint-parser/1.4.0)、[解析器 2.1.0](https://registry.npmjs.org/astro-eslint-parser/2.1.0)、[插件 2.1.1](https://registry.npmjs.org/eslint-plugin-astro/2.1.1)

## Tailwind 迁移的主要风险

Tailwind 官方提供升级工具，建议在独立分支迁移后检查浏览器效果。v4 改用新的 CSS 入口；PostCSS 与 Vite 接入有独立包，且官方倾向 Vite 插件。默认边框、阴影等样式和部分工具类语义发生变化，需要对首页、文章、导航、暗色主题及移动端做视觉回归。浏览器基线也提高到 Safari 16.4、Chrome 111、Firefox 128。[Tailwind 官方升级指南](https://tailwindcss.com/docs/upgrade-guide)

本仓库需重点检查 `tailwind.config.cjs` 的函数式主题、自定义 `skin` 颜色和 typography 插件；`src` 中有 14 个文件使用 `@apply`，Astro 组件的局部样式需要检查 v4 的主题引用方式。`src/styles/base.css` 还使用 `selection:bg-opacity-70`、`prose-blockquote:border-opacity-50`、`prose-code:bg-opacity-75` 等旧透明度工具类，需迁移为新语法并核对输出。这是源码检查所得的具体迁移范围，单纯升级 npm 版本不足以证明页面样式兼容。

## 不推荐的方案

- 把 `micromatch` 用 npm alias/override 直接指向 `picomatch`：两者公开 API 不同。前者提供列表过滤、匹配结果及括号展开等功能，后者主要返回匹配谓词；上层工具需自行迁移调用方式。上游 `lint-staged` 已完成这项适配，应升级它而非在下游伪装包名。[micromatch API](https://github.com/micromatch/micromatch)、[picomatch API](https://github.com/micromatch/picomatch)
- 强制把 `fast-glob` 换成 `tinyglobby`：同样没有通用的 API 兼容保证，使用已经完成迁移的上游版本更可靠。
- 重命名漏洞包或仅隐藏扫描结果：没有消除实际代码风险，也无法作为根治验收标准。
- 降级到 `braces@2`：公告覆盖所有 `<=3.0.3`，没有安全版本依据。

## 建议实施与验收顺序

1. 更新 Node 最低版本，先完成开发工具链升级和 `czg` 替换，保留现有防护补丁。
2. 迁移 Tailwind 4，逐页核对样式与交互；完成后检查完整锁文件是否仍存在 `braces`、`micromatch`、`fast-glob`。
3. 仅在完整依赖树确认不再包含 `braces` 后，删除 `postinstall`、`scripts/patch-braces.mjs`、专用安全测试和相关补丁说明。
4. 从干净安装执行 `npm ci`，依次运行 `npm run build`、`npm test`，并运行 lint、格式检查、完整依赖审计。暂存文件钩子和 `npm run cz -- --help` 也需验证。
5. 发布前验收产物及网页视觉；默认分支锁文件更新后再核对 Dependabot 告警是否关闭。

这里的确定结论是存在官方升级/替换路径；完整包树是否清零及网站运行兼容性，需要分别通过隔离安装实验和实际迁移验证，不能仅从单个包的直接依赖字段推断。
