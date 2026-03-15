---
title: Router
description: 路由
sidebar:
  order: 1
---

## 布局和页面

```txt
app
└─ blog
   ├─ layout.tsx
   ├─ template.tsx
   └─ page.tsx
```

**特点**

- `layout.tsx` 布局是多个页面共享UI，例如导航栏、侧边栏、底部等
- `template.tsx` 模板是基本功能与布局一样，只是不会保存状态

渲染顺序：当布局跟模板同时存在时，layout -> template -> page

**区别**

- 状态管理：布局会在页面切换时保持状态，而模板会重新渲染

## Dynamic Route

```tsx
// src/app/blog/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";

// URL: /blog/1 /blog/2
export default function Page() {
  const params = useParams<{ id: string }>();
  console.log(params);

  return (
    <div>
      <p>Page with ID: {params.id}</p>
    </div>
  );
}
```

## 路由片段

```tsx
// src/app/blog/[...id]/page.tsx
"use client";

import { useParams } from "next/navigation";

// URL：/blog/123/456
export default function Page() {
  const params = useParams<{ id: string }>();
  console.log(params);

  return (
    <div>
      <p>Page with ID: {params.id}</p>
    </div>
  );
}
```

## 可选路由

```tsx
// src/app/blog/[[...id]]/page.tsx
"use client";

import { useParams } from "next/navigation";

// URL: /blog /blog/12
export default function Page() {
  const params = useParams<{ id: string }>();
  console.log(params);

  return (
    <div>
      <p>Page with ID: {params.id}</p>
    </div>
  );
}
```

## 平行路由

![平行路由](./assets/parallel-routes.avif)

### 目录结构

```txt
├── @team
│   ├── page.tsx
│   ├── user
│   │   └── page.tsx
└── @analytics
│    └── page.tsx
└── layout.tsx
└── page.tsx
```

```tsx
// src/app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
  team,
  analytics,
}: {
  children: React.ReactNode;
  analytics: React.ReactNode;
  team: React.ReactNode;
}) {
  return (
    <section>
      {children}
      {team}
      {analytics}
    </section>
  );
}
```

## 路由组

![路由组](./assets/router-group.avif)

### 使用方法

1. 先将`app`目录下的`layout.tsx`删除
2. 在每个组的目录下创建`layout.tsx`，并定义`html`、`body`标签

