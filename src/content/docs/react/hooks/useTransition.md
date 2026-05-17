---
title: useTransition
description: useTransition
sidebar:
  order: 5
---

:::tip
`useTransition`用于管理UI中的过渡状态。
:::

## 用法

```tsx
import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";

interface Item {
  id: number;
  name: string;
  address: string;
}

function App() {
  const [value, setValue] = useState("");
  const [data, setData] = useState<Item[]>([]);

  // isPending：bool，告诉你是否存在待处理的transition
  // startTransition：function，可以使用此方法将状态更新为transition
  const [isPending, startTransition] = useTransition();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue(value);

    fetch(`/api/users?keyword=${value}`)
      .then((res) => res.json())
      .then((data) => {
        // 将状态更新为transition
        startTransition(() => {
          setData(data.list ?? []);
        });
      });
  };

  return (
    <div>
      <Input value={value} onChange={handleInputChange} />
      {isPending && <div>Loading...</div>}
      <ul>
        {data.map((item) => (
          <li key={item.id}>
            {item.id} - {item.name} - {item.address}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
```

```ts
// vite.config.ts
import { defineConfig, type Plugin } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import url from "node:url";
import mockjs from "mockjs";

// 编写一个vite插件
const viteMockServer = (): Plugin => {
  return {
    name: "vite-mock-server",
    configureServer(server) {
      server.middlewares.use("/api/users", async (req, res) => {
        // /api/users?keyword=zhangsan
        // 返回 {}
        const parsedUrl = url.parse(req.originalUrl!, true);
        const query = parsedUrl.query;
        res.setHeader("Content-Type", "application/json");
        const data = mockjs.mock({
          "list|1000": [
            {
              "id|+1": 1,
              name: query.keyword,
              address: "@county(true)",
            },
          ],
        });
        res.end(JSON.stringify(data));
      });
    },
  };
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({
      presets: [reactCompilerPreset()],
    }),
    tailwindcss(),
    viteMockServer(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

## 原理剖析

`useTransition`的核心原理是将一部分状态更新处理为低优先级任务，这样可以将关键的高优先级任务先执行，而低优先级的过度更新则会稍微延迟处理。

这在渲染大量数据，进行复杂运算或处理长时间任务时特别有效。

react 通过调度机制来管理优先级：

1. 高优先级更新：直接影响用户体验的任务，比如表单输入、按钮点击等。
2. 低优先级更新：相对不影响交互的过渡性任务，比如大量数据渲染、动画等，这些任务可以延迟执行。
