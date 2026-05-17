---
title: useLayoutEffect
description: useLayoutEffect
sidebar:
  order: 21
---

## 用法

### 应用场景

- 需要同步读取或更改DOM：比如需要读取元素的大小或位置并在渲染前进行调整
- 防止闪烁：在某些情况下，使用useEffect修改DOM可能会导致布局可见的跳动或闪烁
- 模拟生命周期方法：需要模拟类组件的同步行为

案例代码

```tsx
import { useLayoutEffect } from "react";

// 记录页面滚动条位置，当用户刷新或返回该页面时，滚动到之前记录的位置，增强用户体验

function App() {
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;

    requestAnimationFrame(() => {
      const params = new URLSearchParams(window.location.search);
      params.set("scrollTop", scrollTop.toString());
      window.history.replaceState(null, "", `?${params.toString()}`);
    });
  };

  useLayoutEffect(() => {
    const container = document.getElementById(
      "container",
    ) as HTMLDivElement | null;

    const params = new URLSearchParams(window.location.search);
    const scrollTop = params.get("scrollTop");

    if (scrollTop && container) {
      container.scrollTop = parseInt(scrollTop, 10);
    }
  }, []);

  return (
    <div
      id="container"
      onScroll={handleScroll}
      className="h-screen overflow-y-auto"
    >
      {Array.from({ length: 500 }).map((_, i) => {
        return (
          <div key={i} className="p-2 border-b">
            {i}
          </div>
        );
      })}
    </div>
  );
}

export default App;
```

## 区别

| 区别     | useLayoutEffect                  | useEffect                        |
| -------- | -------------------------------- | -------------------------------- |
| 执行时机 | 浏览器完成布局和**绘制之前**执行 | 浏览器完成布局和**绘制之后**执行 |
| 执行方式 | 同步执行                         | 异步执行                         |
| DOM渲染  | 阻塞DOM渲染                      | 不阻塞DOM渲染                    |

### 测试DOM阻塞

```tsx
import { useEffect, useLayoutEffect, useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  // 不阻塞DOM
  // h2会先渲染出来，之后才会执行useEffect中的代码
  // useEffect(() => {
  //   for (let i = 0; i < 50000; i++) {
  //     setCount((count) => count + 1);
  //   }
  // }, []);

  // 阻塞DOM
  // h2会等useLayoutEffect中的代码执行完才会一起渲染出来
  useLayoutEffect(() => {
    for (let i = 0; i < 50000; i++) {
      setCount((count) => count + 1);
    }
  }, []);

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h2>App</h2>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>{i}</div>
      ))}
    </div>
  );
}

export default App;
```

### 测试同步异步渲染

```tsx
import { useEffect, useLayoutEffect, useState } from "react";

function App() {
  const [showApp1, setShowApp1] = useState(false);
  const [showApp2, setShowApp2] = useState(false);

  // useEffect：在浏览器完成绘制后异步执行
  // 这里将 showApp1 设为 true，触发重渲染，产生完整的淡入动画
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowApp1(true);
    }, 10);

    return () => clearTimeout(timer);
  }, []);

  // useLayoutEffect：在 DOM 更新后同步执行（阻塞绘制）
  // 这里将 showApp2 设为 true，浏览器首次绘制时直接渲染最终状态，无过渡动画
  useLayoutEffect(() => {
    setShowApp2(true);
  }, []);

  return (
    <div className="relative">
      <div
        className={`
          w-50 h-50 bg-red-500 
          transition-opacity duration-3000 ease-in-out
          ${showApp1 ? "opacity-100" : "opacity-0"}
        `}
      >
        app1 显示动画版
      </div>

      <div
        className={`
          w-50 h-50 bg-blue-500 
          mt-5 absolute top-57.5 
          transition-opacity duration-3000 ease-in-out
          ${showApp2 ? "opacity-100" : "opacity-0"}
        `}
      >
        app2 无动画版
      </div>
    </div>
  );
}

export default App;
```
