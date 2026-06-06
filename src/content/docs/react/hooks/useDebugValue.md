---
title: useDebugValue
description: useDebugValue
sidebar:
  order: 27
---

:::tip
`useDebugValue`用于开发者调试。它允许开发者在react开发者工具中为自定义hook添加自定义的调试值。
:::

## 用法

```ts
// src/hooks/useCookie.ts
import { useDebugValue, useState } from "react";

export const useCookie = (name: string, initialValue: string = "") => {
  // 1. 获取cookie值
  const getCookie = () => {
    const match = document.cookie.match(
      new RegExp(`(^| )${name}=([^;]*)(;|$)`),
    );
    return match ? match[2] : initialValue;
  };
  const [cookie, setCookie] = useState(getCookie());

  // 2. 更新cookie值
  const updateCookie = (value: string, options?: unknown) => {
    document.cookie = `${name}=${value};${options}`;
    setCookie(value);
  };

  // 3. 删除cookie值
  const deleteCookie = () => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    setCookie(initialValue);
  };

  useDebugValue(cookie, (value) => {
    return `cookie: ${value}`;
  });

  return [cookie, updateCookie, deleteCookie] as const;
};
```

```tsx
import { useCookie } from "./hooks/useCookie";

function App() {
  const [cookie, updateCookie, deleteCookie] = useCookie("user", "Doe");

  return (
    <div className="p-4">
      <p className="mb-4">Current Cookie Value: {cookie}</p>
      <button onClick={() => updateCookie("Jane Doe")}>Update Cookie</button>
      <button onClick={deleteCookie}>Delete Cookie</button>
    </div>
  );
}

export default App;
```
