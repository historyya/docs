---
title: 传参
description: 传参
sidebar:
  order: 4
---

## Query方式

1. Query 就是使用 `?` 来传递参数，例如 `/users?page=1&limit=10` 。
2. 适用于：传递可选的查询参数。

### 跳转方式

在组件中使用：

#### NavLink

```tsx
<NavLink to="/users?page=1&limit=10">Users</NavLink>
```

#### Link

```tsx
<Link to="/users?page=1&limit=10">Users</Link>
```

#### useNavigate

```tsx
const navigate = useNavigate();
navigate("/users?page=1&limit=10");
```

### 获取参数

#### useSearchParams

```tsx
import { useSearchParams } from "react-router";

export default function Home() {
  // ?page=1&limit=10
  const [searchParams, setSearchParams] = useSearchParams();
  console.log(searchParams.get("page"));
  console.log(searchParams.get("limit"));

  return (
    <div>
      <h1>Home</h1>
      {/* 修改查询参数，修改后URL=/?page=2&limit=20 */}
      <button
        onClick={() =>
          setSearchParams((prev) => {
            prev.set("page", "2");
            prev.set("limit", "20");
            return prev;
          })
        }
      >
        Change
      </button>
    </div>
  );
}
```

#### useLocation

```tsx
import { useLocation } from "react-router";

export default function Home() {
  const { search } = useLocation();
  console.log(search); // ?page=1&limit=10

  return (
    <div>
      <h1>Home</h1>
    </div>
  );
}
```

## Params方式

1. Params 就是使用 `:[id]` 来传递参数，例如 `/users/1` 。
2. 适用于：传递必要的路径参数。

### 跳转方式

```tsx
<NavLink to="/users/1">User 1</NavLink>
```

```tsx
<Link to="/users/1">User 1</Link>
```

```tsx
const navigate = useNavigate();
navigate("/users/1");
```

### 获取参数

#### useParams

```tsx
const { id } = useParams();
console.log(id);
```

## State方式

1. State 在 URL 上不显示，但是可以传递参数，例如 `/users` 。

### 跳转方式

```tsx
<NavLink
  to="/users"
  state={{
    page: 1,
    pageSize: 20,
  }}
>
  Users
</NavLink>
```

```tsx
<Link
  to="/users"
  state={{
    page: 1,
    pageSize: 20,
  }}
>
  Users
</Link>
```

```tsx
const navigate = useNavigate();
navigate("/users", {
  state: {
    page: 1,
    pageSize: 20,
  },
});
```

### 获取参数

```tsx
const { state } = useLocation();
console.log(state);
console.log(state.page);
```
