---
title: 订阅
description: 订阅
sidebar:
  order: 4
---

subscribe 可以订阅一个状态，当状态变化时，会触发回调函数。

## 订阅状态

只要 store 的 state 发生变化，就会触发回调函数。

```ts
const useCountStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));

export default useCountStore;
```

外部订阅

```ts
useCountStore.subscribe((state) => {
  console.log("Count changed:", state.count);
});
```

组件内部订阅

```tsx
useEffect(() => {
  useCountStore.subscribe((state) => {
    console.log("count changed:", state.count);
  });
}, []);
```

## 案例

比如观察 age 的变化，如果使用选择器的写法， age 每次更新都会重新渲染组件，这会导致组件的频繁渲染：

```ts
import { create } from "zustand";

const useUserStore = create((set) => ({
  name: "张三",
  age: 18,
}));

export default useUserStore;
```

```tsx
import useUserStore from "@/store/user";
import { useShallow } from "zustand/shallow";

export default function Home() {
  // age 变化时，组件都会重新渲染
  const { age } = useUserStore(
    useShallow((state) => ({
      age: state.age,
    })),
  );

  return <div>{age}</div>;
}
```

性能优化：采用订阅的模式， age 变化的时候，会调用回调函数，但是不会重新渲染组件：

```tsx
import useUserStore from "@/store/user";
import { useState } from "react";

export default function Home() {
  const [status, setStatus] = useState("未知");

  // 只会更新一次组件
  useUserStore.subscribe((state) => {
    if (state.age >= 18) {
      setStatus("成年人");
    } else {
      setStatus("未成年");
    }
  });

  return <div>{status}</div>;
}
```

持续优化：目前的订阅只要是 store 内部任意的 state 发生变化，都会触发回调函数，我们希望只订阅 age 的变化，可以使用中间件 `subscribeWithSelector` 订阅单个状态：

```ts
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

const useUserStore = create(
  subscribeWithSelector((set) => ({
    name: "张三",
    age: 18,
  })),
);

export default useUserStore;
```

```tsx
import useUserStore from "@/store/user";
import { useState } from "react";

export default function Home() {
  const [status, setStatus] = useState("未知");

  useUserStore.subscribe(
    (state) => state.age,
    (age, prevAge) => {
      if (age >= 18) {
        setStatus("成年人");
      } else {
        setStatus("未成年");
      }
    },
  );

  return <div>{status}</div>;
}
```

subscribe 会返回一个取消订阅的函数，可以手动取消订阅：

```tsx
const unSubscribe = useUserStore.subscribe((state) => {
  console.log("监听到状态变化", state);
});

// 取消订阅
unSubscribe();
```

当使用了`subscribeWithSelector`中间件时，会多出来第三个参数`options`：

```tsx
import useUserStore from "@/store/user";
import { useState } from "react";

export default function Home() {
  const [status, setStatus] = useState("未知");

  const unSubscribe = useUserStore.subscribe(
    (state) => state.age,
    (age, prevAge) => {
      if (age >= 18) {
        setStatus("成年人");
      } else {
        setStatus("未成年");
      }
    },
    {
      // 比较函数：默认是浅比较，如果需要深比较，可以传入一个比较函数
      equalityFn: (a, b) => a === b,
      // 默认是false，如果设置为true，则会在订阅时立即调用一次回调函数，传入当前状态和undefined作为参数
      fireImmediately: true,
    },
  );

  return <div>{status}</div>;
}
```
