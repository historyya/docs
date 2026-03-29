---
title: 路由
description: 路由
sidebar:
  order: 3
---

## 布局路由

1. 访问 `/index` 显示 BasicLayout 布局。

```tsx
// src/layouts/index.tsx
import { Layout } from "antd";
import { Sidebar } from "@/layouts/Sidebar";
import { Content } from "@/layouts/Content";
import { HeaderBar } from "@/layouts/HeaderBar";

export function BasicLayout() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout.Sider>
        <Sidebar />
      </Layout.Sider>
      <Layout>
        <Layout.Header>
          <HeaderBar />
        </Layout.Header>
        <Layout.Content>
          <Content />
        </Layout.Content>
      </Layout>
    </Layout>
  );
}
```

```tsx
// src/layouts/Sidebar/index.tsx
import { Menu } from "antd";
import { useNavigate } from "react-router";
import { AppstoreOutlined } from "@ant-design/icons";

export function Sidebar() {
  const navigate = useNavigate(); // 编程式导航

  const menuItems = [
    { key: "/home", label: "Home", icon: <AppstoreOutlined /> },
    { key: "/about", label: "About", icon: <AppstoreOutlined /> },
  ];

  const handleClick = (info: { key: string }) => {
    navigate(info.key);
  };

  return (
    <Menu onClick={handleClick} style={{ height: "100vh" }} items={menuItems} />
  );
}
```

```tsx
// src/layouts/HeaderBar/index.tsx
import { Breadcrumb } from "antd";

export function HeaderBar() {
  return (
    <Breadcrumb
      items={[
        {
          title: "Home",
        },
        {
          title: "App",
        },
      ]}
    />
  );
}
```

```tsx
// src/layouts/Content/index.tsx
import { Outlet } from "react-router";

export function Content() {
  return <div>Content</div>;
}
```

```ts
// src/router/index.ts
import { BasicLayout } from "@/layouts";
import { createBrowserRouter } from "react-router";

const router = createBrowserRouter([
  {
    path: "/index",
    Component: BasicLayout,
  },
]);

export default router;
```

## 嵌套路由

1. 嵌套路由就是父路由中嵌套子路由 `children` ，子路由可以继承夫路由的布局。
2. 父路由的 `path` 是 `index` 开始，访问子路由需要添加父路由的 `path` ，比如 `/index/home` 。
3. 子路由不需要添加 `/` 。
4. 子路由默认是不显示的，需要父路由通过 `Outlet` 组件来显示子路由的容器。

```tsx
// src/layouts/Content/index.tsx
import { Outlet } from "react-router";

export function Content() {
  // 添加子路由的容器
  return <Outlet />;
}
```

```ts
// src/router/index.ts
import { BasicLayout } from "@/layouts";
import About from "@/pages/About";
import Home from "@/pages/Home";
import { createBrowserRouter } from "react-router";

const router = createBrowserRouter([
  {
    // path: "/index",  // 布局路由可以省略path
    Component: BasicLayout,
    children: [
      {
        index: true, // 索引路由，作为父路由的默认子路由
        // path: "home",
        Component: Home,
      },
      {
        path: "about",
        Component: About,
      },
    ],
  },
]);

export default router;
```

## 前缀路由

1. 访问 `/project` 显示 Home 组件。

```ts
// src/router/index.ts
import About from "@/pages/About";
import Home from "@/pages/Home";
import { createBrowserRouter } from "react-router";

const router = createBrowserRouter([
  {
    path: "/project",
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "about",
        Component: About,
      },
    ],
  },
]);

export default router;
```

## 动态路由

1. 动态路由通过 `:params` 来定义动态段，访问 `http://127.0.0.1:5173/post/1`

```ts
import { BasicLayout } from "@/layouts";
import Home from "@/pages/Home";
import PostDetail from "@/pages/PostDetail";
import { createBrowserRouter } from "react-router";

const router = createBrowserRouter([
  {
    path: "/",
    Component: BasicLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "post/:id",
        Component: PostDetail,
      },
    ],
  },
]);

export default router;
```

```tsx
import { useParams } from "react-router";

export default function PostDetail() {
  // 在组件中获取动态参数
  const params = useParams();

  return <div>PostDetail: {params.id}</div>;
}
```

## 路由懒加载

```ts
// src/router/index.ts
import { BasicLayout } from "@/layouts";
import Home from "@/pages/Home";
import { createBrowserRouter } from "react-router";

const router = createBrowserRouter([
  {
    path: "/",
    Component: BasicLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "about",
        lazy: async () => {
          const Component = await import("@/pages/About");
          return {
            Component: Component.default,
          };
        },
      },
    ],
  },
]);

export default router;
```

### 体验优化

例如 `About` 是一个懒加载的组件，在切换到 `about` 路由时，展示的还是上一个路由组件，直到懒加载的组件加载完成才会展示新的组件，这样用户体验不好。优化如下：

```tsx
// src/layouts/Content/index.tsx
import { Spin } from "antd";
import { Outlet, useNavigation } from "react-router";

export function Content() {
  // 获取当前路由的导航状态
  const navigation = useNavigation();
  console.log(navigation.state);
  const isLoading = navigation.state === "loading";

  return <div>{isLoading ? <Spin size="large" /> : <Outlet />}</div>;
}
```

### 性能优化

1. 使用懒加载的路由在打包时，会分包，减少主包的体积大小。
