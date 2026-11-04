---
title: useImperativeHandle
description: useImperativeHandle
sidebar:
  order: 23
---

:::tip
useImperativeHandle用于在子组件内部暴露给父组件属性和方法。

换句话说父组件可以调用子组件的方法，访问子组件的属性。
:::

## 用法

```tsx
import type React from "react";
import { useImperativeHandle, useRef, useState } from "react";
import { Button } from "./components/ui/button";

function App() {
  const counterRef = useRef<CounterProps>(null);

  const showCounterInfo = () => {
    if (counterRef.current) {
      console.log(counterRef.current);
    }
  };

  return (
    <>
      <h1>父组件</h1>
      <Button onClick={showCounterInfo}>获取子组件信息</Button>
      <Button onClick={() => counterRef.current?.increment()}>+</Button>
      <Button onClick={() => counterRef.current?.decrement()}>-</Button>
      <Counter ref={counterRef} />
    </>
  );
}

export default App;

interface CounterProps {
  name: string;
  count: number;
  increment: () => void;
  decrement: () => void;
}

function Counter({ ref }: { ref: React.Ref<CounterProps> }) {
  const [count, setCount] = useState(0);

  // 参数
  // ref：父组件传递的 ref 对象
  // 第二个参数：一个函数，返回一个对象，这个对象包含了我们想要暴露给父组件的属性和方法
  useImperativeHandle(ref, () => ({
    name: "Counter",
    count,
    increment: () => setCount(count + 1),
    decrement: () => setCount(count - 1),
  }));

  return (
    <div className="border p-4">
      <h2>子组件：{count}</h2>
      <Button onClick={() => setCount(count + 1)}>+</Button>
      <Button onClick={() => setCount(count - 1)}>-</Button>
    </div>
  );
}
```

## 执行时机

1. 如果不传入第三个参数，useImperativeHandle会在组件挂载时执行一次，状态更新时都会执行一次。

```tsx
import { useImperativeHandle } from 'react';

function App({ ref }) {
  useImperativeHandle(ref, () => {
    return {
      // ... 你的方法 ...
    };
  });
  // ...
```

2. 如果传入第三个参数，是一个空数组，useImperativeHandle会在组件挂载时执行一次，状态更新时不会执行。

```tsx
import { useImperativeHandle } from 'react';

function App({ ref }) {
  useImperativeHandle(ref, () => {
    return {
      // ... 你的方法 ...
    };
  }, []);
  // ...
```

3. 如果传入第三个参数，并且有值，useImperativeHandle会在组件挂载时执行一次，依赖项中的状态更新时也会执行。

```tsx
import { useImperativeHandle } from 'react';

function App({ ref }) {
  const [count, setCount] = useState(0);

  useImperativeHandle(ref, () => {
    return {
      // ... 你的方法 ...
    };
  }, [count]);
  // ...
```

## 实际案例

1. 封装一个表单组件，提供两个方法：校验和重置：

```tsx
import type React from "react";
import { useImperativeHandle, useRef, useState } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";

function App() {
  const formRef = useRef<FormProps>(null);

  return (
    <>
      <h1>父组件</h1>
      <Form ref={formRef} />
      <Button
        onClick={() => {
          if (formRef.current) {
            const validationResult = formRef.current.validate();
            if (validationResult === true) {
              alert("表单验证通过");
            } else {
              alert(`表单验证失败: ${validationResult}`);
            }
          }
        }}
      >
        验证表单
      </Button>
      <Button
        onClick={() => {
          if (formRef.current) {
            formRef.current.reset();
          }
        }}
      >
        重置表单
      </Button>
    </>
  );
}

export default App;

interface FormProps {
  name: string;
  validate: () => string | true;
  reset: () => void;
}

function Form({ ref }: { ref: React.Ref<FormProps> }) {
  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
  });

  const validate = () => {
    if (!form.username) return "用户名不能为空";
    if (!form.password) return "密码不能为空";
    if (!form.email) return "邮箱不能为空";
    return true;
  };

  const reset = () => {
    setForm({
      username: "",
      password: "",
      email: "",
    });
  };

  useImperativeHandle(ref, () => ({
    name: "form",
    validate,
    reset,
  }));

  return (
    <div className="border p-4">
      <h2>表单组件</h2>
      <form>
        <Input
          type="text"
          placeholder="用户名"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <Input
          type="password"
          placeholder="密码"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <Input
          type="email"
          placeholder="邮箱"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </form>
    </div>
  );
}
```
