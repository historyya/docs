---
title: install
description: install
sidebar:
  order: 1
---

## 基本使用

```ts
// src/store/price.ts
import { create } from "zustand";

// 1. 定义接口，用于描述状态管理器的状态和操作
interface PriceStore {
  price: number;
  incrementPrice: () => void;
  decrementPrice: () => void;
  resetPrice: () => void;
  getPrice: () => number;
}

/**
 * 2. 创建一个状态管理器，使用 create 函数，并传入一个函数，该函数接受 set 和 get 作为参数，返回一个对象。
 *    - set: 用于更新状态的函数，可以接受一个函数作为参数，该函数接收当前状态并返回一个新的状态对象。
 *    - get: 用于获取当前状态的函数，可以直接调用 get() 来获取整个状态对象。
 */
const usePriceStore = create<PriceStore>((set, get) => ({
  price: 0, // 初始价格为 0
  incrementPrice: () => set((state) => ({ price: state.price + 1 })), // 增加价格
  decrementPrice: () => set((state) => ({ price: state.price - 1 })), // 减少价格
  resetPrice: () => set({ price: 0 }), // 重置价格为 0
  getPrice: () => get().price, // 获取当前价格
}));

export default usePriceStore;
```

```tsx
// src/App.tsx
import usePriceStore from "@/store/price";

function App() {
  const { price, incrementPrice, decrementPrice, resetPrice, getPrice } =
    usePriceStore();

  return (
    <div>
      <h1>当前价格: {price}</h1>
      <button onClick={incrementPrice}>增加价格</button>
      <button onClick={decrementPrice}>减少价格</button>
      <button onClick={resetPrice}>重置价格</button>
      <button onClick={() => alert(getPrice())}>获取当前价格</button>
    </div>
  );
}

export default App;
```
