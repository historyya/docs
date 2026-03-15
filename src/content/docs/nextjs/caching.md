---
title: Caching
description: Caching
sidebar:
  order: 7
---

## Caching Strategies

| Strategy            | What                                             | Where                                    | Why                                              | How long                                   | How to refresh                       | How to cancel                         |
| ------------------- | ------------------------------------------------ | ---------------------------------------- | ------------------------------------------------ | ------------------------------------------ | ------------------------------------ | ------------------------------------- |
| Request Memoization | memoize identical requests in single render pass | server-side in memory (build & run time) | dedupe requests & avoid props drilling           | short lived                                | not needed                           | auto – only GET requests are memoized |
| Data Cache          | memoize any server-side fetch                    | local/edge/custom storage server-side    | minimize network calls & increase performance    | persistent even across deployments         | time-based or on-demand revalidation | `{ cache: "no-store" }`               |
| Full Route Cache    | memoize static pages (HTML + RSC payload)        | localstorage/custom storage server-side  | serve HTML & RSC fast for FCP & smooth hydration | persistent across user requests & restarts | revalidation or redeploying          | making the page dynamic               |

[Caching in Next.js](https://nextjs.org/docs/app/guides/caching)

## 未启用缓存组件下禁用缓存

### 方案一

```tsx
// app/page.tsx
export default async function Page() {
  // 默认情况下，fetch请求不会被缓存，使用next.revalidate来设置缓存时间，默认为秒
  const data = await fetch("https://...", { next: { revalidate: 3600 } });
}
```

### 方案二

```tsx
// app/page.tsx
// 动态更新
export const dynamic = "force-dynamic";

export default async function Page() {
  const data = await fetch("https://...");
}
```

### 方案三

```tsx
// app/page.tsx
export default async function Page() {
  const data = await fetch("https://...", { cache: "no-store" });
}
```

### 方案四

```tsx
// app/page.tsx
import { connection } from "next/server";

export default async function Page() {
  await connection();
  const data = await fetch("https://...");
}
```

## 启用缓存组件

启用缓存组件之后，所有组件默认为**动态内容**。
