---
title: useState
description: useState
sidebar:
  order: 1
---

useState 允许向组件添加一个`状态变量`。

## 用法

### 基本数据类型

```tsx
import { useState } from "react";

function App() {
  // useState() 接收一个初始值，返回一个数组
  // count: 当前的状态值
  // setCount: 更新该状态的函数
  const [count, setCount] = useState(10);

  return (
    <>
      <h2>count: {count}</h2>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(count - 1)}>-1</button>
    </>
  );
}
```

### 复杂数据类型

#### 数组

```tsx
import { useState } from "react";

function App() {
  // 只读数组，不可修改原数组
  const [arr, setArr] = useState([1, 2, 3, 4, 5]);

  const add = () => {
    // 创建一个新数组，包含原始数组的所有元素，然后在末尾添加新元素
    setArr([...arr, 6]);
  };

  const remove = () => {
    setArr(arr.filter((item) => item !== 1));
  };

  const replace = () => {
    setArr(
      arr.map((item) => {
        return item == 2 ? 8 : item;
      }),
    );
  };

  const insert = () => {
    const startIndex = 0;
    const endIndex = 2;

    // slice会返回一个新的数组
    setArr([...arr.slice(startIndex, endIndex), 2.5, ...arr.slice(endIndex)]);
  };

  const sort = () => {
    // 创建一个新数组
    const newList = [...arr].map((v) => v + 1);
    newList.sort((a, b) => b - a);
    setArr(newList);
  };

  return (
    <>
      <h2>数组: {arr.join(", ")}</h2>
      <button onClick={add}>新增</button>
      <button onClick={remove}>删除</button>
      <button onClick={replace}>替换</button>
      <button onClick={insert}>插入</button>
      <button onClick={sort}>排序</button>
    </>
  );
}
```

#### 对象

```tsx
import { useState } from "react";

function App() {
  // useState可以接受一个函数，在函数中编写逻辑，返回初始值
  // 注意这个函数只会执行一次
  const [obj, setObj] = useState(() => {
    const date =
      new Date().getFullYear() +
      "-" +
      (new Date().getMonth() + 1) +
      "-" +
      new Date().getDate();

    return {
      name: "admin",
      age: 18,
      date,
    };
  });

  const handleChangeName = () => {
    // 在使用setObj()时，不能单独赋值，不然会覆盖原始对象
    setObj({
      ...obj,
      name: "user",
    });
    // setObj(Object.assign({}, obj, { name: "user" }));
  };

  return (
    <>
      <h2>{JSON.stringify(obj)}</h2>
      <button onClick={handleChangeName}>Change Name</button>
    </>
  );
}
```

## useState 更新机制

useState 中 set 函数是异步更新的：

```tsx
import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
    console.log(count); // 函数调用时，count显示的是1，但是日志打印的是0
    // 原因：代码是同步的，会先执行，set函数是异步的，后执行，这样做是为了性能优化。
  };

  return (
    <>
      <h2>Count: {count}</h2>
      <button onClick={increment}>+</button>
    </>
  );
}
```

内部机制：

当多次以相同的操作更新状态时，react会进行比较，如果值相同，会屏蔽后续的更新行为。避免频繁更新

```tsx
import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  const increment = () => {
    // 可以向setCount()传递一个更新函数
    setCount((prevCount) => prevCount + 1); // 接收0，返回1
    setCount((prevCount) => prevCount + 1); // 接收1，返回2
    setCount((prevCount) => prevCount + 1); // 接收2，返回3
    console.log(count);
  };

  return (
    <>
      <h2>Count: {count}</h2>
      <button onClick={increment}>+</button>
    </>
  );
}
```
