---
title: 受控组件
description: 受控组件
sidebar:
  order: 52
---

## 受控组件

受控组件一般是指表单元素，表单的数据由`state`管理，更新数据时，需要手动调用`setState()`方法更新数据。

```tsx
import { useState } from "react";

function App() {
  const [account, setAccount] = useState("");

  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccount(e.target.value);
  };

  return (
    <div className="p-10 flex gap-4">
      <form>
        <input value={account} type="text" onChange={handleAccountChange} />
      </form>

      <div>
        <p>Account: {account}</p>
      </div>
    </div>
  );
}

export default App;
```

## 非受控组件

非受控组件指的是该表单数据由DOM管理，通过`useRef()`来获取表单元素的值。

```tsx
import { useRef } from "react";

function App() {
  // 设置表单的默认值
  const defaultAccount = "user1";

  // 获取表单元素的值
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = () => {
    if (inputRef.current) {
      console.log(inputRef.current.value);
    }
  };

  return (
    <div className="p-10 flex gap-4">
      <form>
        <input
          defaultValue={defaultAccount}
          type="text"
          ref={inputRef}
          onChange={handleChange}
        />
      </form>
    </div>
  );
}

export default App;
```

### 特殊的表单File

```tsx
import { useRef } from "react";

function App() {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = () => {
    if (inputRef.current) {
      console.log(inputRef.current.files);
    }
  };

  return (
    <div className="p-10 flex gap-4">
      <form>
        <input type="file" ref={inputRef} onChange={handleChange} />
      </form>
    </div>
  );
}

export default App;
```
