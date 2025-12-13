---
title: "Claude Code 免费使用魔搭社区的任意模型"
author: "桃翁"
date: 2025-12-07T00:00:00.000Z
tags:
  - AI Coding
  - Claude Code
featured: false
draft: false
---

Claude Code 免费使用魔搭社区的任意模型，每天 2000 次免费调用额度，让本地 AI 编码助手真正做到“又强又便宜”。

好

## 写在前面：Claude Code + 魔搭，有啥用？

对于已经习惯用 Claude Code 辅助写代码的同学来说，最纠结的问题往往不是“好不好用”，而是“用得起吗”。魔搭（ModelScope）现在正式支持 Anthropic 协议，并且提供每天共计 2000 次的免费 API-Inference 调用，其中 Qwen3-Coder 模型单独有 500 次免费额度，相当于给 Claude Code 用户送了一张长期饭票。

更关键的是：通过简单配置，Claude Code 不仅可以无缝切换到魔搭作为后端，还能直接调用魔搭社区中的任意兼容模型，比如 Qwen3-Coder、GLM-4.5 等，真正实现“本地一个助手，后台一片算力农场”。

## 一步搞定：拿到魔搭 Access Token

想让 Claude Code 免费连上魔搭，第一步就是拿到魔搭的 Access Token。

- 注册 / 登录：访问 [modelscope.cn](http://modelscope.cn/)，完成账号注册或登录。
- 必须绑定阿里云账号：魔搭免费推理 API 的算力由阿里云提供，账号未绑定阿里云是无法正常使用免费推理服务的。
- 获取 Access Token：进入「个人中心」的「我的 Access Token」页面生成或查看 Token。注意它通常以 ms- 开头。

需要特别强调的一点：在所有后续配置中，**都要去掉 ms- 前缀**，只保留后面的实际密钥内容，否则调用会失败。

## 核心原理：魔搭的 Anthropic 兼容接口

魔搭的 API-Inference 已经提供了与 Anthropic API 兼容的调用方式，可以直接被 Anthropic SDK 识别，这也是能被 Claude Code 利用的关键。

- 基础配置要点：
  - base_url 固定为：[https://api-inference.modelscope.cn](https://api-inference.modelscope.cn/)（无需追加/v1）。
  - api_key 使用你在魔搭生成并去掉 ms- 前缀后的 Access Token。
  - model 填写魔搭模型库中的 Model ID，例如 “Qwen/Qwen2.5-7B-Instruct”、“Qwen/Qwen3-Coder-480B-A35B-Instruct” 等。模型库 ID 在[这里](https://modelscope.cn/models?page=1&tabKey=task&tasks=hotTask%3Atext-generation&type=tasks)

  ![image.png](/assets/notion-images/32b6fb8f.png)

  这个就是模型 ID

- Anthropic 风格调用：
  - 使用官方 anthropic SDK，即可直接进行流式或非流式调用；
  - 接口遵循 Anthropic 的 messages 结构和必须显式指定 max_tokens 的约束，方便控制生成长度和成本。

对有自研服务 / 内部工具的团队来说，可以先在代码中调通这个兼容接口，再把同样的配置应用到 Claude Code 上，实现统一后端。

## 实操：把 Claude Code 后端切到魔搭

真正对开发者有用的，是如何把这些配置落地成 Claude Code 的免费“后端”。操作思路很简单：按 Anthropic 的方式设置环境变量或配置文件，指向魔搭即可。

典型做法是修改 Claude Code 的 settings.json（或环境变量）：

- 找到配置文件：
  - Windows：C:\Users\你的用户名\.claude\settings.json
  - Linux / macOS：~/.claude/settings.json（可用 vim、nano 或 VS Code 编辑）。
- 在 settings.json 中写入核心配置（示意）：
  - ANTHROPIC_API_KEY：你的魔搭 Access Token（去掉 ms-）。
  - ANTHROPIC_BASE_URL：[https://api-inference.modelscope.cn](https://api-inference.modelscope.cn/)
  - ANTHROPIC_MODEL：如 “Qwen/Qwen3-Coder-480B-A35B-Instruct”。
  - ANTHROPIC_SMALL_FAST_MODEL：可与主模型保持一致，或换成更轻量的模型做快捷响应用。

修改后重启 Claude Code，直接在编辑器里进行代码生成、补全、重构等操作，如果一切正常且调用记录能在魔搭后台看到，就说明已经在用魔搭的免费额度驱动 Claude Code 了。

## 为什么值得折腾一次？

把 Claude Code 接到魔搭，看似只是“换个后端”，但实际上带来的收益不少。

| 维度       | 带来的好处                                                                                                           |
| ---------- | -------------------------------------------------------------------------------------------------------------------- |
| 成本       | 每个账号每天 2000 次免费调用，其中 Qwen3-Coder 单独 500 次，足够覆盖日常开发和实验场景，大幅压缩 API 成本。          |
| 效率       | 利用 Claude Code 的交互体验 + 魔搭高性能模型算力，代码生成、补全、重构速度和质量都有明显提升。                       |
| 模型多样性 | 可在魔搭平台自由切换和试用不同模型（如 Qwen3-Coder、GLM-4.5、DeepseekV3.2 等），根据语言、场景和成本自由“择优录用”。 |
| 风险控制   | 免费额度适合开发、测试、学习和原型验证，官方也建议不要直接把免费接口当作高并发、强 SLA 的生产服务使用。              |
|            |                                                                                                                      |
