---
title: useRef
description: useRef
sidebar:
  order: 22
---

:::tip
需要处理DOM元素或需要在组件渲染之间保持持久性数据时使用useRef。
:::

## 用法

### 操作DOM元素

```tsx
import { useRef } from "react";
import { Button } from "./components/ui/button";

function App() {
  // 参数：初始值，可以是任意类型。这个参数在首次渲染后会被忽略。
  // 返回值：一个可变的 ref 对象，其 .current 属性被初始化为传入的参数（initialValue）。返回的 ref 对象在组件的整个生命周期内保持不变。
  const h2Ref = useRef<HTMLHeadingElement>(null);

  const handleClick = () => {
    if (h2Ref.current) {
      console.log(h2Ref.current); // 获取 DOM 元素
    }
  };

  return (
    <>
      <h2 ref={h2Ref}>标题</h2>
      <Button onClick={handleClick}>GET DOM Element</Button>
    </>
  );
}

export default App;
```

### 数据存储

```tsx
import { useRef, useState } from "react";
import { Button } from "./components/ui/button";

function App() {
  const [count, setCount] = useState(0);
  const num = useRef(0); // 使用 useRef 来存储一个可变的值

  const handleClick = () => {
    setCount(count + 1);
    num.current = count;
  };

  return (
    <>
      <h2>新值：{count}</h2>
      <h3>旧值：{num.current}</h3>
      <Button onClick={handleClick}>+</Button>
    </>
  );
}

export default App;
```

### 场景案例

```tsx
import { useRef, useState } from "react";
import { Button } from "./components/ui/button";

function App() {
  const [count, setCount] = useState(0);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const handleStart = () => {
    timer.current = setInterval(() => {
      setCount((prev) => prev + 1);
    }, 100);
  };

  const handleStop = () => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  };

  return (
    <>
      <h2>计时器：{count}</h2>
      <Button onClick={handleStart}>开始</Button>
      <Button onClick={handleStop}>停止</Button>
    </>
  );
}

export default App;
```

## 注意事项

1. 组件在重新渲染时，useRef的值不会被重新初始化
2. 改变ref.current属性时，不会重新渲染组件。因为ref是一个普通的JavaScript对象
3. useRef的值不能作为useEffect等hooks的依赖项，因为它不是一个响应式状态
4. useRef不能直接获取子组件的实例，需要使用forwardRef
