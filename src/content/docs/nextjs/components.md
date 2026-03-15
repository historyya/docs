---
title: Components
description: Components
sidebar:
  order: 6
---

## React Server Components

### 优点

- 将组件拆分成客户端组件和服务器组件，可以有效的减少bundle体积，因为服务器组件已经在服务器渲染好了，所以没必要打入bundle中。也就是说服务器组件所依赖的包都不会打进去，大大减少了bundle体积。
- 局部水合，像传统的SSR同构模式，所有的页面都要在客户端进行水合，而RSC将组件拆分出来，只会把客户端组件进行水合，避免了全量水合带来的性能损耗。
- 流式加载，HTML页面本身就支持流式加载，所以服务器组件可以边渲染边返回，提高了FCP(首次内容绘制)性能。

## Server Components

默认情况下，`layouts`and`pages`都是服务端组件。

```tsx
// app/[id]/page.tsx
import LikeButton from "@/app/ui/like-button";
import { getPost } from "@/lib/data";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPost(id);

  return (
    <div>
      <main>
        <h1>{post.title}</h1>
      </main>
    </div>
  );
}
```

## Client Components

```tsx
// app/ui/counter.tsx
"use client";

import { useState } from "react";

console.log("Client Component");

export default function Counter() {
  consolo.log("Counter Component");

  const [count, setCount] = useState(0);
  useEffect(() => {
    console.log(document);
    console.log(window);
  }, []);

  return (
    <div>
      <p>{count} likes</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

## Cache Components

```ts
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  cacheComponents: true,
};

export default nextConfig;
```

```tsx
// app/blog/page.tsx
import { Suspense } from "react";
import { cookies } from "next/headers";
import { cacheLife } from "next/cache";
import Link from "next/link";

export default function BlogPage() {
  return (
    <>
      {/* Static content - prerendered automatically */}
      <header>
        <h1>Our Blog</h1>
        <nav>
          <Link href="/">Home</Link> | <Link href="/about">About</Link>
        </nav>
      </header>

      {/* Cached dynamic content - included in the static shell */}
      <BlogPosts />

      {/* Runtime dynamic content - streams at request time */}
      <Suspense fallback={<p>Loading your preferences...</p>}>
        <UserPreferences />
      </Suspense>
    </>
  );
}

// Everyone sees the same blog posts (revalidated every hour)
async function BlogPosts() {
  "use cache";
  cacheLife("hours");

  const res = await fetch("https://api.vercel.app/blog");
  const posts = await res.json();

  return (
    <section>
      <h2>Latest Posts</h2>
      <ul>
        {posts.slice(0, 5).map((post: any) => (
          <li key={post.id}>
            <h3>{post.title}</h3>
            <p>
              By {post.author} on {post.date}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

// Personalized per user based on their cookie
async function UserPreferences() {
  const theme = (await cookies()).get("theme")?.value || "light";
  const favoriteCategory = (await cookies()).get("category")?.value;

  return (
    <aside>
      <p>Your theme: {theme}</p>
      {favoriteCategory && <p>Favorite category: {favoriteCategory}</p>}
    </aside>
  );
}
```
