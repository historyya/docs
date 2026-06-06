---
title: Suspense
description: Suspense
sidebar:
  order: 53
---

Suspense是一种异步渲染机制，可以在组件加载或数据获取过程中，先展示一个占位符，从而实现更自然流畅的用户界面优化体验。

## 用法

### 异步组件加载

```tsx
// src/components/profile.tsx
function Profile() {
  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Profile Page</h1>
      <p>This is the profile page content.</p>
    </div>
  );
}

export default Profile;
```

```tsx
import { lazy, Suspense } from "react";

const ProfileComponent = lazy(() => import("./components/profile"));

function App() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <ProfileComponent />
      </Suspense>
    </>
  );
}

export default App;
```

### 异步数据加载

```tsx
// src/components/profile.tsx
import { use } from "react";

const getData = async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/users/1");
  const data = await res.json();
  return data;
};

const userPromise = getData();

function Profile() {
  // use()用于获取Promise的结果，类似于await，但只能在组件中使用
  const user = use(userPromise);
  console.log(user);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Profile Page</h1>
      <p>user id: {user.id}</p>
      <p>user name: {user.name}</p>
    </div>
  );
}

export default Profile;
```

```tsx
import { lazy, Suspense } from "react";

const ProfileComponent = lazy(() => import("./components/profile"));

function App() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <ProfileComponent />
      </Suspense>
    </>
  );
}

export default App;
```

### 应用场景

- 异步组件加载：通过代码分包实现组件的按需加载，有效减少首屏加载时的资源体积，提升应用性能
- 异步数据加载：在数据请求过程中展示优雅的过渡状态，为用户提供更流畅的交互体验
- 异步图片资源加载：智能管理图片资源的加载状态，在图片完成加载前展示占位内容，确保页面的布局稳定，提升用户体验
