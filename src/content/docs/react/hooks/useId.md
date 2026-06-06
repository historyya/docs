---
title: useId
description: useId
sidebar:
  order: 28
---

## 用法

1. 为组件生成唯一ID

```tsx
import { useId } from "react";

function App() {
  const id = useId();

  return (
    <div className="p-4">
      <label htmlFor={id}>Name</label>
      <input id={id} className="border" />
    </div>
  );
}

export default App;
```
