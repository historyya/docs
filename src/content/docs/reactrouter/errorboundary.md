---
title: 边界处理
description: 边界处理
sidebar:
  order: 6
---

## 404

配置

- 使用`*`作为通配符，当路由匹配不到时，显示NotFound组件

```ts
// src/router/index.ts
import Home from "@/pages/Home";
import { createBrowserRouter } from "react-router";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "*",
    Component: NotFound,
  },
]);

export default router;
```

## ErrorBoundary

1. 用于捕获路由`loader`或`action`的错误，进行处理

```ts
// src/router/index.ts
import { ErrorBoundary } from "@/pages/Error";
import { createBrowserRouter } from "react-router";

const router = createBrowserRouter([
  {
    path: "/abc",
    Component: ABC,
    ErrorBoundary: ErrorBoundary,
  },
  {
    path: "/xyz",
    Component: XYZ,
    loader: async () => {
      // 可以返回Response对象
      // throw new Response('Not Found', { status: 404, statusText: 'Not Found' });

      //也可以返回json等等
      throw {
        message: "Not Found",
        status: 404,
        statusText: "Not Found",
        data: "",
      };
    },
    ErrorBoundary: ErrorBoundary, // 这里指定了这个路由的错误边界组件
  },
]);

export default router;
```

```tsx
// src/pages/Error/index.tsx
import { isRouteErrorResponse, useRouteError } from "react-router";

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
```
