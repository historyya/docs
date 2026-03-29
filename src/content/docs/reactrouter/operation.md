---
title: 路由操作
description: 路由操作
sidebar:
  order: 5
---

## Data Loading

1. 只有 `GET` 请求才会触发 `loader` ，所以适合用来获取数据。
2. 之前是先 `渲染组件 -> 请求数据 -> 渲染视图` ，使用 `loader` 后先 `请求数据 -> 获取数据 -> 渲染组件` 。
3. 可以使用`useNavigation`优化用户体验。

```ts
// src/router/index.ts
import Home from "@/pages/Home";
import { createBrowserRouter } from "react-router";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
    loader: async () => {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts",
      );
      const data = await response.json();
      return { data };
    },
  },
]);

export default router;
```

```tsx
// src/pages/Home/index.tsx
import { useLoaderData } from "react-router";

export default function Home() {
  const { data } = useLoaderData();
  console.log(data);

  return (
    <div>
      <h1>Home</h1>
    </div>
  );
}
```

## Actions

1. 只有 `POST 、 PUT 、 DELETE 等` 请求才会触发 `action` ，所以一般用于表单提交、删除、修改等操作。

```ts
// src/router/index.ts
import Home from "@/pages/Home";
import { createBrowserRouter } from "react-router";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
    action: async ({ request }) => {
      const formData = await request.formData();

      const title = formData.get("title");
      const body = formData.get("body");

      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            body,
          }),
        },
      );
      return response.json();
    },
  },
]);

export default router;
```

```tsx
// src/pages/Home/index.tsx
import { Button, Card, Form, Input } from "antd";
import { useEffect } from "react";
import { useActionData, useNavigation, useSubmit } from "react-router";

export default function Home() {
  const submit = useSubmit();
  const navigation = useNavigation();
  const data = useActionData();

  const [form] = Form.useForm();

  const isSubmitting = navigation.state !== "idle";

  useEffect(() => {
    if (data && !data.error) {
      form.resetFields();
    }
  }, [data, form]);

  return (
    <Card>
      <Form
        form={form}
        onFinish={(values) => {
          submit(values, { method: "post" });
        }}
      >
        <Form.Item
          name="title"
          label="标题"
          rules={[{ required: true, message: "请输入标题" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="body"
          label="内容"
          rules={[{ required: true, message: "请输入内容" }]}
        >
          <Input />
        </Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          {isSubmitting ? "提交中..." : "提交"}
        </Button>
      </Form>

      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </Card>
  );
}
```
