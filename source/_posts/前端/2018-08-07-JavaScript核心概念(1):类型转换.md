---
layout: post
cid: 105
title: JavaScript核心概念(1):类型转换
slug: 105
date: 2018/08/07 10:34:00
updated: 2018/11/20 21:58:33
status: publish
author: 桃翁
categories: 
  - 前端
tags: 
  - JavaScript
  - 核心概念
thumb: https://upload-images.jianshu.io/upload_images/1784374-19c91d87d8923fa2.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/630/format/webp
---


![](https://diycode.b0.upaiyun.com/photo/2018/75860bac6249dc70ac61906ae3f58049.png)


看到这个是不是有一种想打人的感觉，垃圾 JavaScript，这特么都什么鬼，相信很多人不管是笔试还是面试，都被 JS 的类型转换难道过，相信认真看完我这篇文章，妈妈再也不用担心类型转换的问题了。

## 原始值到原始值的转换

1. 原始值转化为布尔值

	 所有的假值(undefined、null、0、-0、NaN、””)会被转化为 false，其他都会被转为 true

2. 原始值转化为字符串
 都相当于 原始值 + ""

3. 原始值转为数字
	- 布尔转数字：true -> 1, false -> 0
	- 字符串转数字：以数字表示的字符串可以直接会转为字符串，如果字符串头尾有空格会忽略，但是空格在中间，转换结果就是 NaN。
	
	```javascript
	 +" 66" // 66
	  +" 6 7 " // NaN
	```

##  原始值到对象的转换

- null 和 undefined 转对象直接抛异常
- 原始值通过调用 String()、Number()、Boolean()构造函数，转换为他们各自的包装对象
	
## 对象到原始值的转换
1. 对象转为布尔都为 true
2. 对象到字符串
	- 如果对象有 toString() 方法，就调用 toString() 方法。如果该方法返回原始值，就讲这个值转化为字符串。
	- 如果对象没有 toString() 方法或者 该方法返回的不是原始值，就会调用该对象的 valueOf() 方法。如果存在就调用这个方法，如果返回值是原始值，就转化为字符串。
	- 否则就报错
3. 对象到数字
	- 对象转化为数字做了跟对象转化为字符串做了想同的事儿，不同的是后者是先调用 valueOf 方法，如果调用失败或者返回不是原始值，就调用 toString 方法。
4. 补充。一些常用内置对象 toString 方法和 valueOf 的转换规则
	- toString 相关
	![](https://diycode.b0.upaiyun.com/photo/2018/9fe8d2d761eff48c5145e6c7e035a7dc.png)
	
 - valueOf 相关
	![](https://diycode.b0.upaiyun.com/photo/2018/656a5a293809ad2628a2afc40fe12bb9.png)

## == 运算符如何进行类型转换
1. 如果一个值是null，另一个值是undefined，则相等
2. 如果一个是字符串，另一个值是数字，则把字符串转换成数字，进行比较
3. 如果任意值是true，则把true转换成1再进行比较；如果任意值是false，则把false转换成0再进行比较
4. 如果一个是对象，另一个是数值或字符串，把对象转换成基础类型的值再比较。对象转换成基础类型，利用它的 toString 或者 valueOf 方法。 **js 核心内置类，会尝试 valueOf 先于 toString（可以理解为对象优先转换成数字**）；例外的是 Date，Date 利用的是 toString 转换。非 js 核心的对象，通过自己的实现中定义的方法转换成原始值。

## + 运算符如何进行类型转化
1. 如果作为一元运算符就是转化为数字，常常用来将字符串转化为数字
    ```
+"2" //  2
2+false // 0
    ```
   
2. 如果作为二元运算符就有两种转换方式
	- 两边如果有字符串，另一边一会转化为字符串进行相加
	- 如果没有字符串，两边都会转化为数字进行相加，对象也根据前面的方法转化为原始值数字。
	- 如果其中的一个操作数是对象,则将对象转换成原始值，日期对象会通过 toString() 方法进行转换，其他对象通过 valueOf（）方法进行转换，但是大多数方法都是不具备可用的 valueOf() 方法，所以还是会通过 toString() 方法执行转换。
	
流程图如下：
![](https://diycode.b0.upaiyun.com/photo/2018/75a38c55807695e9283e1a76d5cdf0ca.png)
## 实战分析
1.  `[]+[] // ""`
_1. 首先运算符是 + 运算符而且很明显是二元运算符，并且有对象，所以选择最后一点，操作数是对象，将对象转换为原始值。
_2. 两边对象都是数组，左边的数组先调用 valueOf() 方法无果，然后去调用 toString(), 方法，在 toString() 的转化规则里面有『将数组转化为字符串，用逗号分隔』，由于没有其他元素，所以直接是空字符串 “”。
	![](https://diycode.b0.upaiyun.com/photo/2018/30b2c9a257c7b7a780b6a7b125d65efd.png)
_3. 因为加号有一边是字符串了，所以另外一边也转为 字符串，所以两边都是空字符串 “”。
_4. 所以加起来也是空字符串 “”。

2. `(! + [] + [] + ![]).length // 9`

这个题我看球友在做作业的时候理解还是有点误差，所以再单独说一说。
_1. 首先我们会看到挺多一元运算符，「+」、「！」，对于一元运算符是右结合性，所以可以画出以下运算顺序。
![](https://diycode.b0.upaiyun.com/photo/2018/75f496bcf7d859f84298761c90f5bdab.png)
_2. 对于·`+[]`，数组是会被转化为数字的而不是字符串，可见「+ 运算符如何进行类型转化」的第一条，所以经过第一步就会转化为
`(!0 + [] + "false").length `
_3. 第二步比较简单，0 转化为布尔值就是 false，所以经过第二步就转化为
`(true + [] + "false").length `
_4. 第三步中间的 `[]`会转为空字符串，在「+ 运算符如何进行类型转化」第二条的第三点，对象会被转转化为原始值，就是空字符，所以经过第三步之后就会变成
`("true" + "false").length`
_5. 第五步就比较简单啦，最终就是 `"truefalse".length // 9`
## 附录：
![](https://diycode.b0.upaiyun.com/photo/2018/f8e1e7a0291d6ad042c672cbaff063aa.png)
《JavaScript权威指南》中类型转换表格
