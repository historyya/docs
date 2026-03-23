---
title: Installation
description: Installation
sidebar:
  order: 1
---

## 数据模式

### 安装

```bash
npm i react-router
```

### 配置路由

```ts
// src/router/index.ts
import About from "@/pages/About";
import Home from "@/pages/Home";
import { createBrowserRouter } from "react-router";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/about",
    Component: About,
  },
]);

export default router;
```

### 初始化

```tsx
// src/App.tsx
import { RouterProvider } from "react-router";
import router from "./router";

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
```
