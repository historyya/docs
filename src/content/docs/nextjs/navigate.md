---
title: Navigate
description: 导航
sidebar:
  order: 2
---

## Link Component

```tsx
import Link from "next/link";

export default function Page() {
  return (
    <div>
      <h2 className="text-2xl">路由导航</h2>
      <nav className="mt-4 space-x-3">
        <Link href="/">首页</Link>
        <Link href="/blog">博客</Link>
        <Link href="/about">关于</Link>

        <Link
          href={{
            pathname: "/blog",
            query: { id: "first-post" },
          }}
        >
          跳转并传递参数
        </Link>
        {/* 仅在生产环境下生效 */}
        <Link href="/blog" prefetch={true}>
          预获取博客页面
        </Link>
        {/* 默认开启。true：滚动条显示在顶部，false：滚动条的进度跟上一个页面保持一致 */}
        <Link href="/blog" scroll={true}>
          保持滚动位置
        </Link>
        <Link href="/blog" replace={true}>
          替换当前页面
        </Link>
      </nav>
    </div>
  );
}
```

## useRouter Hook

```tsx
"use client";

import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <div>
      <h2>客户端</h2>
      <div>
        <button onClick={() => router.push("/blog")}>跳转到blog页面</button>
        <button onClick={() => router.push("/blog?id=11")}>
          跳转到blog页面并携带参数
        </button>
        <button onClick={() => router.prefetch("/blog")}>预获取blog页面</button>
        <button onClick={() => router.replace("/blog")}>替换当前页面</button>

        <button onClick={() => router.refresh()}>刷新当前页面</button>
        <button onClick={() => router.back()}>返回上一页</button>
        <button onClick={() => router.forward()}>跳转下一页</button>
      </div>
    </div>
  );
}
```

## redirect函数

Server Component

```tsx
import { redirect } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let token = null;
  if (!token) {
    redirect("/login"); // 状态码：307
  }

  return (
    <section>
      <h2 className="text-2xl">Dashboard Layout</h2>
      {children}
    </section>
  );
}
```

Client Component

```tsx
"use client";

import { redirect, usePathname } from "next/navigation";

export default function Page() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin") && !pathname.includes("/login")) {
    redirect("/admin/login");
  }

  return <div>Login Page</div>;
}
```
