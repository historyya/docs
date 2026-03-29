---
title: 状态处理
description: 状态处理
sidebar:
  order: 2
---

:::note

zustand的set函数与useState的setState函数的区别

```tsx
import { useEffect, useState } from "react";

function App() {
  const [state, setState] = useState({
    name: "admin",
    age: 18,
    price: 100,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setState((prevState) => ({
        ...prevState, // 在zustand中，set函数会自动合并第一层状态，不需要手写这行代码
        price: prevState.price + 1, // 更新状态
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return <div></div>;
}
```

:::

## 深层次状态处理

1. zustand 会自动合并第一层的 state
2. 对于深层次的状态更新，需要使用到 immer 中间件来解决

### 基础实现

```ts
import { create } from "zustand";

interface User {
  user: {
    name: string;
    age: number;
  };
  updateUser: () => void;
}

const useUserStore = create<User>((set, get) => ({
  user: {
    name: "admin",
    age: 18,
  },
  updateUser: () =>
    set((prevState) => ({
      user: {
        ...prevState.user, // 需要手动合并状态
        age: prevState.user.age + 1,
      },
    })),
}));

export default useUserStore;
```

:::note
注意：如果不进行状态合并，其他状态会丢失。每次更新都需要手动合并状态，在实际开发中会变得繁琐。
:::

## 使用 immer 中间件

### 基础用法

```ts
const data = {
  user: {
    name: "admin",
    age: 18,
  },
};

// 使用produce创建新状态
const newData = produce(data, (draft) => {
  // 直接修改draft对象，immer会自动生成新的状态
  draft.user.age += 1;
});

console.log(newData); // 输出: { user: { name: 'admin', age: 19 } }
console.log(data); // 输出: { user: { name: 'admin', age: 18 } }
```

### 在 zustand 中使用

```ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface User {
  user: {
    name: string;
    age: number;
  };
  updateUser: () => void;
}

const useUserStore = create<User>()(
  immer((set) => ({
    user: {
      name: "admin",
      age: 18,
    },
    updateUser: () =>
      set((prevState) => {
        prevState.user.age += 1;
      }),
  })),
);

export default useUserStore;
```

## immer 原理刨析
