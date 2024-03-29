---
cid: 228
title: git 之修改 commit 以及 rebase 的使用
date: 2019-01-22 18:27:00
updated: 2019-01-22 18:35:10
status: publish
author: 桃翁
categories: 
  - 计算机相关
tags: 
  - git
  - 译文
thumb: http://ipengineer.net/wp-content/uploads/2015-04-git-logo.jpg?w=640
---


我在提交中犯了一个错误，我该如何解决？

我的提交历史一团遭，我改如何让它整洁？

如果您有过上述问题，那么这篇文章适合您。这篇文章介绍了一个让你成为 Git 专家的主题列表。

如果您不了解 Git 基础知识，请单击此处查看我的 Git 基础知识博客。您必须了解 Git 的基础知识才能充分利用本文。

## 我的提交中犯了一个错误。我该怎么办？

### 情景 1 
假设您已经提交了一堆文件并意识到您输入的提交消息实际上并不清楚。现在您要更改提交消息。为此，您可以使用 `git commit --amend`

```bash
git commit --amend -m “新提交消息”
```

### 情景 2
假设您想提交六个文件，但是，错误地，您最终只提交了五个文件。您可能认为可以创建新提交并将第6个文件添加到该提交。

这种方法没有错。但是，为了保持整洁的提交历史，如果你真的可以以某种方式将此文件添加到您之前的提交本身，那会不会更好？这也可以通过以下方式完成 `git commit --amend`：

```bash
git add file6 
git commit --amend --no-edit
```
`--no-edit` 表示提交消息不会更改

### 场景3
无论何时在 Git 中进行提交，提交都会附上作者姓名和作者电子邮件。通常，当您第一次设置 Git 时，您需要设置作者姓名和电子邮件。您无需担心每次提交的作者详细信息。

也就是说，对于特定项目，您可能希望使用不同的电子邮件 ID。您需要使用以下命令为该项目配置电子邮件 ID：

```bash
git config user.email “你的电子邮件ID”
```

假设您忘记配置电子邮件，并且已经完成了第一次提交。Amend 也可用于更改先前提交的作者。可以使用以下命令更改提交的作者：

```bash
git commit --amend --author“作者姓名<作者电子邮件>”
```

> 注意：仅在本地存储库中使用该 amend 命令。使用远程存储库可能会造成很多混乱 amend

## 我的提交历史是一团糟。我该如何处理？

假设您正在处理一段代码。您知道代码大约需要十天才能完成。在这十天内，其他开发人员也将提交代码到远程存储库。

将本地存储库代码与远程存储库中的代码保持同步是一种很好的做法。这会在您提出拉取请求时避免很多合并冲突。因此，您决定每两天从远程存储库中提取一次更改。

每次将代码从远程存储库提取到本地存储库时，都会在本地存储库中创建新的合并提交。这意味着您的本地提交历史记录将会进行大量的合并提交，这会使审阅者感到困惑。

![以下是提交历史记录在本地存储库中的显示方式。](http://imgs.taoweng.site/blog/typecho/1548153123.png)

### 如何使提交历史看起来更整洁？
这就是 rebase 拯救的地方。

### 什么是变基(rebase)？

让我通过一个例子解释一下。
![此图显示了发布分支和功能分支中的提交](http://imgs.taoweng.site/blog/typecho/1548153160.png)

1. Release 分支有三个提交：Rcommit1，Rcommit2 和Rcommit3。
2. 您在 Release 分支中只有一个提交（即 Rcommit1）时创建了 Feature 分支。
3. 您已向 Feature 分支添加了两个提交。它们是 Fcommit1 和 Fcommit2。
4. 您的目标是从 Release 分支提交到 Feature 分支。
5. 您将使用 rebase 来执行此操作。
6. 让 Release 分支的名称发布，Feature 分支的名称是 feature。
7. 可以使用以下命令重新进行重新定位：

```bash
git checkout feature
git rebase release
```

### 垫底

在重新定位时，您的目标是确保功能分支从 release 分支获取最新代码。

重新尝试尝试逐个添加每个提交，并检查冲突。这听起来有点令人困惑吗？

让我在图表的帮助下解释。

这显示了内部实际的变革：

![](http://imgs.taoweng.site/blog/typecho/1548153188.png)

#### 第 1 步
1. 运行该命令的那一刻，feature 分支指向 release 分支的头部。
2. 现在，feature 分支有三个提交：Rcommit1，Rcommit2 Rcommit3。
3. 您可能想知道 Fcommit1和 Fcommit2 发生了什么。
4. 提交仍然存在，将在下面的步骤中使用。

#### 第 2 步

1. 现在 git 尝试将 fcommit1 添加到 feature 分支。
2. 如果没有冲突，则在 Rcommit3 之后添加 Fcommit1
3. 如果存在冲突，git 会通知您，您必须手动解决冲突。解决冲突后，使用以下命令继续重新绑定

```bash
git add fixedfile 
git rebase --continue
```

#### 第 3 步

1. 一旦添加了 Fcommit1，git 将尝试添加 Fcommit2。
2. 同样，如果没有冲突，则在 Fcommit1 之后添加 Fcommit2 并且 rebase 成功。
3. 如果存在冲突，git 会通知您，您必须手动解决。解决冲突后，请使用步骤2中提到的相同命令
4. 整个 rebase 完成后，您会注意到 feature 分支有Rcommit1，Rcommit2，Rcommit3，Fcommit1 和 Fcommit2。

### 注意事项

1. Rebase 和 Merge 在 Git 中都很有用。一个并不比另一个好。
2. 在合并的情况下，您将进行合并提交。在 rebase 的情况下，没有像 merge 提交那样的额外提交。
3. 一种最佳实践是在不同点使用命令。使用远程存储库中的最新代码更新本地代码存储库时，请使用 rebase。在处理 pull 请求以将Feature 分支与 Release 或 Master 分支合并时，请使用merge。
4. 使用 Rebase 会更改提交历史记录（使其更整洁）。但话虽如此，改变提交历史存在风险。因此，请确保永远不要对远程存储库中的代码使用 rebase。始终仅使用 rebase 来更改本地仓库代码的提交历史记录。
5. 如果对远程存储库进行了rebase，则会产生很多混乱，因为其他开发人员无法识别新的历史记录。
6. 此外，如果在远程存储库上完成 rebase，则当其他开发人员尝试从远程存储库中提取最新代码时，它可能会产生问题。所以我再说一遍，总是只为本地存储库使用 rebase

## 恭喜

你现在是Git专家
在这篇文章中你了解到：

- 修改提交
- 变基(rebase)

这两个都是非常有用的概念。去探索Git的世界，进一步学习。

> 原文：https://medium.freecodecamp.org/how-to-become-a-git-expert-e7c38bf54826
