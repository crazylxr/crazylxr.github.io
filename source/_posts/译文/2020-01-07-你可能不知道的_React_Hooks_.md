---
layout: post
cid: 296
title: 你可能不知道的 React Hooks 
slug: 296
date: 2020/01/07 21:50:00
updated: 2020/01/21 12:10:04
status: publish
author: 桃翁
categories: 
  - 译文
  - 前端
tags: 
  - react
---


> 本文是译文，原文地址是：https://medium.com/@sdolidze/the-iceberg-of-react-hooks-af0b588f43fb

**React Hooks** 与类组件不同，它提供了用于优化和组合应用程序的简单方式，并且使用了最少的样板文件。

如果没有深入的知识，由于微妙的 bug 和抽象层漏洞，可能会出现性能问题，代码复杂性也会增加。

我已经创建了12个案例研究来演示常见的问题以及解决它们的方法。 我还编写了 **React Hooks Radar** 和 **React Hooks Checklist**，来推荐和快速参考。

## 案例研究： 实现 Interval

目标是实现计数器，从 0 开始，每 500 毫秒增加一次。 应提供三个控制按钮: 启动、停止和清除。

![](http://imgs.taoweng.site/2020-01-05-134726.gif)

### Level 0：Hello World

```javascript
export default function Level00() {
  console.log('renderLevel00');
  const [count, setCount] = useState(0);
  return (
    <div>
      count => {count}
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)}>-</button>
    </div>
  );
}
```

这是一个简单的、正确实现的计数器，用户单击时计数器的增加或减少。

### Level 1：setInterval

```javascript
export default function Level01() {
  console.log('renderLevel01');
  const [count, setCount] = useState(0);
  setInterval(() => {
    setCount(count + 1);
  }, 500);
  return <div>count => {count}</div>;
}
```

此代码的目的是每 500 毫秒增加计数器。 这段代码存在巨大的**内存泄漏**并且实现不正确。 它很容易让浏览器标签崩溃。 由于 Level01 函数在每次渲染发生时被调用，所以每次触发渲染时这个组件都会创建新的 interval。

> *突变、订阅、计时器、日志记录和其他副作用不允许出现在函数组件的主体中(称为 React 的 render 阶段)。 这样做会导致用户界面中的错误和不一致。*

[Hooks API Reference](https://reactjs.org/docs/hooks-reference.html): [useEffect](https://reactjs.org/docs/hooks-reference.html#useeffect)

### Level 2：useEffect

```javascript
export default function Level02() {
  console.log('renderLevel02');
  const [count, setCount] = useState(0);
  useEffect(() => {
    setInterval(() => {
      setCount(count + 1);
    }, 500);
  });
  return <div>Level 2: count => {count}</div>;
}
```

大多数副作用放在  `useEffect` 内部。 但是此代码还有巨大的资源泄漏，并且实现不正确。 `useEffect`  的默认行为是在每次渲染后运行，所以每次计数更改都会创建新的 **Interval**。

 [Hooks API Reference](https://reactjs.org/docs/hooks-reference.html): [useEffect](https://reactjs.org/docs/hooks-reference.html#useeffect), [Timing of Effects](https://reactjs.org/docs/hooks-reference.html#timing-of-effects).

### Level 3: 只运行一次

```javascript
export default function Level03() {
  console.log('renderLevel03');
  const [count, setCount] = useState(0);
  useEffect(() => {
    setInterval(() => {
      setCount(count + 1);
    }, 300);
  }, []);
  return <div>count => {count}</div>;
}
```

将**[]**作为 `useEffect` 的第二个参数，将在 mount 之后只调用一次 function。，即使只调用一次 setInterval，这段代码的实现也是不正确的。

虽然 **count** 会从 **0** 增加到 **1**，但是不会再增加，只会保持成 **1**。 因为箭头函数只被创建一次，所以箭头函数里面的 **count** 会一直为 0.

这段代码也存在微妙的资源泄漏。 即使在组件卸载之后，仍将调用 setCount。

[Hooks API Reference](https://reactjs.org/docs/hooks-reference.html): [useEffect](https://reactjs.org/docs/hooks-reference.html#useeffect), [Conditionally firing an effect](https://reactjs.org/docs/hooks-reference.html#conditionally-firing-an-effect).

### Level 4：清理

```javascript
useEffect(() => {
    const interval = setInterval(() => {
      setCount(count + 1);
    }, 300);
    return () => clearInterval(interval);
  }, []);
```

为了防止资源泄漏，Hooks 的生命周期结束时，必须清理所有内容。 在这种情况下，组件卸载后将调用返回的函数。

这段代码没有资源泄漏，但是实现不正确，就像之前的代码一样。

 [Hooks API Reference](https://reactjs.org/docs/hooks-reference.html): [Cleaning up an effect](https://reactjs.org/docs/hooks-reference.html#cleaning-up-an-effect).

### Level 5：使用 count 作为依赖项

```javascript
useEffect(() => {
  const interval = setInterval(() => {
    setCount(count + 1);
  }, 500);
  return () => clearInterval(interval);
}, [count]);
```

给 **useEffect** 提供依赖数组会改变它的生命周期。 在这个例子中，**useEffect** 在 **mount** 之后会被调用一次，并且每次 `count` 都会改变。 清理函数将在每次 `count` 更改时被调用以释放前面的资源。

这段代码工作正常，没有任何错误，但是还是有点不好，每 500 毫秒创建和释放 setInterval， 每个 setInterval 总是调用一次。

 [Hooks API Reference](https://reactjs.org/docs/hooks-reference.html): [useEffect](https://reactjs.org/docs/hooks-reference.html#useeffect), [Conditionally firing an effect](https://reactjs.org/docs/hooks-reference.html#conditionally-firing-an-effect).

### Level 6：setTimeout

```javascript
useEffect(() => {
  const timeout = setTimeout(() => {
    setCount(count + 1);
  }, 500);
  return () => clearTimeout(timeout);
}, [count]);
```

这段代码和上面的代码可以正常工作。 因为 useEffect 是在每次 count 更改时调用的，所以使用 setTimeout 与调用 setInterval 具有相同的效果。

这个例子效率很低，每次渲染发生时都会创建新的 setTimeout，React 有一个更好的方式来解决问题。

### Level 7：useState 的函数更新

```javascript
useEffect(() => {
  const interval = setInterval(() => {
    setCount(c => c + 1);
  }, 500);
  return () => clearInterval(interval);
}, []);
```

在前面的例子中，我们对每次 **count** 更改运行 **useEffect**，这是必要的，因为我们需要始终保持最新的当前值。

**useState** 提供 API 来更新以前的状态，而不用捕获当前值。 要做到这一点，我们需要做的就是向 setState 提供 lambda(匿名函数)。

这段代码工作正常，效率更高。 在组件的生命周期中，我们使用单个 `setInterval`， `clearInterval` 只会在卸载组件之后调用一次。

[Hooks API Reference](https://reactjs.org/docs/hooks-reference.html): [useState](https://reactjs.org/docs/hooks-reference.html#usestate), [Functional updates](https://reactjs.org/docs/hooks-reference.html#functional-updates).

### Level 8：局部变量

```javascript
export default function Level08() {
  console.log('renderLevel08');  
  const [count, setCount] = useState(0);  
  let interval = null;  
  
  const start = () => {
    interval = setInterval(() => {
      setCount(c => c + 1);
    }, 500);
  };  
  const stop = () => {
    clearInterval(interval);
  };  
  return (
    <div>
      count => {count}
      <button onClick={start}>start</button>
      <button onClick={stop}>stop</button>
    </div>
  );
}
```

我们增加了 start 和 stop 按钮。 此代码实现不正确，因为 stop 按钮不工作。 因为在每次渲染期间都会创建新的引用(指 interval 的引用)，因此 stop 函数里面 clearInterval 里面的 interval 是 null。

[Hooks API Reference](https://reactjs.org/docs/hooks-reference.html): [Is there something like instance variables?](https://reactjs.org/docs/hooks-faq.html#is-there-something-like-instance-variables)

### Level 9：useRef

```javascript
export default function Level09() {
  console.log('renderLevel09');  
  const [count, setCount] = useState(0);  
  const intervalRef = useRef(null); 
  
  const start = () => {
    intervalRef.current = setInterval(() => {
      setCount(c => c + 1);
    }, 500);
  };  
  
  const stop = () => {
    clearInterval(intervalRef.current);
  };  
  
  return (
    <div>
      count => {count}
      <button onClick={start}>start</button>
      <button onClick={stop}>stop</button>
    </div>
  );
}
```

如果需要变量，useRef 是首选的 Hook。 与局部变量不同，React 确保在每次渲染期间返回相同的引用。

这个代码看起来是正确的，但是有一个微妙的错误。 如果 start 被多次调用，那么 setInterval 将被多次调用，从而触发资源泄漏。

 [Hooks API Reference](https://reactjs.org/docs/hooks-reference.html): [useRef](https://reactjs.org/docs/hooks-reference.html#useref)

### Level 10: useCallback

```javascript
export default function Level10() {
  console.log('renderLevel10');  
  const [count, setCount] = useState(0);  
  const intervalRef = useRef(null);  
  
  const start = () => {
    if (intervalRef.current !== null) {
      return;
    }    
    intervalRef.current = setInterval(() => {
      setCount(c => c + 1);
    }, 500);
  };  
  
  const stop = () => {
    if (intervalRef.current === null) {
      return;
    }    
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };  
  
  return (
    <div>
      count => {count}
      <button onClick={start}>start</button>
      <button onClick={stop}>stop</button>
    </div>
  );
}
```

为了避免资源泄漏，如果 `interval` 已经启动，我们只需忽略调用。 尽管调用 `clearInterval (null)` 不会触发任何错误，但是只释放一次资源仍然是一个很好的实践。

此代码没有资源泄漏，实现正确，但可能存在性能问题。

**memoization** 是 **React** 中主要的性能优化工具。 **React.memo** 进行浅比较，如果引用相同，则跳过 render 阶段。

如果 **start** 函数 和 **stop** 函数被传递给一个 **memoized** 组件，整个优化就会失败，因为在每次渲染之后都会返回新的引用。

[**React Hooks: Memoization**](https://medium.com/@sdolidze/react-hooks-memoization-99a9a91c8853)

### Level 11: useCallback

```javascript
const intervalRef = useRef(null);  

const start = useCallback(() => {
    if (intervalRef.current !== null) {
      return;
    }    
    intervalRef.current = setInterval(() => {
      setCount(c => c + 1);
    }, 500);
  }, []);  

const stop = useCallback(() => {
  if (intervalRef.current === null) {
    return;
  }    
  
  clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);

	return (
    <div>
      count => {count}
      <button onClick={start}>start</button>
      <button onClick={stop}>stop</button>
    </div>
  );
}
```

为了使 **React.memo** 能够正常工作，我们需要做的就是使用 **useCallback** 来记忆(memoize)函数。 这样，每次渲染后都会提供相同的函数引用。

此代码没有资源泄漏，实现正确，没有性能问题，但代码相当复杂，即使对于简单的计数器也是如此。

[Hooks API Reference](https://reactjs.org/docs/hooks-reference.html): [useCallback](https://reactjs.org/docs/hooks-reference.html#usecallback)

### Level 12: 自定义 Hook

```javascript
function useCounter(initialValue, ms) {
  const [count, setCount] = useState(initialValue);
  const intervalRef = useRef(null);  
  
  const start = useCallback(() => {
    if (intervalRef.current !== null) {
      return;
    }    
    intervalRef.current = setInterval(() => {
      setCount(c => c + 1);
    }, ms);
  }, []);  
  
  const stop = useCallback(() => {
    if (intervalRef.current === null) {
      return;
    }    
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);  
  
  const reset = useCallback(() => {
    setCount(0);
  }, []);  
  
  return { count, start, stop, reset };
}
```

为了简化代码，我们需要将所有复杂性封装在 **useCounter** 自定义钩子中，并暴露 api: **{ count，start，stop，reset }。**

```javascript
export default function Level12() {
  console.log('renderLevel12');  
  const { count, start, stop, reset } = useCounter(0, 500);  
  
  return (
    <div>
      count => {count}
      <button onClick={start}>start</button>
      <button onClick={stop}>stop</button>
      <button onClick={reset}>reset</button>
    </div>
  );
}
```

[Hooks API Reference](https://reactjs.org/docs/hooks-reference.html): [Using a Custom Hook](https://reactjs.org/docs/hooks-custom.html#using-a-custom-hook)

## React Hooks Radar

![](https://miro.medium.com/max/3840/0*Px-sg5tvCOOlPcJb.jpeg)

### Green

绿色 hooks 是现代 React 应用程序的主要构件。 它们几乎在任何地方都可以安全地使用，而不需要太多的思考

1. `useReducer` 
2. `useState`
3. `useContext`

### Yellow

黄色 hooks 通过使用记忆(memoize)提供了有用的性能优化。 管理生命周期和输入应该谨慎地进行。

1. `useCallback`
2. `useMemo`

### Red

红色 hooks 与易变的世界相互作用，使用副作用。 它们是最强大的，应该极其谨慎地使用。 自定义 hooks 被推荐用于所有重要用途的情况。

1. `useRef`
2. `useEffect`
3. `useLayoutEffect`

## 用好 React Hooks 的清单

1. 服从[Rules of Hooks 钩子的规则](https://reactjs.org/docs/hooks-rules.html).
2. 不要在主渲染函数中做任何副作用
3. 取消订阅 / 弃置 / 销毁所有已使用的资源
4. Prefer 更喜欢`useReducer` or functional updates for 或功能更新`useState`to prevent reading and writing same value in a hook. 防止在钩子上读写相同的数值
5. 不要在渲染函数中使用可变变量，而应该使用`useRef`
6. 如果你保存在`useRef` 的值的生命周期小于组件本身，在处理资源时不要忘记取消设置值
7. 谨慎使用无限递归导致资源衰竭
8. 在需要的时候使用 Memoize 函数和对象来提高性能
9.  正确捕获输入依赖项(`undefined`=> 每一次渲染,`[a, b]` =>  当`a` or 或`b`改变的时候渲染, 改变,`[]` => 只改变一次)
10. 对于复杂的用例可以通过自定义 Hooks 来实现。

