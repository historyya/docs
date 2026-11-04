---
title: 创建组件
description: 创建组件
sidebar:
  order: 50
---

## 案例

实现一个message组件

```tsx
// src/components/message.tsx
import clsx from "clsx";
import { createRoot, type Root } from "react-dom/client";
import { CheckCircle, CircleAlert, CircleX, Info } from "lucide-react";

type MessageType = "success" | "error" | "warning" | "info";

interface MessageOptions {
  content: string;
  type?: MessageType;
  duration?: number;
}

interface MessageItem {
  id: number;
  container: HTMLDivElement;
  root: Root;
}

const START_TOP = 24;

const queue: MessageItem[] = [];

const icons = {
  success: <CheckCircle size={18} />,
  error: <CircleX size={18} />,
  warning: <CircleAlert size={18} />,
  info: <Info size={18} />,
};

const styles = {
  success: "bg-emerald-50 text-emerald-600 border-emerald-200",
  error: "bg-red-50 text-red-600 border-red-200",
  warning: "bg-amber-50 text-amber-600 border-amber-200",
  info: "bg-white text-zinc-700 border-zinc-200",
};

function Message({
  content,
  type = "info",
}: Required<Pick<MessageOptions, "content" | "type">>) {
  return (
    <div
      className={clsx(
        "pointer-events-auto flex items-center gap-2",
        "min-w-55 max-w-105",
        "rounded-xl border px-4 py-3",
        "shadow-lg backdrop-blur-sm",
        "transition-all duration-300",
        "animate-in slide-in-from-top-5 fade-in",
        styles[type],
      )}
    >
      <span>{icons[type]}</span>

      <span className="text-sm font-medium">{content}</span>
    </div>
  );
}

function updatePositions() {
  queue.forEach((item, index) => {
    item.container.style.top = `${START_TOP + index * 56}px`;
  });
}

function createMessage(options: MessageOptions) {
  const { content, type = "info", duration = 2000 } = options;

  // 创建容器
  const container = document.createElement("div");

  // 设置样式
  container.className =
    "fixed left-1/2 z-[9999] -translate-x-1/2 transition-all duration-300";

  // 将容器添加到页面
  document.body.appendChild(container);

  // 创建 React 根节点
  const root = createRoot(container);

  const id = Date.now() + Math.random();

  // 将消息添加到队列中
  queue.push({
    id,
    container,
    root,
  });

  updatePositions();

  // 渲染消息组件
  root.render(<Message content={content} type={type} />);

  const close = () => {
    const index = queue.findIndex((item) => item.id === id);

    if (index === -1) return;

    queue[index].root.unmount();

    document.body.removeChild(queue[index].container);

    queue.splice(index, 1);

    updatePositions();
  };

  setTimeout(close, duration);

  return close;
}

const message = {
  info(content: string, duration?: number) {
    return createMessage({
      content,
      type: "info",
      duration,
    });
  },

  success(content: string, duration?: number) {
    return createMessage({
      content,
      type: "success",
      duration,
    });
  },

  warning(content: string, duration?: number) {
    return createMessage({
      content,
      type: "warning",
      duration,
    });
  },

  error(content: string, duration?: number) {
    return createMessage({
      content,
      type: "error",
      duration,
    });
  },
};

export default message;
```

```tsx
import message from "./components/message";

function App() {
  return (
    <div className="p-10 flex gap-4">
      <button
        className="rounded bg-black px-4 py-2 text-white"
        onClick={() => message.success("保存成功")}
      >
        success
      </button>

      <button
        className="rounded bg-red-500 px-4 py-2 text-white"
        onClick={() => message.error("删除失败")}
      >
        error
      </button>

      <button
        className="rounded bg-orange-500 px-4 py-2 text-white"
        onClick={() => message.warning("请注意操作")}
      >
        warning
      </button>
    </div>
  );
}

export default App;
```
