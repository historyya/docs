---
title: useDeferredValue
description: useDeferredValue
sidebar:
  order: 6
---

:::tip
`useDeferredValue`用于延迟某些状态的更新，直到主渲染任务完成。这对于高频更新的内容（输入框、滚动等）非常有用，可以让UI更加流畅，避免由于频繁更新导致的性能问题。
:::

## 用法

```tsx
import { useDeferredValue, useState } from "react";
import { Input } from "@/components/ui/input";
import mockjs from "mockjs";

interface Item {
  id: number;
  name: number;
  address: string;
}

function App() {
  const [value, setValue] = useState("");
  const [data] = useState<Item[]>(() => {
    return mockjs.mock({
      "list|10000": [
        {
          "id|+1": 1,
          name: "@natural",
          address: "@county(true)",
        },
      ],
    }).list;
  });

  // 参数
  // 1. value：需要被延迟更新的值
  // 返回值
  // 1. deferredValue：延迟更新后的值。在初始渲染期间，两个值相同
  const deferredQuery = useDeferredValue(value);

  // 检查是否为延时状态
  const isStale = deferredQuery !== value;

  const findItem = data.filter((item) => {
    console.log("value: ", value);
    console.log("deferredQuery: ", deferredQuery);

    return item.name.toString().includes(deferredQuery);
  });

  return (
    <div>
      <Input value={value} onChange={(e) => setValue(e.target.value)} />
      <ul style={{ opacity: isStale ? 0.5 : 1, transition: "opacity 0.3s" }}>
        {findItem.map((item) => (
          <li key={item.id}>
            {item.name} - {item.address}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
```

## useTransition 和 useDeferredValue 的区别

`useTransition`和`useDeferredValue`都涉及延迟更新，但它们关注的重点和用途略有不同：

- `useTransition` 关注**状态的过渡**。它允许开发者控制某个更新的延迟更新，还提供了过度标识，让开发者能够添加过度反馈。
- `useDeferredValue`关注**某个值**的延迟更新。它允许把特定状态的更新标记为低优先级。
