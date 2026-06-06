---
title: css-in-js
description: css-in-js
sidebar:
  order: 61
---

## 优点

- 可以让CSS有独立的作用域，阻止CSS泄露到组件外部，防止冲突
- 可以动态生成CSS样式，根据组件的状态来动态生成CSS样式
- 只需更改主题变量就可以实现主题切换功能

### 缺点

- 基于运行时，会损耗一些电脑性能
- 调试困难，基于动态生成

## 使用styled-components

1. 安装

```bash
npm install styled-components
```

2. 封装组件

```tsx
import styled from "styled-components";

const Button = styled.button<{ primary?: boolean }>`
  ${(props) =>
    props.primary ? "background: #6160F2;" : "background: #bf4f74;"}
  border-radius: 3px;
  border: 2px solid #bf4f74;
  color: white;
  margin: 0 1em;
  padding: 0.25em 1em;
`;
```

### 更多用法

#### 继承

```tsx
import styled from "styled-components";

const ButtonBase = styled.button`
  padding: 10px 20px;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  margin: 10px;
  &:hover {
    color: red;
  }
`;

// 圆角蓝色按钮
const BlueButton = styled(ButtonBase)`
  background-color: blue;
  border-radius: 20px;
`;

// 失败按钮
const FailButton = styled(ButtonBase)`
  background-color: red;
`;

// 文字按钮
const TextButton = styled(ButtonBase)`
  background-color: transparent;
  color: blue;
`;
```

#### 属性

```tsx
import styled from "styled-components";

interface DivComponentProps {
  defaultValue: string;
}

const InputComponent = styled.input.attrs<DivComponentProps>((props) => ({
  type: "text",
  defaultValue: props.defaultValue,
}))`
  border: 1px solid blue;
  margin: 20px;
`;
```

#### 全局样式

```tsx
import styled, { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    background-color: #f0f0f0;
  },
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  ul,ol{
      list-style: none;
  }
`;

const App: React.FC = () => {
  return (
    <>
      <GlobalStyle />
    </>
  );
};

export default App;
```

#### 动画

```tsx
import styled, { createGlobalStyle, keyframes } from "styled-components";

const move = keyframes`
  0%{
    transform: translateX(0);
  }
  100%{
    transform: translateX(100px);
  }
`;

const Box = styled.div`
  width: 100px;
  height: 100px;
  background-color: red;
  animation: ${move} 1s linear infinite;
`;

const App: React.FC = () => {
  return (
    <>
      <Box></Box>
    </>
  );
};

export default App;
```

## 原理剖析

```tsx
// 第一个参数：模板字符串的静态字符串
// 第二个参数：模板字符串中变量值
const div = function (strArr: TemplateStringsArray, ...args: any[]) {
  return strArr.reduce((result, str, i) => {
    return result + str + (args[i] || "");
  }, "");
};

const a = div`
  color:red;
  width:${30}px;
  height:${50}px;
`;
```
