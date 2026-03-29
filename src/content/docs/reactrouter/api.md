---
title: API
description: API
sidebar:
  order: 10
---

## Link

1. `Link` 组件用于导航到其他页面的组件，它会被渲染成一个特殊的 `a` 标签，区别在于它不会刷新页面，而是通过 `router` 管理路由。

### 使用

```tsx
import { Link } from "react-router";

export default function App() {
  return <Link to="/about">About</Link>;
}
```

### 参数

- `to` : 要导航到的路径。

```tsx
<Link to="/about">About</Link>
```

- `replace` : 是否替换当前路径。如果为 true ，则导航不会在浏览器历史记录中创建新的条目，而是替换当前条目。

```tsx
<Link replace to="/about">
  About
</Link>
```

- `state` : 传递参数到目标页面。

```tsx
<Link state={{ from: "home" }} to="/about">
  About
</Link>
```

- `relative` : 相对于当前路径的导航方式。默认是绝对路径，要使用相对路径，可以设置为 `path` 。

```tsx
// 默认绝对路径
<Link relative="route" to="/about">About</Link>

// 使用相对路径
<Link relative="path" to="../about">About</Link>

// 例如当前路由是/index/home，那么使用绝对路径导航到/about，会变成/about
<Link to="/about">About</Link>

// 可以使用相对路径导航到/index/about
<Link relative="path" to="../about">About</Link>
```

- `toreloadDocument` : 是否重新加载页面。

```tsx
<Link reloadDocument to="/about">
  About
</Link>
```

- `preventScrollReset` : 是否阻止滚动位置重置。

```tsx
<Link preventScrollReset to="/about">
  About
</Link>
```

- `viewTransition` : 是否启用视图过渡，自动增加页面跳转的动画效果。

```tsx
<Link viewTransition to="/about">
  About
</Link>
```

> 注意：viewTransition 存在浏览器兼容性问题。

## NavLink

1. `NavLink` 组件可以实现路由的激活状态。

### 使用

```tsx
import { NavLink } from "react-router";

export default function App() {
  return <NavLink to="/about">About</NavLink>;
}
```

### 区别于 Link

1. NavLink 在 Link 上进行增强。
2. NavLink 会经过以下三个状态的转换。
   - `active` : 激活状态 (当前路由和 to 属性匹配)
   - `pending` : 等待状态 (loader 有数据需要加载)
   - `transitioning` : 过渡状态 (通过 viewTransition 属性触发)

:::note
注意：pending 适用于数据模式和框架模式。声明式路由下不可用
:::

#### active 自动激活

NavLink 会根据当前路由和 to 属性进行匹配，为其自动添加`active`类名。

手动为类名添加CSS样式：

```css
a.active {
  color: red;
}

a.pending {
  animate: pulse 1s infinite;
}

a.transitioning {
  /* css transition is running */
}
```

也可以通过style属性来设置样式：

```tsx
<NavLink
  viewTransition
  style={({ isActive, isPending, isTransitioning }) => {
    return {
      marginRight: "10px",
      color: isActive ? "red" : "blue",
      backgroundColor: isPending ? "yellow" : "transparent",
    };
  }}
  to="/about"
>
  About
</NavLink>
```

## redirect

1. `redirect` 组件用于重定向。
2. 通常用于`loader`中，当`loader`返回`redirect`时，会自动重定向到目标路径。

### 使用

权限验证。如果这个路由需要登录后才能访问，如果未登录则重定向到登录页。

```ts
// src/router/index.ts
import Home from "@/pages/Home";
import { createBrowserRouter, redirect } from "react-router";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
    loader: async ({ request }) => {
      const isLogin = await checkLogin();
      if (!isLogin) return redirect("/login");
      return;
    },
  },
]);

export default router;
```
