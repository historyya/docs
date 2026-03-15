---
title: Proxy
description: Proxy
sidebar:
  order: 4
---

## 基本使用

### 应用场景

- 处理跨域请求
- 接口限流
- 接口鉴权

```ts
// src/proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest, ProxyConfig } from "next/server";

export function proxy(request: NextRequest) {
  console.log(request.url);

  // 处理跨域：只要是/api下面的接口都可以被任意访问
  // const response = NextResponse.next();
  // Object.entries(corsHeaders).forEach(([key, value]) => {
  //   response.headers.set(key, value);
  // })
  // return response;

  const cookie = request.cookies.get("token");
  if (request.nextUrl.pathname.startsWith("/dashboard") && !cookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (cookie && cookie.value) {
    return NextResponse.next();
  }
  return NextResponse.redirect(new URL("/", request.url));
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const config: ProxyConfig = {
  // 匹配路径
  matcher: [
    "/dashboard/:path*",
    "/api/:path*",
    "/((?!api|_next/static|_next/image|.*\\.png$).*)",
    {
      source: "/dashboard/:path*",
      // 匹配路径中必须(包含)Authorization头和userId查询参数
      has: [
        { type: "header", key: "Authorization", value: "Bearer 123456" },
        { type: "query", key: "userId", value: "123" },
      ],
      // 匹配路径中(必须不包含)cookie和userId查询参数
      missing: [
        { type: "cookie", key: "token", value: "123456" },
        { type: "query", key: "userId", value: "456" },
      ],
    },
  ],
};
```
