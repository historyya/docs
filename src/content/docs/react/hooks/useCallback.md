---
title: useCallback
description: useCallback
sidebar:
  order: 26
---

:::tip
`useCallback`用于性能优化，返回一个记忆化的回调函数，可以减少不必要的重新渲染。用于缓存组件内的函数，避免函数的重复创建。
:::

## 用法

案例一

```tsx
import { useCallback, useState } from "react";
import { Input } from "./components/ui/input";

const fnMap = new WeakMap();

let count = 1;

function App() {
  console.log("App component rendered");

  const [key, setKey] = useState("");

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setKey(e.target.value);
  }, []);

  if (!fnMap.has(handleSearch)) {
    fnMap.set(handleSearch, count++);
  }

  console.log("handleSearch function instance:", fnMap.get(handleSearch));

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans text-gray-800">
      <div className="max-w-4xl mx-auto space-y-6">
        <Input
          value={key}
          onChange={handleSearch}
          placeholder="Search..."
          className="w-full sm:max-w-xs bg-white"
        />
      </div>
    </div>
  );
}

export default App;
```

案例二

```tsx
import React, { useCallback, useState } from "react";
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

  const handleCallback = useCallback(() => {
    console.log("Callback executed");
  }, []);

  return (
    <div className="p-4">
      <Input
        value={key}
        onChange={(e) => setKey(e.target.value)}
        placeholder="Enter user key"
        className="mb-4"
      />
      <UserCard user={user} callback={handleCallback} />
    </div>
  );
}

export default App;

interface UserCardProps {
  user: User;
  callback: () => void;
}

const UserCard = React.memo(({ user, callback }: UserCardProps) => {
  console.log("UserCard rendered");

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">{user.name}</h2>
      <p className="text-gray-600 mb-1">Age: {user.age}</p>
      <p className="text-gray-600">Address: {user.addr}</p>
      <Button onClick={callback}>CALLBACK</Button>
    </div>
  );
});
```

### 总结

`useCallback`并不是为了阻止函数的重新创建，而是通过依赖项来决定是否返回新的函数或旧的函数，从而在依赖项不变的情况下确保函数的地址不变。
