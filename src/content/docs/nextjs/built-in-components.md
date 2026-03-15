---
title: Built-in components
description: 内置组件
sidebar:
  order: 8
---

## Image

### 本地图片引入

```tsx
// app/page.tsx
import Image from "next/image";

export default function Page() {
  return (
    // 引入public目录下的图片
    <Image
      src="/profile.png"
      alt="Picture of the author"
      width={500}
      height={500}
    />
  );
}
```

### import静态引入

```tsx
// app/page.tsx
import Image from "next/image";
import ProfileImage from "./profile.png";

export default function Page() {
  return (
    // 无需填写宽度和高度
    <Image src={ProfileImage} alt="Picture of the author" />
  );
}
```

### 远程图片引入

```tsx
// app/page.tsx
import Image from "next/image";

export default function Page() {
  return (
    <Image
      src="https://s3.amazonaws.com/my-bucket/profile.png"
      alt="Picture of the author"
      width={500}
      height={500}
    />
  );
}
```

```ts
// next.config.ts
import type { NextConfig } from "next";

const config: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3.amazonaws.com",
        port: "",
        pathname: "/my-bucket/**",
        search: "",
      },
    ],
  },
};

export default config;
```

### 注意

`Image`组件默认是懒加载的，如果图片是首屏图片，需要添加`loading="eager"`属性。

- `lazy` : 懒加载，默认值，在图片进入视口后才会加载
- `eager` : 立即加载

### 图片格式优化

```ts
// next.config.js
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 图片格式优化，优先avif，其次webp
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
```

### 设备兼容

```ts
// next.config.js
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 兼容不同设备的图片
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840], // 设备尺寸
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // 图片尺寸
  },
};

export default nextConfig;
```

### Props

#### 尺寸相关

| 属性   | 示例                               | 说明                             |
| ------ | ---------------------------------- | -------------------------------- |
| width  | `width={500}`                      | 图片宽度，静态导入时可选         |
| height | `height={500}`                     | 图片高度，静态导入时可选         |
| fill   | `fill={true}`                      | 填充父容器，替代 width 和 height |
| sizes  | `sizes="(max-width: 768px) 100vw"` | 响应式图片尺寸                   |

#### 优化相关

| 属性        | 示例                   | 说明                    |
| ----------- | ---------------------- | ----------------------- |
| quality     | `quality={80}`         | 图片压缩质量，默认为 75 |
| loader      | `loader={imageLoader}` | 自定义图片加载器函数    |
| unoptimized | `unoptimized={true}`   | 禁用图片优化，使用原图  |

#### 加载相关

| 属性        | 示例                               | 说明                          |
| ----------- | ---------------------------------- | ----------------------------- |
| loading     | `loading="lazy"`                   | 加载策略，“lazy” 或 “eager”   |
| preload     | `preload={true}`                   | 是否预加载，用于 LCP 元素     |
| placeholder | `placeholder="blur"`               | 占位符类型，“blur” 或 “empty” |
| blurDataURL | `blurDataURL="data:image/jpeg..."` | 模糊占位符的 Data URL         |

## Font

### 基本使用

```tsx
// app/layout.tsx
import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={roboto.className}>
      <body>{children}</body>
    </html>
  );
}
```

## Script

### 全局引入

会自动在所有页面中引入，并且只会加载一次。

```tsx
// app/layout.tsx
import Script from "next/script";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://example.com/script.js"
          strategy="beforeInteractive"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

#### 加载策略

- beforeInteractive : 在代码和页面之前加载，会阻塞页面渲染。
- afterInteractive : (默认值) 在页面渲染到客户端之后加载。
- lazyOnload : 在浏览器空闲时稍后加载脚本。

### 局部引入

只会在进入路由页面时加载一次，然后进入缓存。实际上是将Script组件转换成`<script>`标签，然后插入到`<head>`中。

```tsx
// app/page.tsx
import Script from "next/script";

export default function Page() {
  return (
    <>
      <Script src="https://example.com/script.js" />
    </>
  );
}
```

### 内联脚本

#### 写法一

在库加载完成后才执行 lodash 方法

```tsx
// app/layout.tsx
import Script from "next/script";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
      <Script src="https://example.com/script.js" />
      <Script id="show-banner">
        {`document.getElementById('banner').classList.remove('hidden')`}
      </Script>
    </html>
  );
}
```

#### 写法二

```tsx
// app/layout.tsx
import Script from "next/script";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
      <Script src="https://example.com/script.js" />
      <Script
        id="show-banner"
        dangerouslySetInnerHTML={{
          __html: `document.getElementById('banner').classList.remove('hidden')`,
        }}
      />
    </html>
  );
}
```
