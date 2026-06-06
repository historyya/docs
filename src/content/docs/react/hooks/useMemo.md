---
title: useMemo
description: useMemo
sidebar:
  order: 25
---

:::tip
`useMemo`是一个性能优化的hook。它的功能是通过记忆上一次的计算结果，仅当依赖项变化时才会重新计算，提高性能。
:::

## react组件的渲染条件

1. 组件的props发生变化
2. 组件的state发生变化
3. useContext发生变化

## 用法

```tsx
import { useMemo, useReducer, useState } from "react";
import { Input } from "./components/ui/input";

const initState = [
  { id: 1, name: "Apple", price: 10, count: 10, isSale: false },
  { id: 2, name: "Banana", price: 20, count: 20, isSale: true },
  { id: 3, name: "Orange", price: 30, count: 30, isSale: false },
];

type State = typeof initState;
type Action = {
  type: "ADD_COUNT" | "SUB_COUNT";
  id: number;
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_COUNT":
      return state.map((item) =>
        item.id === action.id ? { ...item, count: item.count + 1 } : item,
      );
    case "SUB_COUNT":
      return state.map((item) =>
        item.id === action.id
          ? { ...item, count: Math.max(0, item.count - 1) }
          : item,
      );
    default:
      return state;
  }
};

function App() {
  const [key, setKey] = useState("");
  const [state, dispatch] = useReducer(reducer, initState);

  // 参数：
  // 1. 回调函数：返回需要缓存的值。
  // 2. 依赖数组：依赖项发生变化时，回调函数会重新执行。
  // 返回值：返回需要缓存的值。
  const totalPrice = useMemo(() => {
    console.log("Calculating total price...");
    return state.reduce((acc, item) => acc + item.price * item.count, 0);
  }, [state]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans text-gray-800">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Product Management
          </h2>
          <Input
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Search..."
            className="w-full sm:max-w-xs bg-white"
          />
        </div>
        <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead className="bg-gray-50/80 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">
                  ID
                </th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">
                  Name
                </th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">
                  Total Price
                </th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">
                  Count
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {state.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No products found.
                  </td>
                </tr>
              ) : (
                state.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50/50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 text-gray-500">{item.id}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      ${(item.price * item.count).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          disabled={item.count <= 0}
                          onClick={() =>
                            dispatch({ type: "SUB_COUNT", id: item.id })
                          }
                          className="flex items-center justify-center w-8 h-8 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 active:bg-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                          aria-label="Decrease count"
                        >
                          -
                        </button>
                        <span className="min-w-6 text-center font-medium">
                          {item.count}
                        </span>
                        <button
                          onClick={() =>
                            dispatch({ type: "ADD_COUNT", id: item.id })
                          }
                          className="flex items-center justify-center w-8 h-8 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 active:bg-gray-300 transition-all"
                          aria-label="Increase count"
                        >
                          +
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot className="bg-gray-50 border-t border-gray-200">
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-4 text-right text-base font-semibold text-gray-900"
                >
                  Total Value:{" "}
                  <span className="text-blue-600">
                    ${totalPrice.toFixed(2)}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
```

### 总结

1. 使用场景

- 当需要缓存复杂计算结果时
- 当需要避免不必要的重新计算时
- 当计算逻辑复杂且耗时时

2. 优点

- 通过记忆避免不必要的重新计算
- 提供应用性能
- 减少资源消耗

3. 注意事项

- 不要过度使用，只在确实需要优化的组件上使用
- 如果依赖项经常变化，使用后的效果会大打折扣
- 如果计算逻辑简单，使用后的开销可能比重新计算还大

:::tip
`React.memo`通过记忆上一次的计算结果，仅当props发生变化时才会重新渲染，避免重新渲染，提供性能。
:::

## React.memo 用法

```tsx
import React, { useState } from "react";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";

interface User {
  name: string;
  age: number;
  addr: string;
}

function App() {
  const [key, setKey] = useState("");
  const [user, setUser] = useState<User>({
    name: "admin",
    age: 18,
    addr: "beijing",
  });

  const handleChangeUser = () => {
    setUser((prevUser) => ({
      ...prevUser,
      name: key,
    }));
  };

  return (
    <div className="p-4">
      <Input
        value={key}
        onChange={(e) => setKey(e.target.value)}
        placeholder="Enter user key"
        className="mb-4"
      />
      <UserCard user={user} />
      <Button onClick={handleChangeUser}>Change User</Button>
    </div>
  );
}

export default App;

interface UserCardProps {
  user: User;
}

const UserCard = React.memo(({ user }: UserCardProps) => {
  console.log("UserCard rendered");

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">{user.name}</h2>
      <p className="text-gray-600 mb-1">Age: {user.age}</p>
      <p className="text-gray-600">Address: {user.addr}</p>
    </div>
  );
});
```

### 总结

1. 使用场景

- 当子组件接收的props不经常变化时
- 当组件重新渲染的开销较大时
- 当需要避免不必要的渲染时

2. 优点

- 通过记忆避免不必要的重新渲染
- 提供应用性能
- 减少资源消耗

3. 注意事项

- 不要过度使用，只在确实需要优化的组件上使用
- 对于简单的组件，使用`memo`的开销可能比重新渲染还大
- 如果props经常变化，`memo`的效果会大打折扣
