---
title: tsx语法
description: tsx语法
sidebar:
  order: 0
---

## 绑定变量

```tsx
function App() {
  // 支持字符串、数字、普通类型数组、dom元素
  const num = 123;

  return (
    <>
      <div>{num}</div>
    </>
  );
}
```

## 绑定class

```tsx
function App() {
  const active = "active";

  return (
    <>
      <div className={active}>Home</div>
      {/* 绑定多个class */}
      <div className={`container ${active}`}>Home</div>
    </>
  );
}
```

## 绑定事件

```tsx
import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    console.log("Button clicked!");
  };

  return (
    <>
      <button onClick={handleClick}>Click me</button>
      {/* 函数传参 */}
      <button onClick={() => setCount(count + 1)}>+1</button>
    </>
  );
}
```

## 遍历dom元素

```tsx
function App() {
  const arr: number[] = [1, 2, 3];

  return (
    <>
      <ul>
        {arr.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </>
  );
}
```

## 渲染HTML代码片段

```tsx
function App() {
  const str = "<h1>标题一</h1>";

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: str }} />
    </>
  );
}
```

## 支持泛型函数

```tsx
function App() {
  // 需要在函数名后面加上<T,>，来告诉编译器这是一个泛型函数
  const handleClick = <T,>(params: T) => {
    console.log(params);
  };

  return (
    <>
      <button onClick={() => handleClick(123)}>Click</button>
    </>
  );
}
```
