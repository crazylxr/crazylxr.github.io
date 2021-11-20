---
layout: post
cid: 302
title: 从两个角度看 Typescript 中的类型是什么? 
slug: 302
date: 2020/03/03 10:09:33
updated: 2020/03/03 10:10:01
status: publish
author: 桃翁
categories: 
  - 译文
  - 前端
tags: 
  - typescript
---


## 0. 作者以及原文介绍

作者是 **Dr. Axel Rauschmayer**，号称”德国阮一峰“，本文原文来自于他的博客：https://2ality.com/2020/02/understanding-types-typescript.html，不熟悉他的可以关注一下他的博客。

## 1. 每个角度都从这三个问题来解释

以下三个问题对于理解类型是如何工作的非常重要，需要从这两个角度中的每一个角度来回答。

1. `myVariable` 的类型 `MyType` 意味着什么？

```javascript
let myVariable: MyType = /*...*/;
```

2. `Sourcetype` 可以分配给 `TargetType` 吗?

```javascript
let source: SourceType = /*...*/;
let target: TargetType = source;
```

3. `TypeUnion` 是如何从` Type1`、 `Type2 `和  `Type3` 衍生而来的？

```typescript
type TypeUnion = Type1 | Type2 | Type3;
```

## 2. 角度 1： 类型是一组值

从这个角度来看，类型是一组值：

1. 如果 `myVariable` 具有 `MyType` 类型，这意味着可以分配给 `myVariable` 的所有值都必须是集合 `MyType` 的元素。

2. 如果 `Sourcetype` 可以分配给 `TargetType`，那么 `Sourcetype` 是 `TargetType` 的子集。 因此，`TargetType` 也允许` SourceType` 所允许的所有值。
3. 类型 `Type1`、 `Type2`和 `Type3`的联合类型是定义它们的集合在集合论中的并集。

## 3. 角度2： 类型兼容关系

从这个角度来看，我们不关心值以及它们在执行代码时如何流动。 相反，我们采取了一种更为静态的观点:

- 源代码有个位置，每个位置都有一个静态类型。 在支持 **Typescript** 的编辑器中，如果我们将鼠标悬停在某个位置的上方，就可以看到该位置的静态类型。
- 当源位置通过赋值、函数调用等方式连接到目标位置时，源位置的类型必须与目标位置的类型兼容。 **Typescript** 规范通过所谓的类型关系定义类型的兼容性。
- 类型关系分配兼容性定义了源类型 `S` 何时可以分配给目标类型 `T`:
  - `S` 和 `T`  都是一样的类型
  - `S` 或者 `T` 是 any 类型。
  - 等等

让我们考虑以下问题：

1. 如果 `myVariable` 的静态类型可以分配给 `MyType` ，那么 `myVariable` 就具有类型 `MyType`
2. 如果 `SourceType` 和 `TargetType` 是互相兼容的，那么`SourceType`可以分配给 `TargetType`
3. 联合类型的工作方式是通过类型关系成员定义的。

类型系统一个有趣的特点是，同一个变量在不同的位置可以有不同的静态类型:

```javascript
const arr = [];
// %inferred-type: any[]
arr;

arr.push(123);
// %inferred-type: number[]
arr;

arr.push('abc');
// %inferred-type: (string | number)[]
arr;
```

## 4. 标准类型系统和结构类型系统

静态类型系统的职责之一是确定两个静态类型是否兼容：

- 实际参数的静态类型U（例如，通过函数调用提供）
- 对应形式参数的静态类型T（指定为函数定义的一部分）

这通常意味着要检查 U 是否是 T 的子类型。这种检查的两种方法(大致)是:

- 在标准类型中，如果两个静态类型具有相同的标识(“名称”) ，则它们是相等的。 一种类型是另一种类型的子类型，它们的子类型关系是显式声明的。

  > 具有标准类型的语言有 **c++** 、 **Java**、 **c#** 、 **Swift** 和 **Rust**

- 在结构类型系统中，如果两个静态类型具有相同的结构(如果它们的部分具有相同的名称和相同的类型) ，则它们是相等的。 如果 U 包含 T 的所有部分(可能还包括其他部分) ，并且 U 的每个部分都包含 T 的相应部分的子类型，那么一种类型 U 就是另一种类型 T 的子类型。

  > 具有结构类型的语言有 **ocaml**/**reasonml**、 **Haskell** 和 **TypeScript**

下面的代码在标准类型系统中产生类型错误(第 A 行) ，但在 **Typescript** 的结构类型系统中是合法的，因为类 `A` 和类 `B` 具有相同的结构:

```javascript
class A {
  name = 'A';
}
class B {
  name = 'B';
}
const someVariable: A = new B(); // (A)
```

**Typescript** 的接口在结构上也能工作——它们不需要实现来匹配:

```javascript
interface Point {
  x: number;
  y: number;
}
const point: Point = {x: 1, y: 2}; // OK
```

## 5. 进一步阅读

- [Chapter “Type Compatibility” in the TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/type-compatibility.html)
- [Section “TypeRelationships” in the TypeScript Specification](https://github.com/microsoft/TypeScript/blob/master/doc/spec.md#311-type-relationships)

> 如果翻译得不对的地方希望您可以帮忙指出来。