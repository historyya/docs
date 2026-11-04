---
title: useEffect
description: useEffect
sidebar:
  order: 20
---

## 用法

### 操作DOM

```tsx
import { useEffect } from "react";

function App() {
  const el = document.getElementById("title");
  console.log(el); // null

  useEffect(() => {
    const el = document.getElementById("title");
    console.log(el); // <h1 id="title">A</h1>
  }, []);

  return (
    <div>
      <h1 id="title">A</h1>
    </div>
  );
}

export default App;
```

### 发送网络请求

```tsx
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

function App() {
  const [userId, setUserId] = useState(1);
  const [data, setData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/users/${userId}`,
          { signal: controller.signal },
        );
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        setData(data);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    return () => controller.abort();
  }, [userId]);

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="my-0! mb-6! text-2xl! font-semibold! tracking-tight!">
        User Data
      </h1>

      <label className="mb-6 flex items-center gap-3 text-sm text-muted-foreground">
        User ID
        <Input
          type="number"
          value={userId}
          onChange={(e) => setUserId(parseInt(e.target.value) || 1)}
          min={1}
          max={10}
          className="w-20"
        />
      </label>

      <div className="rounded-lg border border-border bg-card p-5 text-sm">
        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : error ? (
          <p className="text-destructive">Error: {error.message}</p>
        ) : data ? (
          <pre>{JSON.stringify(data, null, 2)}</pre>
        ) : null}
      </div>
    </div>
  );
}

export default App;
```

### 防抖

```tsx
import { useEffect, useState } from "react";
import { Input } from "./components/ui/input";

function App() {
  const [userId, setUserId] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
    }, 1000);

    return () => clearTimeout(timer);
  }, [userId]);

  return (
    <div>
      <Input
        type="number"
        value={userId}
        onChange={(e) => setUserId(Number(e.target.value))}
      />
    </div>
  );
}

export default App;
```

### 执行时机

1. 组件挂载时执行一次（空数组）
2. 组件更新时执行（依赖项发生变化）
3. 组件卸载时执行（清理函数）

### 返回值

```tsx
import { useEffect } from "react";

function App() {
  const a = useEffect(() => {});
  console.log(a); // undefined

  return <div>App</div>;
}

export default App;
```

## 副作用函数

1. 副作用函数在执行时会改变外部状态或依赖外部可变状态

```ts
let num = 0;

const calculateDouble = () => {
  // 修复函数外部环境的值
  num = num * 2;

  // 修改localStorage
  localStorage.setItem("num", num);
};
```

## 纯函数

1. 输入决定输出：相同的输入永远会得到相同的输出。
2. 无副作用：纯函数不会修改外部状态，也不会依赖外部可变状态。

```ts
const sum = (a: number, b: number): number => {
  return a + b;
})

sum(1, 2)  // 3
```
