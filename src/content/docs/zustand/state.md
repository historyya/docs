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
import { produce } from "immer";

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

immer 通过 Proxy 代理对象的所有操作，实现不可变数据的更新。当对数据进行修改时，immer 会创建一个被修改对象的副本，并在副本上进行修改，最后返回修改后的新对象，而原始对象保持不变。这种机制确保了数据的不可变性，同时提供了直观的修改方式。

immer 的核心原理基于以下两个概念：

1. 写时复制 (Copy-on-Write)
   - 无修改时，直接返回原对象
   - 有修改时，创建新对象

2. 惰性代理 (Lazy Proxy)
   - 按需创建代理
   - 通过 Proxy 拦截操作
   - 延迟代理创建

### 简化实现其核心

```ts
/**
 * 1. 拦截读写操作，把所有的变更存在在副本中，创建produce函数
 * 2. 读取(handler)的时候判断是否存在副本中，存在则返回副本中的值，否则返回原始值
 * 3. 读取的时候如果是对象，则递归创建代理
 * 4. 返回proxy并且变成原始对象
 */

type Draft<T> = {
  -readonly [P in keyof T]: T[P];
};

function produce<T>(base: T, recipe: (draft: Draft<T>) => void): T {
  // 用于存储修改过的对象
  const modified: Record<string, any> = {};

  const handler = {
    get(target: any, prop: string, receiver: any) {
      // 如果这个对象已经被修改过，返回修改后的对象
      if (prop in modified) {
        return modified[prop];
      }

      // 如果访问的是对象，则递归创建代理
      if (typeof target[prop] === "object" && target[prop] !== null) {
        return new Proxy(target[prop], handler);
      }
      // return target[prop];

      return Reflect.get(target, prop, receiver);
    },
    set(target: any, prop: string, value: any) {
      // 记录修改
      // modified[prop] = value;
      // return true;

      return Reflect.set(modified, prop, value);
    },
  };

  // 创建代理对象
  const proxy = new Proxy(base, handler);

  // 执行修改函数
  recipe(proxy);

  // 如果没有修改，直接返回原对象
  if (Object.keys(modified).length === 0) {
    return base;
  }

  // 创建新对象，只复制修改过的属性
  return JSON.parse(JSON.stringify(proxy));
}

// 使用示例
const obj = {
  user: {
    name: "zhangsan",
    age: 18,
  },
};

const newObj = produce(obj, (draft) => {
  draft.user.name = "lisi";
  draft.user.age = 20;
});

console.log(newObj); // { user: { name: 'lisi', age: 20 } }
console.log(obj); // { user: { name: 'zhangsan', age: 18 } }
```

## 状态简化

在组件中通过解构的方式引入状态，会引发一个问题。例如A组件用到了`hobby.read`，但是B组件没有用到`hobby.read`，但是更新`hobby.read`状态时，A组件和B组件都会重新渲染，这会导致不必要的重渲染，因为B组件并没有用到`hobby.read`。

```ts
// src/store/user.ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface User {
  name: string;
  age: number;
  hobby: {
    sing: string;
    dance: string;
    read: string;
  };
  setHobbySing: (hobby: string) => void;
  setHobbyRead: (hobby: string) => void;
}

const useUserStore = create<User>()(
  immer((set) => ({
    name: "张三",
    age: 18,
    hobby: {
      sing: "生日歌",
      dance: "霹雳舞",
      read: "历史书",
    },
    setHobbySing(sing: string) {
      set((state) => {
        state.hobby.sing = sing;
      });
    },
    setHobbyRead(read: string) {
      set((state) => {
        state.hobby.read = read;
      });
    },
  })),
);

export default useUserStore;
```

```tsx
// src/components/Left.tsx
import useUserStore from "@/store/user";

export function Left() {
  console.log("Left Render");
  const { name, age, hobby, setHobbySing, setHobbyRead } = useUserStore();

  return (
    <div>
      <h1>Left</h1>
      <p>姓名：{name}</p>
      <p>年龄：{age}</p>
      <p>爱好：</p>
      <ul>
        <li>唱歌：{hobby.sing}</li>
        <li>跳舞：{hobby.dance}</li>
        <li>读书：{hobby.read}</li>
      </ul>
      <button onClick={() => setHobbySing("华语歌")}>修改唱歌爱好</button>
      <button onClick={() => setHobbyRead("小说")}>修改读书爱好</button>
    </div>
  );
}
```

```tsx
// src/components/Right.tsx
import useUserStore from "@/store/user";

export function Right() {
  console.log("Right Render");

  const { name } = useUserStore();

  return (
    <div>
      <h1>Right</h1>
      <p>姓名：{name}</p>
    </div>
  );
}
```

## 状态选择器

状态选择器可以让我们只选择需要的部分状态，这样就不会引发不必要的重渲染。

```tsx
// src/components/Right.tsx
import useUserStore from "@/store/user";

export function Right() {
  console.log("Right Render");

  const name = useUserStore((state) => state.name);
  const sing = useUserStore((state) => state.hobby.sing);

  return (
    <div>
      <h1>Right</h1>
      <p>姓名：{name}</p>
      <p>爱好：{sing}</p>
    </div>
  );
}
```

## useShallow

如果一个属性很多，岂不是要写疯了。但是用解构又会造成不必要的重渲染。这时可以使用`useShallow`来避免这个问题。

:::note
`useShallow` 只检查顶层对象的引用是否变化，如果顶层对象的引用没有变化 (即使其内部属性或子对象发生了变化，但这些变化不影响顶层对象的引用)，使用`useShallow`的组件将不会重新渲染。
:::

```tsx
// src/components/Right.tsx
import useUserStore from "@/store/user";
import { useShallow } from "zustand/react/shallow";

export function Right() {
  console.log("Right Render");

  const { name, sing } = useUserStore(
    useShallow((state) => ({
      name: state.name,
      sing: state.hobby.sing,
    })),
  );

  return (
    <div>
      <h1>Right</h1>
      <p>姓名：{name}</p>
      <p>爱好：{sing}</p>
    </div>
  );
}
```
