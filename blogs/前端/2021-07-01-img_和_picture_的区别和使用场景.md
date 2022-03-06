layout: post
cid: 341
title: img 和 picture 的区别和使用场景
slug: img-he-picture-de-qu-bie-he-shi-yong-chang-jing
updated: '2021/07/01 23:15:32'
status: publish
author: 桃翁
categories:
  - 前端
  - 笔记本
tags:
  - 笔记本
  - css
date: 2021-07-01 15:12:00
---


## img

[img](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img) 是 HTML4 时就有的标签， 至今仍然是在网页中嵌入图片的最常用的方式。 与 `<span>`, `<em>` 等标签一样属于行内标签 （准确地说属于 [Phrasing Content](https://html.spec.whatwg.org/#phrasing-content)）。下面是一个示例：

```html
 <img src="favicon72.png"
      alt="MDN logo"
      srcset="favicon144.png 2x">
```

img 其实也可以控制在高清屏幕采用哪个图片，适合用在移动端

## picture 

```html
<picture>
    <source srcset="/media/cc0-images/surfer-240-200.jpg"
            media="(min-width: 800px)">
    <img src="/media/cc0-images/painted-hand-298-332.jpg" alt="" />
</picture>
```

要决定加载哪个URL，[user agent](https://developer.mozilla.org/zh-CN/docs/Glossary/User_agent) 检查每个 `<source>` 的 [`srcset`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/source#attr-srcset)、[`media`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/source#attr-media) 和 [`type`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/source#attr-type) 属性，来选择最匹配页面当前布局、显示设备特征等的兼容图像。

picture 就可以方便的控制在某种媒体类型，加载哪个图片。感觉比较适合做响应式用。

相比 `img` 标签，`picture` 提供了更丰富的响应式资源选择方式；

[picture](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture) 是 HTML5 中定义新标签， 其中可以定义若干个 `<source>`，浏览器会匹配 `<source>` 的 `type`, `media`, `srcset` 等属性， 来找到最适合当前布局、[视口宽度](https://harttle.land/2016/04/21/viewport.html)、*设备像素密度* 的一个去下载。 为了向下兼容不识别 `<picture>` 和 `<source>` 的浏览器，`<picture>` 中还可以写一个 `<img>` 作为 fallback。

```html
<picture>
 <source srcset="harttle-land-avatar.png" media="(min-width: 750px)">
 <img src="harttle-land-banner.png" alt="a banner for harttle.land">
</picture>
```

## 图片如何做响应式

### 响应式：基于视口宽度

[响应式设计](https://en.wikipedia.org/wiki/Responsive_web_design) 是一种 Web 页面设计方式， 使得不同 [视口宽度](https://harttle.land/2016/04/21/viewport.html) 和 *设备像素密度* 下内容都可以很好地展示，都可以保证可用性和用户满足。

提到响应式多数开发者都会想到 CSS 媒体查询，但 HTML5 中还定义了元素属性的媒体查询。 这使得可以通过媒体查询来根据元素渲染宽度 *选择资源* 和 *图片占位*：

```html
<img src="avatar.png" 
     srcset="avatar-200.png 200w, avatar-400.png 400w"
     sizes="(max-width: 600px) 200px, 50vw">
```

浏览器会根据 `sizes` 的媒体查询来决定渲染大小；此后根据实际的渲染大小来决定选择哪个资源。 比如屏幕宽度为 `500px`，那么就会调整图片大小为 `200px`， 然后选择 `srcset` 中最匹配这个大小的 `avatar-200.png` 去下载。

### 响应式：基于设备像素比

支持 HTML5 的浏览器中还可以基于 *设备像素比* 来选择资源。 在刚出现 Retina 屏幕时有些网页图片展现模糊， 就是因为在高像素密度（比如 2 倍设备像素比）的屏幕上仍然显示 1 倍大小的图片。 `<img>` 元素的 src 和 srcset 属性都支持 x 描述符来提供不同大小的图片。

```html
<img src="avatar-1.0.png" srcset="avatar-1.5.png 1.5x, avatar-2.0.png 2x">
```

用户代理可以根据用户屏幕像素密度、缩放级别，甚至用户的网络条件选择任何一个给出的资源。 这里同时给出 `src` 也是为了向后兼容。

### 响应式：基于媒体查询

上文提到在 `<img>` 元素的 `sizes` 中可以写媒体查询来计算宽高。 `<picture>` 中也可以通过媒体查询来选择 `<source>` 可以给不同的设备大小下载不同的图片。 区别在于 **基于视口宽度** 的资源选择侧重于对不同大小的屏幕选择宽度适合的，同样内容的图片。 **基于媒体查询** 的资源选择侧重于对不同的屏幕选择不同内容的图片。

比如在移动设备上只显示头像，在大屏幕显示器上则显示完整的大图。

```html
<picture>
 <source srcset="avatar.png" media="(max-width: 640px)">
 <source srcset="avatar-with-background.png" media="(min-width: 640px)">
 <img src="avatar.png" alt="smiling harttle">
</picture>
```

基于媒体查询的选择在 HTML5 标准中称为 [Art Direction](https://html.spec.whatwg.org/multipage/images.html#art-direction)。

### 响应式：基于图片格式

`<source>` 元素的 `type` 属性可以指定图片格式，浏览器可以选择自己支持的去下载。 基于图片格式的选择可以用于性能优化，有些格式我们知道压缩比非常好但并非所有浏览器都支持。 这时就可以提供多种格式的图片让浏览器来选择。

```html
<picture>
 <source srcset="avatar.webp" type="image/webp">
 <source srcset="avatar.jxr" type="image/vnd.ms-photo">
 <img src="avatar.jpg" alt="" width="100" height="150">
</picture>
```

在这个例子中，如果用户代理支持 WebP 就会选择第一个 `<source>` 元素。 如果不支持 WebP，但支持 JPEG XR 就会选择第二个 source 元素。 如果这两种都不支持，就会选择 img 元素。（这个例子来自 [HTML Standard](https://html.spec.whatwg.org/multipage/images.html#image-format-based-selection)）

## 参考

- [正确使用 HTML5 标签：img, picture, figure 的响应式设计](https://harttle.land/2018/05/30/responsive-img-picture.html)