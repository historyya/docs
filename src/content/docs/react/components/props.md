---
title: 组件通信
description: 组件通信
sidebar:
  order: 51
---

## 父子组件通信

- 父组件向子组件通过`props`通信
- 子组件通过回调父组件传递的函数进行通信

父组件

```tsx
import { Card } from "./components/card";

function App() {
  // 父组件传递函数给子组件
  const fn = (params: string) => {
    console.log(`Received from child: ${params}`);
  };

  return (
    <div className="p-10 flex gap-4">
      <Card
        title="Card Title"
        description="This is a card description."
        callback={fn}
      ></Card>
      <Card
        title="Another Card"
        description="This is another card description."
        callback={fn}
      >
        <p>This is some child content.</p>
      </Card>
    </div>
  );
}

export default App;
```

子组件

```tsx
interface Props {
  title: string;
  description: string;
  children?: React.ReactNode;
  callback: (params: string) => void;
}

// 定义默认props值
const defaultProps: Partial<Props> = {
  title: "Default Title",
  description: "Default Description",
};

// 父组件向子组件传递props，子组件接收props并渲染内容
// props是一个对象，会作为函数的第一个参数接收传过来的props值
export function Card(props: Props) {
  console.log(props);
  //   const { title, description } = props;
  const { title, description } = { ...defaultProps, ...props };

  return (
    <div>
      <h1>{title}</h1>
      <p>{description}</p>
      {/* 自定义插槽 */}
      <div>{props.children}</div>
      {/* 子组件接收函数，调用将参数回传给父组件 */}
      <button onClick={() => props.callback("child")}>Click</button>
    </div>
  );
}
```

## 兄弟组件通信

- 通过`发布订阅`设计模式

```tsx
// A组件
export function A() {
  // 1. 创建自定义事件，添加到事件中心
  const e = new Event("on-custom-event");

  const handleClick = () => {
    // 添加属性
    e.data = {
      name: "admin",
      age: 18,
    };
    // 2. 派发事件
    window.dispatchEvent(e);
  };
  return (
    <div>
      <h1 onClick={handleClick}>This is component A</h1>
    </div>
  );
}

// 声明全局事件接口，添加自定义属性
declare global {
  interface Event {
    data?: any;
  }
}
```

```tsx
// B组件
export function B() {
  // 1. 接收事件
  window.addEventListener("on-custom-event", (e: Event) => {
    console.log("Received custom event in component B", (e as any).data);
  });

  return (
    <div>
      <h1>This is component B</h1>
    </div>
  );
}
```
