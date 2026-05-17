---
title: useSyncExternalStore
description: useSyncExternalStore
sidebar:
  order: 4
---

:::tip
`useSyncExternalStore`用于从外部 store (zustand等)获取状态并在组件中同步显示。
:::

## 使用

### 订阅外部 store

示例代码 (无法运行)

```tsx
import { useSyncExternalStore } from "react";

const subscribe = (callback: () => void) => {
  // 订阅store
  callback();

  // 并返回一个取消订阅函数
  return () => {
    // 取消订阅
  };
};

// 从store中读取数据的快照
const getSnapshot = () => {
  return null;
};

const getServerSnapshot = () => {};

function App() {
  // subscribe：用于订阅数据源的变化，接收一个回调函数，在数据源更新时调用该回调函数
  // getSnapshot：获取当前数据源的快照(状态)
  // getServerSnapshot?：在服务器端渲染时用来获取数据源的快照
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  return <div></div>;
}

export default App;
```

### 订阅浏览器 API

```ts
// src/hooks/useHistory.ts
import { useSyncExternalStore } from "react";

export const useHistory = () => {
  const subscribe = (callback: () => void) => {
    window.addEventListener("popstate", callback);
    window.addEventListener("hashchange", callback);
    return () => {
      window.removeEventListener("popstate", callback);
      window.removeEventListener("hashchange", callback);
    };
  };

  const getSnapshot = () => {
    return window.location.href;
  };

  const push = (path: string) => {
    window.history.pushState(null, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const replace = (path: string) => {
    window.history.replaceState(null, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const res = useSyncExternalStore(subscribe, getSnapshot);

  return [res, push, replace] as const;
};
```

```tsx
import { useHistory } from "./hooks/useHistory";

function App() {
  /**
   * 效果：
   *  1. state返回当前路径。每次URL变化，会触发更新
   *  2. push和replace，调用push实现跳转
   */
  const [state, push, replace] = useHistory();

  return (
    <div>
      <h2>当前URL: {state}</h2>
      <button
        onClick={() => {
          push("/home");
        }}
      >
        跳转
      </button>
      <button
        onClick={() => {
          replace("/about");
        }}
      >
        替换
      </button>
    </div>
  );
}

export default App;
```

### 把逻辑抽取到自定义 Hook

```ts
// src/hooks/useStorage.ts
import { useSyncExternalStore } from "react";

export const useStorage = (key: string, defaultValue?: any) => {
  const subscribe = (callback: () => void) => {
    window.addEventListener("storage", (event) => {
      console.log("event: ", event);
      callback();
    });
    return () => window.removeEventListener("storage", callback);
  };

  const getSnapshot = () => {
    return (
      (localStorage.getItem(key)
        ? JSON.parse(localStorage.getItem(key)!)
        : null) || defaultValue
    );
  };

  const setStorage = (value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
    // 手动触发storage事件
    window.dispatchEvent(new StorageEvent("storage"));
  };

  const res = useSyncExternalStore(subscribe, getSnapshot);

  return [res, setStorage];
};
```

```tsx
import { useStorage } from "./hooks/useStorage";

function App() {
  /**
   * 效果：
   *  1. count的值被持久化，缓存到localStorage中
   *  2. 跨标签页同步，在多个标签页打开该应用，任意标签页修改count的值，其他标签页会实时更新
   */
  const [count, SetCount] = useStorage("count", 1);

  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={() => SetCount(count + 1)}>+</button>
    </div>
  );
}

export default App;
```

## 注意

如果`getSnapshot`返回值不同于上一次，react会重新渲染组件。这就是为什么，如果总是返回一个不同的值，会进入到一个无限循环，并产生这个报错。

```ts
function getSnapshot() {
  // 🔴 getSnapshot 不要总是返回不同的对象
  return {
    todos: myStore.todos,
  };
}
```

只有当确实有东西改变了，`getSnapshot`才应该返回一个不同的对象。如果你的store包含不可变数据，可以直接返回此数据：

```ts
function getSnapshot() {
  // ✅ 你可以返回不可变数据
  return myStore.todos;
}
```
