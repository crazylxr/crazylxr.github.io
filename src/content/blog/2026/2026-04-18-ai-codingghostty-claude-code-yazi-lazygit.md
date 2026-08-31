---
title: "沉浸式 AI Coding：Ghostty + Claude Code + Yazi + Lazygit 终端工作流实践"
description: "介绍一套完整的终端原生 AI 编程工作流，从 Ghostty 终端到 Claude Code AI 编程、Yazi 文件管理、Lazygit 版本控制，实现从需求到提交全程不离开终端的高效开发体验。"
author: "桃翁"
date: 2026-04-18T00:00:00.000Z
tags:
  - AI Coding
  - Ghostty
  - Claude Code
  - Yazi
  - Lazygit
  - 终端
  - 工作流
featured: false
draft: false
---

---

## 五、配置与联动

### 5.1 Ghostty 作为基础平台

Ghostty 的高性能让其他工具运行更流畅：

- Yazi 的图片预览在 Ghostty 中无延迟
- Lazygit 的滚动和分屏响应迅速
- Claude Code 的长输出流畅显示

### 5.2 统一快捷键风格

三个工具都支持 Vim 操作，保持一致：

```plain text
# 导航
h/j/k/l    左/下/上/右
gg/G       顶部/底部
Ctrl+d/u   半页滚动

# 选择
Space      选择/取消选择
v          可视模式

# 退出
q          退出
```

### 5.3 Yazi 退出自动 cd

添加 shell wrapper，让 Yazi 退出后自动切换到浏览的目录：

```bash
# ~/.zshrc 或 ~/.bashrc

function y() {
    local tmp="$(mktemp -t "yazi-cwd.XXXXXX")"
    local cwd
    yazi "$@" --cwd-file="$tmp"
    if cwd="$(command cat -- "$tmp")" && [ -n "$cwd" ] && [ "$cwd" != "$PWD" ]; then
        builtin cd -- "$cwd"
    fi
    rm -f -- "$tmp"
}
```

使用 `y` 启动 Yazi，按 `q` 退出后自动 cd 到当前目录。

### 5.4 Yazi 内快速启动 Lazygit

```plain text
# ~/.config/yazi/keymap.toml

[mgr]
prepend_keymap = [
    { on = ["<C-g>"], run = "shell 'lazygit' --block", desc = "Open Lazygit" },
]
```

在 Yazi 中按 `Ctrl+g` 直接启动 Lazygit，退出后回到 Yazi。

### 5.5 Lazygit 配置编辑器

```yaml
# ~/.config/lazygit/config.yml

os:
  editCommand: "nvim" # 或 'vim', 'code' 等
  editCommandTemplate: "{{editor}} +{{line}} {{filename}}"
```

在 Lazygit 中按 `e` 用指定编辑器打开文件。

---

## 六、进阶技巧

### 6.1 Ghostty 分屏工作流

```plain text
# Cmd+d 左右分屏
# Cmd+Shift+d 上下分屏
# Cmd+[/] 在分屏间切换
# Cmd+w 关闭当前分屏

典型布局：
┌─────────────────┬─────────────────┐
│                 │                 │
│  Claude Code    │  Lazygit/Yazi   │
│  （AI 编程）    │  （审查提交）   │
│                 │                 │
└─────────────────┴─────────────────┘
```

### 6.2 Lazygit 交互式 Rebase

Claude 生成了多个提交，需要整理：

```plain text
# 在 Lazygit 中
# 1. 切换到 Commits 面板 (按 4)
# 2. 选中要整理的提交范围
# 3. 按 i 进入交互式 rebase
# 4. 用 Ctrl+j/k 调整提交顺序
# 5. 按 s 压缩提交，按 d 删除提交
# 6. 按 m 继续 rebase
```

### 6.3 Yazi 快速搜索

```plain text
s          用 fd 搜索文件名
S          用 ripgrep 搜索文件内容
z          用 fzf 模糊查找
Z          用 zoxide 智能跳转
```

---

## 七、总结

这套四层架构的核心价值：**从终端基础到 AI 编程，全程不离开终端**。

| 层级 | 工具 | 解决的问题 | |------|------|-----------| | 终端基础 | **Ghostty** | 高性能、高颜值的终端平台 | | AI 编程 | **Claude Code** | 用自然语言生成代码 | | 文件管理 | **Yazi** | 终端内高效浏览文件 | | 版本控制 | **Lazygit** | 终端内可视化 diff 和提交 |

**最终工作流：**

```plain text
Ghostty 终端
    ↓
Claude 生成代码 → Yazi 浏览确认 → Lazygit 审查提交
    ↑___________________________________________↓
              全程在 Ghostty 内完成
```

**适合谁用：**

- 已经在用 Claude Code，但厌烦了切到 VSCode 看 diff
- 追求终端原生体验，希望工具链统一
- 重视颜值和性能，Ghostty 的顺滑体验让你爱上终端
- 远程开发（SSH、容器），没有 GUI 可用

**不适合谁用：**

- 重度依赖 VSCode 调试功能
- 需要图形化 diff 工具处理复杂合并
- 团队协作强制使用特定 IDE

---

## 附录：快捷键速查

### Ghostty

```plain text
Cmd+t          新建标签页
Cmd+1/2/3      切换到对应标签
Cmd+d          左右分屏
Cmd+Shift+d    上下分屏
Cmd+w          关闭分屏/标签
Cmd+[/]        在分屏间切换
Cmd+grave      快速终端（Quake 模式）
```

### Lazygit

```plain text
全局:
  ?          帮助
  q          退出
  1-5        切换面板

Files 面板:
  Space      暂存/取消暂存
  Enter      查看 diff
  c          提交
  p/P        拉取/推送

Diff 视图:
  Space      暂存当前代码块
  v          选择模式
  d          丢弃选中行
```

### Yazi

```plain text
导航:
  h/j/k/l    左/下/上/右
  gg/G       顶部/底部
  z/Z        fzf/zoxide 跳转

操作:
  Enter      打开文件
  Space      选择
  v          可视模式
  y/x/p      复制/剪切/粘贴
  t          新建标签
  1-9        切换标签
```

## 一、引言：终端原生工作流的最后一块拼图

### 问题：AI 写代码后的"最后一公里"

Claude Code 已经成为很多开发者的主力工具——自然语言描述需求，AI 自动生成代码，效率提升显著。但写完代码后，我们面临一个尴尬的问题：

**要看改了什么，还得打开 VSCode。**

Claude Code 在终端里完成了代码生成，但审查改动、查看 diff、选择性地暂存部分代码，这些操作在纯命令行体验并不好。于是工作流变成了：

1. 终端里让 Claude 写代码 → 2. 打开 VSCode 看 diff → 3. 回到终端提交

**每一次窗口切换，都是心流的中断。**

### 解决方案：四层终端原生架构

本文介绍一套完整的终端解决方案，让你**从需求到提交，全程不离开终端**：

| 层级 | 工具 | 作用 |

|------|------|------|

| 终端基础 | **Ghostty** | 高性能、高颜值的终端模拟器 |

| AI 编程 | **Claude Code** | 自然语言生成代码 |

| 文件管理 | **Yazi** | 终端内浏览、预览文件 |

| 版本控制 | **Lazygit** | 可视化 diff、选择性暂存、提交 |

Ghostty 是整个工作流的基础——它提供了运行其他三个工具的平台，同时自身的高性能和原生体验让终端操作丝般顺滑。

---

## 二、Ghostty —— 终端体验的基石

### 为什么需要 Ghostty？

传统的终端模拟器（iTerm2、Alacritty、Windows Terminal）要么功能丰富但速度慢，要么速度快但功能简陋。Ghostty 由 Mitchell Hashimoto（HashiCorp 创始人）开发，目标是**同时做到快、功能丰富、原生体验**。

#### 核心特性

**原生性能**

- macOS 上用 Swift + AppKit/SwiftUI 编写
- Linux 上用 Zig + GTK4 编写
- 共享核心 `libghostty` 用 Zig 实现，编译为原生机器码
- GPU 加速渲染，滚动、分屏、图片显示都丝般顺滑

**原生体验**

- macOS 上支持 Quick Look、Force Touch、安全输入 API
- 原生标签页（不是文本模拟的标签）
- 原生分屏，支持快捷键调整大小
- 系统暗黑/亮色模式自动切换
- 下拉式终端（Quake 模式）

**功能丰富**

- 支持 Kitty Graphics Protocol（Yazi 图片预览的基础）
- 支持超链接、浅色/深色模式通知
- 原生输入方法支持（中文输入无问题）
- 窗口状态恢复（重启后恢复之前的标签和分屏）

**颜值在线**

Ghostty 的默认外观就很好看：

- 简洁的标题栏，可选隐藏
- 平滑的动画过渡
- 支持自定义主题和字体
- 分屏边框清晰但不突兀

### Ghostty 配置示例

```bash
# ~/.config/ghostty/config

# 字体
font-family = "JetBrains Mono"
font-size = 14

# 主题（跟随系统）
theme = "catppuccin-mocha"
background-opacity = 0.95

# 窗口
window-padding-x = 8
window-padding-y = 8
window-step-resize = true

# 分屏
keybind = cmd+d=new_split:right
keybind = cmd+shift+d=new_split:down
keybind = cmd+w=close_surface

# 标签页
keybind = cmd+t=new_tab
keybind = cmd+1=goto_tab:1
keybind = cmd+2=goto_tab:2
keybind = cmd+3=goto_tab:3

# 快速终端（Quake 模式）
keybind = global:cmd+grave_accent=toggle_quick_terminal
```

### 与其他终端的对比

| 特性 | iTerm2 | Alacritty | Ghostty |

|------|--------|-----------|---------|

| 性能 | 中等 | 快 | 快 |

| 原生标签页 | 是 | 否 | 是 |

| 原生分屏 | 是 | 否 | 是 |

| Kitty Graphics | 部分 | 是 | 是 |

| 配置复杂度 | 高 | 中 | 低 |

| 颜值 | 中 | 低 | 高 |

---

## 三、核心工具链

### 3.1 Lazygit —— 终端里的 Git 可视化

Lazygit 解决了终端环境下 Git 操作的痛点：**不用记命令，不用切窗口，一个界面搞定所有 Git 操作**。

#### 为什么不用 git diff / git add -p？

传统的终端 Git 工作流：

```bash
# 看改了什么
git diff
# 翻页...翻页...翻页...

# 选择性暂存
git add -p
# y/n/s/e/? 这是啥意思？

# 提交
git commit -m "xxx"
```

**问题很明显：**

- `git diff` 输出太长，没有语法高亮
- `git add -p` 的交互晦涩难懂
- 无法直观地选择"只暂存某几行"

#### Lazygit 的解决方案

**六面板布局，一目了然：**

```plain text
┌─────────────────────────────────────────────────────────┐
│ Status │ Files          │ Branches  │ Commits │ Stash │
├────────┴────────────────┴───────────┴─────────┴─────────┤
│                                                       │
│  Files 面板              │  Preview 面板              │
│  - file1.ts (modified)   │  ┌────────────────────┐   │
│  - file2.ts (added)      │  │ diff --git a/...   │   │
│  - file3.ts (deleted)    │  │ + function foo() { │   │
│                          │  │ +   return 42;     │   │
│  按 Space 暂存/取消       │  │ + }                │   │
│  按 Enter 看 diff        │  └────────────────────┘   │
│                          │                           │
└──────────────────────────┴───────────────────────────┘
```

**核心快捷键：**

| 操作 | 按键 | 说明 |

|------|------|------|

| 暂存/取消暂存文件 | `Space` | 在 Files 面板选中文件 |

| 查看文件 diff | `Enter` | 在 Preview 面板显示 |

| 选择性暂存代码块 | `Enter` → `Space` | 进入文件后选代码行 |

| 提交 | `c` | 输入提交信息 |

| 推送 | `P` | 大写 P |

| 拉取 | `p` | 小写 p |

**行级选择性暂存（重点）：**

Claude Code 生成的代码不一定全对，你需要挑着提交：

1. 在 Files 面板，选中文件按 `Enter`
2. 进入代码块视图，看到具体的 diff
3. 用 `↑/↓` 选择代码行
4. 按 `Space` 暂存当前行
5. 按 `v` 进入选择模式，批量选择多行
6. 按 `a` 选择整个代码块

**这比 `git add -p` 直观 10 倍。**

---

### 3.2 Yazi —— 终端里的文件管理器

Yazi 解决了另一个痛点：**在终端里高效浏览文件**。

#### 传统方式的局限

```bash
# 找文件
cd somewhere
ls -la
cd subdir
ls -la
# ...反复 cd/ls

# 看文件内容
cat file.ts
# 输出太长，翻页困难

# 打开文件
vim file.ts
# 只是想看一眼，却打开了编辑器
```

#### Yazi 的三面板布局

```plain text
┌──────────┬──────────────┬──────────────┐
│ Parent   │ Current      │ Preview      │
│ dir      │ dir          │ of file      │
│          │              │              │
│ src/     │ > utils.ts   │ [文件内容    │
│          │   helpers/   │  预览在这里] │
│          │   config.ts  │              │
└──────────┴──────────────┴──────────────┘
```

**Vim 式导航（零学习成本）：**

```plain text
h/j/k/l    左/下/上/右
gg/G       跳到顶部/底部
l          进入目录 / 打开文件
h          返回上级目录
```

**核心操作：**

| 操作 | 按键 | 场景 |

|------|------|------|

| 预览文件 | 悬停自动 | 不用打开就能看内容 |

| 打开文件 | `Enter` | 用默认编辑器打开 |

| 快速跳转 | `z` | 调用 fzf 模糊查找 |

| 智能跳转 | `Z` | 调用 zoxide 历史目录 |

| 复制路径 | `cc` | 复制完整路径到剪贴板 |

**多标签页（像浏览器一样）：**

```plain text
t          创建新标签页
1/2/3      切换到对应标签
[/]        上一个/下一个标签
```

比如同时打开：

- Tab 1: 项目根目录
- Tab 2: src/components 目录
- Tab 3: tests 目录

按数字键瞬间切换。

---

## 四、完整工作流：四层架构的协作

### 场景：Claude Code 生成代码后的审查与提交

**Step 0：Ghostty 准备环境**

```bash
# 在 Ghostty 中
# Cmd+d 分屏，左边放 Claude Code，右边备用
# Cmd+t 新建标签页，一个标签用于开发，一个用于日志
```

**Step 1：Claude Code 生成代码**

```bash
$ claude

> 给 User 组件添加一个显示用户等级的功能

[Claude 开始工作...]

✓ 修改了 src/components/User.tsx
✓ 添加了 src/utils/level.ts
```

**Step 2：用 Yazi 快速浏览改动**

```bash
$ y

# 在 Yazi 中
# 1. 按 l 进入 src/components
# 2. 悬停在 User.tsx，右侧预览改动内容（Ghostty 的 Kitty Graphics 支持让预览更流畅）
# 3. 按 Enter 用编辑器打开，快速确认逻辑
# 4. 按 t 创建新标签，查看 utils/level.ts
# 5. 按 q 退出
```

**Step 3：用 Lazygit 审查 diff**

```bash
$ lazygit

# 在 Lazygit 中

# 1. 默认在 Files 面板，看到所有改动文件
#    - User.tsx (modified)
#    - utils/level.ts (added)

# 2. 选中 User.tsx，按 Enter 查看 diff
#    Preview 面板显示具体的代码变更
#    按 ↑/↓ 浏览，按 J/K 滚动预览

# 3. 发现 User.tsx 里有部分代码不需要
#    - 按 Space 进入代码块视图
#    - 选中不需要的行，按 d 丢弃（或只暂存需要的行）

# 4. 确认无误后
#    - 按 Space 暂存文件
#    - 按 c 输入提交信息："feat: add user level display"
#    - 按 P 推送到远程

# 5. 按 q 退出
```

**全程没有离开 Ghostty 终端，没有打开 VSCode。**

---

### 对比：传统方式 vs 终端原生

| 步骤 | 传统方式 | 终端原生（四层架构） |

|------|---------|-------------------|

| 终端环境 | iTerm2/Terminal | **Ghostty**（高性能、高颜值） |

| AI 生成代码 | 终端运行 Claude Code | 相同 |

| 浏览改动文件 | 打开 VSCode 侧边栏 | **Yazi** 三面板浏览 |

| 查看 diff | VSCode 的 Source Control | **Lazygit** Preview 面板 |

| 选择性暂存 | VSCode 的 stage 按钮 | **Lazygit** 行级选择 |

| 提交 | VSCode 输入框 | **Lazygit** 按 c 提交 |

| **窗口切换次数** | **2-3 次** | **0 次** |

---

## 五、配置与联动

### 5.1 Ghostty 作为基础平台

Ghostty 的高性能让其他工具运行更流畅：

- Yazi 的图片预览在 Ghostty 中无延迟
- Lazygit 的滚动和分屏响应迅速
- Claude Code 的长输出流畅显示

### 5.2 统一快捷键风格

三个工具都支持 Vim 操作，保持一致：

```plain text
# 导航
h/j/k/l    左/下/上/右
gg/G       顶部/底部
Ctrl+d/u   半页滚动

# 选择
Space      选择/取消选择
v          可视模式

# 退出
q          退出
```

### 5.3 Yazi 退出自动 cd

添加 shell wrapper，让 Yazi 退出后自动切换到浏览的目录：

```bash
# ~/.zshrc 或 ~/.bashrc

function y() {
    local tmp="$(mktemp -t "yazi-cwd.XXXXXX")"
    local cwd
    yazi "$@" --cwd-file="$tmp"
    if cwd="$(command cat -- "$tmp")" && [ -n "$cwd" ] && [ "$cwd" != "$PWD" ]; then
        builtin cd -- "$cwd"
    fi
    rm -f -- "$tmp"
}
```

使用 `y` 启动 Yazi，按 `q` 退出后自动 cd 到当前目录。

### 5.4 Yazi 内快速启动 Lazygit

```toml
# ~/.config/yazi/keymap.toml

[mgr]
prepend_keymap = [
    { on = ["<C-g>"], run = "shell 'lazygit' --block", desc = "Open Lazygit" },
]
```

在 Yazi 中按 `Ctrl+g` 直接启动 Lazygit，退出后回到 Yazi。

### 5.5 Lazygit 配置编辑器

```yaml
# ~/.config/lazygit/config.yml

os:
  editCommand: "nvim" # 或 'vim', 'code' 等
  editCommandTemplate: "{{editor}} +{{line}} {{filename}}"
```

在 Lazygit 中按 `e` 用指定编辑器打开文件。

---

## 六、进阶技巧

### 6.1 Ghostty 分屏工作流

```plain text
# Cmd+d 左右分屏
# Cmd+Shift+d 上下分屏
# Cmd+[/] 在分屏间切换
# Cmd+w 关闭当前分屏

典型布局：
┌─────────────────┬─────────────────┐
│                 │                 │
│  Claude Code    │  Lazygit/Yazi   │
│  （AI 编程）    │  （审查提交）   │
│                 │                 │
└─────────────────┴─────────────────┘
```

### 6.2 Lazygit 交互式 Rebase

Claude 生成了多个提交，需要整理：

```plain text
# 在 Lazygit 中
# 1. 切换到 Commits 面板 (按 4)
# 2. 选中要整理的提交范围
# 3. 按 i 进入交互式 rebase
# 4. 用 Ctrl+j/k 调整提交顺序
# 5. 按 s 压缩提交，按 d 删除提交
# 6. 按 m 继续 rebase
```

### 6.3 Yazi 快速搜索

```plain text
s          用 fd 搜索文件名
S          用 ripgrep 搜索文件内容
z          用 fzf 模糊查找
Z          用 zoxide 智能跳转
```

---

## 七、总结

这套四层架构的核心价值：**从终端基础到 AI 编程，全程不离开终端**。

| 层级 | 工具 | 解决的问题 |

|------|------|-----------|

| 终端基础 | **Ghostty** | 高性能、高颜值的终端平台 |

| AI 编程 | **Claude Code** | 用自然语言生成代码 |

| 文件管理 | **Yazi** | 终端内高效浏览文件 |

| 版本控制 | **Lazygit** | 终端内可视化 diff 和提交 |

**最终工作流：**

```plain text
Ghostty 终端
    ↓
Claude 生成代码 → Yazi 浏览确认 → Lazygit 审查提交
    ↑___________________________________________↓
              全程在 Ghostty 内完成
```

**适合谁用：**

- 已经在用 Claude Code，但厌烦了切到 VSCode 看 diff
- 追求终端原生体验，希望工具链统一
- 重视颜值和性能，Ghostty 的顺滑体验让你爱上终端
- 远程开发（SSH、容器），没有 GUI 可用

**不适合谁用：**

- 重度依赖 VSCode 调试功能
- 需要图形化 diff 工具处理复杂合并
- 团队协作强制使用特定 IDE

---

## 附录：快捷键速查

### Ghostty

```plain text
Cmd+t          新建标签页
Cmd+1/2/3      切换到对应标签
Cmd+d          左右分屏
Cmd+Shift+d    上下分屏
Cmd+w          关闭分屏/标签
Cmd+[/]        在分屏间切换
Cmd+grave      快速终端（Quake 模式）
```

### Lazygit

```plain text
全局:
  ?          帮助
  q          退出
  1-5        切换面板

Files 面板:
  Space      暂存/取消暂存
  Enter      查看 diff
  c          提交
  p/P        拉取/推送

Diff 视图:
  Space      暂存当前代码块
  v          选择模式
  d          丢弃选中行
```

### Yazi

```plain text
导航:
  h/j/k/l    左/下/上/右
  gg/G       顶部/底部
  z/Z        fzf/zoxide 跳转

操作:
  Enter      打开文件
  Space      选择
  v          可视模式
  y/x/p      复制/剪切/粘贴
  t          新建标签
  1-9        切换标签
```
