---
title: 使用 React 和 TypeScript 编写干净代码的10个必知模式
date: 2022-03-09 08:20:00
author: 桃翁
categories:
  - 技术
tags:
  - react
  - typescript
  - 译文
---

React 是一个 JavaScript 库，它是当今最流行和行业领先的前端开发库。

JavaScript 是一种松散的类型化语言，因此，它捕获了运行时。这样做的结果就是 JavaScript 错误被捕获得非常晚，这可能导致严重的 bug。

当然 React 作为一个 JavaScript 库，也继承了这个问题。

[干净代码(Clean code)](https://gist.github.com/wojteklu/73c6914cc446146b8b533c0988cf8d29 "干净代码(Clean code)")是一种一致的编程风格，它使代码更容易编写、读取和维护。任何人都可以编写计算机可以理解的代码，但是优秀的开发人员可以编写人类可以理解的干净的代码。

干净的代码是一种以读者为中心的开发风格，它提高了我们的软件质量和可维护性。

编写干净代码需要编写具有清晰和简单的设计模式的代码，这使得人们可以轻松地阅读、测试和维护代码。因此，干净的代码可以降低软件开发的成本。这是因为编写干净的代码所涉及的原则，消除了技术债务。

在本文中，我们将介绍一些在使用 React 和 TypeScript 时使用的有用模式。

💡 为了让您的团队更容易地保持代码健康并优先处理技术债务工作，请尝试使用 [Stepsize 的 VS Code](https://marketplace.visualstudio.com/items?itemName=Stepsize.stepsize "Stepsize 的 VS Code") 和 [JetBrains](https://www.stepsize.com/r/jetbrains "JetBrains") 扩展。它们帮助工程师创建技术问题，将它们添加到迭代 中，并持续解决技术债务——而不离开编辑器。

现在让我们来了解一下在使用 React 和 Typescript 时应用的 10 个有用模式:

## 1. 使用默认导入来导入 React

考虑下面的代码:

```javascript
import * as React from "react";
```

虽然上面的代码可以工作，但是如果我们不使用 React 的所有内容，那么导入它们是令人困惑的，也不是一个好的做法。一个更好的模式是使用如下所示的默认导出:

```javascript
import React, { useContext, useState } from "react";
```

使用这种方法，我们可以从 React 模块中解构我们需要的东西，而不是导入所有的内容。

注意: 要使用这个选项，我们需要配置 `tsconfig.json` 文件，如下所示:

```json
{
  "compilerOptions": {
    "esModuleInterop": true"
  }
}
```

在上面的代码中，通过将 esModuleInterop 设置为 true，我们启用了[ allowSyntheticDefaultImports ](http://allowSyntheticDefaultImports " allowSyntheticDefaultImports ") ，这对于 TypeScript 支持我们的语法非常重要。

## 2. 类型**声明**要在运行时实现之前

考虑下面的代码:

```javascript
import React, {Component} from "react";

const initialState = { count: 1 }
const defaultProps = { name: "John Doe" }

type State = typeof initialState;
type Props = { count?: number } & typeof defaultProps

class Counter extends Component {

   static defaultProps = defaultProps;
   state = initialState;

   // ...

}
```

如果我们将运行时声明和编译时声明分开，并且编译时声明在运行时声明之前，那么上面的代码可以更清晰、更易读。

考虑下面的代码:

```javascript
import React, {Component} from "react";

type State = typeof initialState;
type Props = { count?: number } & typeof defaultProps

const initialState = { count: 1 }
const defaultProps = { name: "John Doe" }

class Counter extends Component {

   static defaultProps = defaultProps;
   state = initialState;

   // ...

}
```

现在，初看起来，开发人员知道组件 API 是什么样的，因为代码的第一行清楚地显示了这一点。

此外，我们还将编译时声明与运行时声明分开。

## 3. 给 children 提供明确的 props

Typescript 反映了 React 如何处理 children props，方法是在 `react.d.ts` 中为函数组件和类组件将其注释为可选的。

因此，我们需要明确地为 `children` 提供一个 `props` 类型。但是，最好总是用类型明确地注释`children`的 props。在我们希望使用 `children` 进行内容投影的情况下，这是非常有用的，如果我们的组件不使用它，我们可以简单地使用 never 类型来注释它。

考虑下面的代码：

```javascript
import React, {Component} from "react";
// Card.tsx
type Props = {
    children: React.ReactNode
}

class Card extends Component<Props> {
    render() {
        const {children} = this.props;
        return <div>{children}</div>;
    }
}
```

下面是一些注释 `children` 的 props 类型：

- `ReactNode | ReactChild | ReactElement`
- 对于原始类型可以使用： `string | number | boolean`
- 对象和数组也是有效的类型
- `never | null | undefined` – 注意：不建议使用 `null` 和 `undefined`

## 4. 使用类型推断来定义组件状态或 DefaultProps

看下面的代码：

```javascript
import React, {Component} from "react";

type State = { count: number };

type Props = {
    someProps: string & DefaultProps;
}

type DefaultProps = {
    name: string
}

class Counter extends Component<Props, State> {
    static defaultProps: DefaultProps = {name: "John Doe"}
    state = {count: 0}

    // ...
}
```

虽然上面的代码可以工作，但是我们可以对它进行以下改进: 启用 TypeScript 的类型系统来正确推断`readonly` 类型，比如 `DefaultProps` 和 `initialState`。

为了防止由于意外设置状态而导致的开发错误: `this.state = {}`

考虑下面的代码:

```javascript
import React, {Component} from "react";

const initialState = Object.freeze({ count: 0 })
const defaultProps = Object.freeze({name: "John Doe"})

type State = typeof initialState;
type Props = { someProps: string } & typeof defaultProps;

class Counter extends Component<Props, State> {
    static readonly defaultProps = defaultProps;
    readonly state  = {count: 0}

    // ...
}
```

在上面的代码中，通过冻结 `DefaultProps` 和 `initialState`，TypeScript 类型系统现在可以将它们推断为`readonly`类型。

另外，通过在类中将静态 `defaultProps` 和状态标记为 `readonly`，我们消除了上面提到的设置状态引起运行时错误的可能性。

## 5. 声明 Props/State 时使用类型别名(type)，而不是接口(interface)

虽然可以使用`interface`，但为了一致性和清晰性起见，最好使用 `type`，因为有些情况下`interface`不能工作。例如，在前面的示例中，我们重构了代码，以使 TypeScript 的类型系统能够通过从实现中定义状态类型来正确推断 `readonly`类型。我们不能像下面的代码那样使用这个模式的`interface`:

```javascript
// works
type State = typeof initialState;
type Props = { someProps: string } & typeof defaultProps;

// throws error
interface State = typeof initialState;
interface Props = { someProps: string } & typeof defaultProps;
```

此外，我们不能用联合和交集创建的类型扩展`interface`，因此在这些情况下，我们必须使用 `type`。

## 6. 不要再 interface/type 中使用方法声明

这可以确保我们的代码中的模式一致性，因为 `type/interface` 推断的所有成员都是以相同的方式声明的。另外，`--strictFunctionTypes` 仅在比较函数时工作，而不适用于方法。你可以从这个 TS 问题中得到进一步的解释。

```javascript
// Don't do
interface Counter {
  start(count:number) : string
  reset(): void
}

// Do
interface Counter {
  start: (count:number) => string
  reset: () => string
}
```

## 7. 不要使用 FunctionComponent

或者简称为 FC 来定义一个函数组件。

当使用 Typescript 和 React 时，函数组件可以通过两种方式编写:

1. 像一个正常函数一样，如下面的代码：

```javascript
type Props = { message: string };

const Greeting = ({ message }: Props) => <div>{message}</div>;
```

2. 使用 React.FC 或者 React.FunctionComponent，像下面这样：

```javascript
import React, {FC} from "react";

type Props = { message: string };

const Greeting: FC<Props> = (props) => <div>{props}</div>;
```

使用 FC 提供了一些优势，例如对诸如 `displayName`、 `propTypes` 和 `defaultProps` 等静态属性进行类型检查和自动完成。但是它有一个已知的问题，那就是破坏 `defaultProps` 和其他属性: `propTypes`，`contextTypes`，`displayName`。

FC 还提供了一个隐式类型的 `children` 属性，也有已知的问题。此外，正如前面讨论的，组件 API 应该是显式的，所以一个隐式类型的 `children` 属性不是最好的。

## 8. 不要对类组件使用构造函数

有了新的 [类属性](https://github.com/tc39/proposal-class-fields#consensus-in-tc39 "类属性") 提议，就不再需要在 JavaScript 类中使用构造函数了。使用构造函数涉及调用 `super ()`和传递 `props`，这就引入了不必要的样板和复杂性。

我们可以编写更简洁、更易于维护的 React class 组件，使用类字段，如下所示:

```javascript
// Don't do
type State = {count: number}
type Props = {}

class Counter extends Component<Props, State> {
  constructor(props:Props){
      super(props);
      this.state = {count: 0}
  }
}

// Do
type State = {count: number}
type Props = {}

class Counter extends Component<Props, State> {
  state = {count: 0}
}
```

在上面的代码中，我们看到使用类属性涉及的样板文件较少，因此我们不必处理 `this` 变量。

## 9. 不要在类中使用 public 关键字

考虑下面的代码：

```javascript
import { Component } from "react"

class Friends extends Component {
  public fetchFriends () {}
  public render () {
    return // jsx blob
  }
}
```

由于类中的所有成员在默认情况下和运行时都是 `public` 的，因此不需要通过显式使用 `public` 关键字来添加额外的样板文件。相反，使用下面的模式:

```javascript
import { Component } from "react";

class Friends extends Component {
  fetchFriends() {}
  render() {
    return; // jsx blob
  }
}
```

## 10. 不要在组件类中使用 private

考虑下面的代码：

```javascript
import {Component} from "react"

class Friends extends Component {
  private fetchProfileByID () {}

  render () {
    return // jsx blob
  }
}
```

在上面的代码中，`private` 只在编译时将 `fetchProfileByID` 方法私有化，因为它只是一个 Typescript 模拟。但是，在运行时，`fetchProfileByID` 方法仍然是公共的。

有不同的方法使 JavaScript 类的属性/方法私有化，使用下划线(\_)变数命名原则如下:

```javascript
import { Component } from "react";

class Friends extends Component {
  _fetchProfileByID() {}

  render() {
    return; // jsx blob
  }
}
```

虽然这并没有真正使 `fetchProfileByID` 方法成为私有方法，但它很好地向其他开发人员传达了我们的意图，即指定的方法应该被视为私有方法。其他技术包括使用 WeakMap、Symbol 和限定作用域的变量。

但是有了新的 ECMAScript 类字段的提议，我们可以通过使用私有字段轻松优雅地实现这一点，如下所示:

```javascript
import { Component } from "react";

class Friends extends Component {
  #fetchProfileByID() {}

  render() {
    return; // jsx blob
  }
}
```

而且 TypeScript 支持 3.8 及以上版本私有字段的新 JavaScript 语法。

## 附加：不要使用 enum

尽管 `enum` 在 JavaScript 中是一个保留字，但是使用 `enum` 并不是一个标准的惯用 JavaScript 模式。

但是如果你使用的是 c # 或者 JAVA 这样的语言，那么使用 enum 可能是非常诱人的。但是，还有更好的模式，比如使用编译类型文字，如下所示:

```javascript
// Don't do this
enum Response {
  Successful,
  Failed,
  Pending
}

function fetchData (status: Response): void => {
    // some code.
}

// Do this
type Response = Sucessful | Failed | Pending

function fetchData (status: Response): void => {
    // some code.
}
```

## 总结

毫无疑问，使用 Typescript 会给你的代码增加很多额外的样板文件，但是这样做的好处是非常值得的。

为了使您的代码更干净、更好，不要忘记实现一个健壮的 [TODO/issue ](https://www.stepsize.com/?utm_source=dev.to&utm_medium=referral&utm_campaign=patterns "TODO/issue ")过程。它将帮助您的工程团队获得技术债务的可见性，在代码库问题上进行协作，并更好地规划冲刺。

本文译自：https://dev.to/alexomeyer/10-must-know-patterns-for-writing-clean-code-with-react-and-typescript-1m0g
