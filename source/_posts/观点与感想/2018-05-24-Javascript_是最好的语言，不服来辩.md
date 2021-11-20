---
layout: post
cid: 95
title: Javascript 是最好的语言，不服来辩
slug: 95
date: 2018/05/24 17:03:00
updated: 2018/11/20 21:59:55
status: publish
author: 桃翁
categories: 
  - 观点与感想
tags: 
  - JavaScript
---


看到这个标题相信很多人就要开始跟我争论了，PHP 才是最好的语言，那就请原谅下，你说是就是，我们来看看就知道了。

有一条 Atwood 定律：any application that can be written in JavaScript, will eventually be written in JavaScript

翻译一下就是：任何可以用 JavaScript 来写的应用，最终都将用 JavaScript 来写

要是没看到过这句话的人可能又要开始说了，Atwood 是谁，他说最终会就会啊。

那我们来了解一下他，说那些多少年的编程经验啊，这些都没啥用，只要说一点，就能知道这个人也不是等闲之辈，他是 stack overflow 的联合创始人，还是牛逼吧，如果你说你不知道 stackoverflow，那么对不起，那么我们不能做朋友了（开玩笑的，不知道的去了解下吧）

## Javascript 可以做什么
### 1.  Web 前端
相信这个这个是毫无疑问的，在 Web 前端的地位目前是没有任何语言能撼动它的霸主地位。
![image.png](https://upload-images.jianshu.io/upload_images/2974893-fd552485a3ae95dc.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 2. 后端 Nodejs
Node.js 是一个 Javascript 运行环境(runtime environment)，发布于2009年5月，由Ryan Dahl 开发，实质是对 Chrome V8 引擎进行了封装。Node.js 对一些特殊用例进行优化，提供替代的 API，使得V8在非浏览器环境下运行得更好。

使 Javascript 走向了服务端，这使得 Web 应用仅用一种语言即可完成。

### 3. 桌面应用
> 代表 Electron ，还有 Node-webkit 、heX

Electron 是由 Github 开发，用 HTML，CSS 和 JavaScript 来构建跨平台桌面应用程序的一个开源库。 Electron 通过将 Chromium  和 Node.js 合并到同一个运行时环境中，并将其打包为 Mac，Windows 和 Linux 系统下的应用来实现这一目的。

### 4. 移动端应用
> 代表 React Native，Weex 生态还不完善

React Native (简称RN) 是 Facebook 于 2015 年 4 月开源的跨平台移动应用开发框架，是 Facebook 早先开源的 JS 框架 React 在原生移动应用平台的衍生产物，目前支持 iOS 和安卓两大平台。RN 使用 Javascript 语言，类似于 HTML 的 JSX，以及CSS 来开发移动应用，因此熟悉 Web 前端开发的技术人员只需很少的学习就可以进入移动应用开发领域。做到了一套代码可以运行在 Web、安卓和 IOS 上。

### 5. 游戏
> 代表 Cocos2d-js 和 Unity 3D，还有 Pomelo、Bearcat

世界上最流行的 2D 游戏引擎之一 Cocos2d 和最流行的 3D 游戏引擎之一均支持 JS 开发游戏。

Cocos2d 主要开发中小型的 2D 游戏而 Unity 3D 主要用于开发大型的 3D 游戏。

#### Cocos2d-JS
Cocos2d-JS 是跨全平台的游戏引擎，采用原生 JavaScript 语言，可发布到包括 Web 平台，iOS，Android，Windows Phone8，Mac，Windows 等平台，引擎基于MIT 开源协议，完全开源，免费，易学易用，拥有活跃的社区支持。Cocos2d-JS 让2D 的游戏编程门槛更低，使用更加容易和高效。和其他类似游戏框架相比，它定义了更加清晰的2D游戏编程的基本组件，采用易学易用的 API 设计，并采用全球领先、具备原生性能的脚本绑定解决方案实现游戏的跨原生平台发布，开发效率更高，使用上最简单。

#### Unity 3D

Unity 3D 可以用 javascript 开发，也可以用 C# 开发。

### 6. 物联网 
> 代表 Cylon.js，还有 IoT.js

Cylon.js 是一个为机器人学和物联网服务的开发的 Javascript 框架。它支持 19 种不同硬件软件平台。我们的目标，是将开发软件装置变得和开发网页一样简单。

![image.png](https://upload-images.jianshu.io/upload_images/2974893-dbf8fa842d9274a8.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

这是 2017 年 Github 最流行的 15 种语言排行榜，可以看到 Javascript 的项目数是第二名的两倍，Javascript 之所以这么流行，我想原因之一也是因为这门语言所涉及的范围太广了。

看到这里，我只想说
![还有谁](https://upload-images.jianshu.io/upload_images/2974893-ef43bb322c79a3bd.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 将你擅长的语言编译为JavaScript
看到 Javascript 无孔不入，啥都能做，是不是在担心现在不会怎么办，不要担心，现在有很多工具帮你将你擅长的语言编译成 Javascript

### 将 Java 编译成 Javascript
*   [BicaVM](https://github.com/nurv/BicaVM)：一个使用JavaScript实现的JVM，可以运行60%的Java字节码

*   [Ceylon](http://ceylon-lang.org/)：一个可编译为JavaScript的、模块化的、静态类型JVM语言

*   [Doppio](http://int3.github.com/doppio/about.html)：一个使用 Coffeescript 实现的JVM，使得 Java 程序可以运行在任何 JavaScript 引擎上
### 将 C/C++ 代码编译为 JavaScript
C/C++ 如今也可以用来编写Web应用程序，同样可以将它们编译为 JavaScript。一些工具如下。

*   [Emscripten](http://www.emscripten.org/)：Mozilla 开发的 LLVM 后端，可以将任何通过 LLVM 前端（比如 C/C++ Clang）生成的 LLVMIR 中间码编译成 JavaScript 代码。

*   [mala](http://lethalman.hostei.com/maja/index.html)：可以将 vala 代码（vala代码在编译时，首先会编译为 C 代码）编译为 JavaScript

*   [Mandreel](http://www.mandreel.com/)：可以将 C++ 和 Objective-C 代码编译为高度优化的JavaScript源码

*   [Clue](http://cluecc.sourceforge.net/)：一个 C 语言编译器，可以将 C 语言代码编译为高质量的 Lua、Javascript 或 Perl 代码。

### 将Python代码编译为JavaScript
可以使用如下工具将 Python 代码编译为 JavaScript 代码。

*   [Brython](http://brython.info/index_en.html)：用于替换网页上的 JavaScript 代码，允许使用 Python 来编写脚本，并直接在网页上执行

*   [PYXC-PJ](https://github.com/andrewschaaf/pyxc-pj)：可以将 Python 转换为JavaScript，并会产生一个行/列号映射文件

*   [Pyjaco](http://pyjaco.org/demo)：可以将 Python 转换为 JavaScript

*   [Pyjamas](http://pyjs.org/)：Python to JS转换器

*   [Pyjs](https://github.com/anandology/pyjs)：Python to JS转换器

### 将Ruby代码编译为JavaScript

　　在Ruby领域，有一个使用JavaScript实现的Ruby标准库—— [RubyJS](http://rubyjs.org/index.html)，它实现了Ruby中的所有方法，如Array、Numbers、Time等。Ruby之父松本行弘称“如果我必须编写JavaScript代码，我会使用RubyJS”。

　　另外，你也可以使用如下工具将Ruby代码编译为JavaScript代码。

*   [8ball](https://github.com/mattknox/8ball)：一个可以将Ruby（或Ruby子集）的源码转换为JavaScript源码的编译器

*   [ColdRuby](https://github.com/whitequark/coldruby)：一个Ruby 1.9 MRI字节码编译器和JS运行时，包括一个C++运行时以及用于本地执行的V8引擎

*   [HotRuby](http://hotruby.yukoba.jp/)：可以在浏览器内部或Flash平台上运行由YARV编译的Ruby操作码

*   [Opal](http://opalrb.org/)： 一个Ruby to JavaScript编译器，可用于任何JS环境

*   [rb2js](http://rb2js.rubyforge.org/)：一个Ruby to JavaScript编译器

*   [Red](https://github.com/jessesielaff/red)：允许你以 Ruby 的方式编写代码，然后以 JavaScript 的方式运行代码
### 将 .NET 代码编译为 JavaScript

　　你可以使用如下工具将 C# 、.NET 代码编译为 JavaScript 代码。

*   [Blade](https://github.com/vannatech/blade)：一个 Visual Studio 扩展，可以将 C# 代码转换为 JavaScript

*   [jsc](http://jsc.sourceforge.net/)：可将 .NET 程序重新编译为 JavaScript、ActionScript、PHP 或 Java 程序

*   [JSIL](https://github.com/kevingadd/JSIL)：可将MSIL（.NET字节码）转换为 JavaScript

*   [Saltarelle](http://www.saltarelle-compiler.com/)：可将 C# 代码编译为 Javascript

*   [SharpKit](http://sharpkit.net/)（商业工具）：可将 C# 代码编译为 Javascript

*   [Script#](http://projects.nikhilk.net/ScriptSharp)： 可将 C# 代码编译为 Javascript

可能这篇文章被吐槽的比较多，特别是标题，我只想说，你说的都对，我只是个标题党。

每种语言都有自己的适用场景，没有任何一种语言能啥都做得好，根据自己的需要选择就行，我这里知识做一个类似科普，万万没想到 Javascript 这么强大。

下面是我公众号，欢迎来辩

![qrcode_for_gh_39aba8571ae1_258.jpg](http://www.taoweng.site/usr/uploads/2018/08/2153731188.jpg)