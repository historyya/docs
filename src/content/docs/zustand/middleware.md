---
title: 中间件
description: 中间件
sidebar:
  order: 3
---

中间件是用在于状态管理过程中添加额外逻辑的工具。可以用于日志记录、性能监控、数据持久化、异步操作等。

## 自定义中间件

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

/**
 *
 * set：原始的状态更新函数，用于修改 store 的状态
 * get：获取当前 store 的状态值
 * api：包含 store 的完整 API (如 setState, getState, subscribe, destroy 等方法)
 *
 */

// 日志中间件
const logger = (config: any) => (set: any, get: any, api: any) =>
  config(
    (args: any) => {
      console.log("prev state", get());
      set(args);
      console.log("next state", get());
    },
    get,
    api,
  );

const useUserStore = create<User>()(
  immer(
    logger((set) => ({
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
  ),
);

export default useUserStore;
```

## persist

persist 是一个用于持久化状态的工具。

```ts
// src/store/user.ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

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
  immer(
    persist(
      (set) => ({
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
      }),
      {
        name: "user-storage", // 存储的 key
        storage: createJSONStorage(() => localStorage), // 使用 localStorage 进行存储
        partialize: (state) => ({
          // 选择要持久化的状态部分
          name: state.name,
        }),
      },
    ),
  ),
);

export default useUserStore;
```

在组件中可以调用`clearStorage`方法来清空缓存。

```tsx
export default function Home() {
  return (
    <div>
      <button onClick={() => useUserStore.persist.clearStorage()}>
        清空缓存
      </button>
    </div>
  );
}
```
