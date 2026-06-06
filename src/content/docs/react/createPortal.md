---
title: createPortal
description: createPortal
sidebar:
  order: 70
---

`createPortal`可以将一个组件渲染到DOM的任意位置。

## 使用

封装一个弹框组件

```tsx
// src/components/modal.tsx
import { createPortal } from "react-dom";

export function Modal() {
  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded">
        <h2 className="text-xl font-bold mb-4">Modal Title</h2>
        <p>This is a modal content.</p>
      </div>
    </div>,
    document.body,
  );
}
```

使用`createPortal`更灵活，可以挂载到任意位置。

### 使用场景

- 弹窗
- 下拉框
- 全局提示
- 全局遮罩
- 全局loading
