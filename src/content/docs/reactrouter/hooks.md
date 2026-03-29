---
title: Hooks
description: Hooks
sidebar:
  order: 11
---

## useNavigate

1. 用于编程式导航的路由跳转

```tsx
import { useNavigate } from "react-router";

export default function Home() {
  const navigate = useNavigate();

  function handleClick() {
    navigate("/about");
  }

  return (
    <div>
      <button onClick={handleClick}>About</button>
    </div>
  );
}
```

### 参数

- 参数跟`Link`组件的参数类似
- 第一个参数：`to` 跳转的路由

```tsx
import { useNavigate } from "react-router";

export default function Home() {
  const navigate = useNavigate();
  navigate("/about");

  return <div></div>;
}
```

- 第二个参数：`options`配置对象

#### replace

1. 跳转路由时，是否替换当前路由

```tsx
import { useNavigate } from "react-router";

export default function Home() {
  const navigate = useNavigate();
  navigate("/about", {
    replace: true,
  });

  return <div></div>;
}
```

#### state

1. 传递参数到目标页面

```tsx
import { useNavigate } from "react-router";

export default function Home() {
  const navigate = useNavigate();
  navigate("/about", {
    state: {
      page: "home",
    },
  });

  return <div></div>;
}
```

#### relative

1. 跳转方式，默认是绝对路径，要使用相对路径，可以设置为`path`

```tsx
import { useNavigate } from "react-router";

export default function Home() {
  const navigate = useNavigate();
  navigate("/about", {
    relative: "path",
  });

  return <div></div>;
}
```

#### preventScrollReset

1. 跳转路由时，是否阻止滚动位置重置

```tsx
import { useNavigate } from "react-router";

export default function Home() {
  const navigate = useNavigate();
  navigate("/about", {
    preventScrollReset: true,
  });

  return <div></div>;
}
```

#### viewTransition

1. 跳转路由时，是否启用视图过渡，自动增加页面跳转的动画效果

```tsx
import { useNavigate } from "react-router";

export default function Home() {
  const navigate = useNavigate();
  navigate("/about", {
    viewTransition: true,
  });

  return <div></div>;
}
```

## useNavigation

1. 用于获取当前路由的导航状态

```tsx
import { useNavigation } from "react-router";

export default function Home() {
  const navigation = useNavigation();
  console.log(navigation);

  return <div></div>;
}
```

### navigation.state

- `idle` 空闲状态
- `submitting` 提交状态
- `loading` 加载状态

1. 在正常导航情况下会经过以下三个状态的转换：`idle -> loading -> idle`
2. 在使用POST等方式提交表单时会经过以下三个状态的转换：`idle -> submitting -> loading-> idle`

> 如果没有`loader`，则不会经历`loading`状态

```tsx
import { useNavigation } from "react-router";

export default function Home() {
  const navigation = useNavigation();
  const isIdle = navigation.state === "idle";
  const isLoading = navigation.state === "loading";
  const isSubmitting = navigation.state === "submitting";

  return <div></div>;
}
```

### navigation.formData

1. 当使用原生表单`form`提交时，并且是以POST等请求方式，可以获取到表单的数据
2. 如果是GET请求，需要在`navigation.location.search`中获取GET请求的数据

### navigation.json

1. 用于当提交表单时，当表单的`enctype`为`application/json`时获取表单的数据

### navigation.text

1. 用于当提交表单时，当表单的`enctype`为`text/plain`时获取表单的数据

### navigation.location

1. 用于获取当前路由的信息，返回值跟`useLocation`一样

### navigation.formAction

1. 用于获取表单的提交地址，例如`action='/login'`，如果是GET则为空；如果是`/detail/1`则返回`/id`

### navigation.formMethod

1. 用于获取表单的提交方式，例如`method='POST'`

### navigation.formEncType

1. 用于获取表单的提交类型，例如`enctype='multipart/form-data'`

## useParams

1. 用于获取路由参数

```tsx
import { useParams } from "react-router";

export default function Home() {
  const params = useParams();
  // 返回当前URL中匹配的参数
  // 请求/posts/1
  // 返回{ id: '1' }
  console.log(params);

  return <div></div>;
}
```

## useSearchParams

1. 用于获取当前URL的查询参数，也就是`?`后面的参数

```tsx
import { useSearchParams } from "react-router";

// 请求/home?page=1&pageSize=10

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  console.log(searchParams.get("page"));
  console.log(searchParams.get("pageSize"));

  return (
    <div>
      <button
        onClick={() =>
          setSearchParams((prev) => {
            prev.set("page", "2");
            prev.set("pageSize", "20");
            return prev;
          })
        }
      >
        Set Search Params
      </button>
      {/* 修改后URL： /home?page=2&pageSize=20  */}
    </div>
  );
}
```

## useLocation

1. 用于获取当前路由的location对象

```tsx
import { useLocation } from "react-router";

export default function Home() {
  const location = useLocation();
  console.log(location);

  return <div></div>;
}
```

- `hash: string` : URL片段标识符，以#开头
- `key: string` : 获取当前路由的唯一标识符
- `pathname: string` : URL路径名，以/开头
- `search: string` : URL查询字符串，以?开头
- `state: State` : 传递到当前路径的state对象

## useLoaderData

1. 用于获取路由的loader返回的数据
2. useLoaderData不会额外触发fetch，只是读取loader返回的数据

```tsx
import { useLoaderData } from "react-router";

export default function Home() {
  const { data } = useLoaderData();

  return <div></div>;
}
```

## useActionData

1. 用于获取路由的action返回的数据

```tsx
import { useActionData } from "react-router";

export default function Home() {
  const data = useActionData();

  return <div></div>;
}
```

## useRouteError

1. 用于获取路由的错误信息
2. 如果loader或action抛出错误，会调用ErrorBoundary组件，在ErrorBoundary组件，可以获取到错误信息

```tsx
import { useRouteError } from "react-router";

export default function Error() {
  const error = useRouteError();
  return <div>{error.message}</div>;
}
```

## useSubmit

1. 用于提交表单
2. 默认情况下，useSubmit会提交FormData数据，如果需要提交其他数据，需要通过submit的第二个参数传递

- 提交FormData数据

```tsx
import { useSubmit } from "react-router";

export default function Home() {
  const formData = new FormData();
  formData.append("account", "admin");
  formData.append("password", "admin");

  const submit = useSubmit();
  submit(formData);

  return <div></div>;
}
```

- 提交json数据

```tsx
import { useSubmit } from "react-router";

export default function Home() {
  const submit = useSubmit();
  submit(
    JSON.stringify({
      account: "admin",
      password: "123456",
    }),
    {
      method: "POST",
      encType: "application/json",
    },
  );

  return <div></div>;
}
```

- 提交text数据

```tsx
import { useSubmit } from "react-router";

export default function Home() {
  const submit = useSubmit();
  submit("Hello world", {
    method: "POST",
    encType: "text/plain",
  });

  return <div></div>;
}
```

- 提交urlencoded数据

```tsx
import { useSubmit } from "react-router";

export default function Home() {
  const submit = useSubmit();
  submit(
    { account: "admin", password: "123456" },
    {
      method: "POST",
      encType: "application/x-www-form-urlencoded",
    },
  );

  return <div></div>;
}
```

- 提交queryString数据

```tsx
import { useSubmit } from "react-router";

export default function Home() {
  const submit = useSubmit();
  submit(
    [
      ["account", "admin"],
      ["password", "admin"],
    ],
    { method: "post" },
  );

  return <div></div>;
}
```
