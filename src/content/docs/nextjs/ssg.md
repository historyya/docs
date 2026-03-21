---
title: SSG
description: SSG
sidebar:
  order: 9
---

## 静态导出

### 配置

```ts
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // ssg导出
  distDir: "dist", // 输出目录
  images: {
    // 静态导出时，Image组件无法图片优化，需要自定义loader，并且图片需要放到S3上
    loader: "custom",
    loaderFile: "./src/lib/imageLoader.ts",
  },
  trailingSlash: true, // 生成静态文件时，路径末尾添加斜杠 /about/index.html
};

export default nextConfig;
```

```ts
// src/lib/imageLoader.ts
export default function imageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality: number;
}) {
  return `https://s3.amazonaws.com${src}`;
}
```

```tsx
// src/app/blog/[id]/page.tsx
// 生成静态参数
export async function generateStaticParams() {
  const posts = await fetch("https://.../posts").then((res) => res.json());

  return posts.map((post) => ({
    id: post.id,
  }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;

  return (
    <div>
      <p>Page with ID: {id}</p>
    </div>
  );
}
```
