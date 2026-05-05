---
title: 工具
description: 工具
sidebar:
  order: 10
---

## Babel

Babel 是一个 JavaScript 编译器，提供了 JavaScript 的编译过程，能够将源代码转换为目标代码。

打包功能需要结合 webpack 或 vite 配合使用。

**核心功能**

1. 语法转换：将新版本的 JavaScript 语法转换为旧版本的语法
2. Polyfill：通过引入额外的代码，使新功能在旧浏览器中可用
3. JSX：将 JSX 语法转换成普通的 JavaScript 语法
4. 插件：为 Babel 提供自定义功能

**案例**

1. 语法转换：es6转es5

```bash
npm install @babel/core @babel/cli @babel/preset-env core-js --save-dev
```

```js
// es6.js
// es6语法代码
const a = (params = 2) => 1 + params;
const b = [1, 2, 3];
const c = [...b, 4, 5];
class Babel {}
new Babel();

// API
const x = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter((x) => x % 2 === 0);
const y = Object.assign({}, { name: 1 });
```

```js
// index.js
// 核心转换代码
import babel from "@babel/core";
import presetEnv from "@babel/preset-env"; // es6->es5核心库
import fs from "node:fs";

const file = fs.readFileSync("./es6.js", "utf8");
const result = babel.transform(file, {
  presets: [presetEnv, { useBuiltIns: "usage", corejs: 3 }],
});
console.log(result.code);
```

2. 转换react的jsx语法

```bash
npm install react react-dom
npm install @babel/preset-react -D
```

```jsx
// app.jsx
import react from "react";
import { createRoot } from "react-dom/client";

const App = () => {
  return <div>Hello</div>;
};

createRoot(document.getElementById("root")).render(<App />);
```

```js
// index.js
import babel from "@babel/core";
import presetEnv from "@babel/preset-env";
import fs from "node:fs";
import react from "@babel/preset-react";

const file = fs.readFileSync("./app.jsx", "utf8");
const result = babel.transform(file, {
  presets: [presetEnv, { useBuiltIns: "usage", corejs: 3 }, react],
});
console.log(result.code);
```

## SWC

**核心功能**

1. js/ts 语法转换 和 polyfill 的处理
2. 模块打包
3. 代码压缩和优化
4. 原生支持 ts ，可以将 ts 代码编译成 js 代码
5. 支持 react 和 jsx 语法

**案例**

1. 语法转换

```bash
npm i @swc/cli @swc/core -D
```

```js
// es6.js
const a = (params = 2) => 1 + params;
const b = [1, 2, 3];
const c = [...b, 4, 5];
class Babel {}
new Babel();

// API
const x = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter((x) => x % 2 === 0);
const y = Object.assign({}, { name: 1 });
```

```js
// index.js
import swc from "@swc/core";

const result = swc.transformFileSync("./es6.js", {
  jsc: {
    parser: {
      syntax: "ecmascript",
    },
    target: "es5",
  },
});
console.log(result.code);
```

2. 转换jsx

```jsx
// app.jsx
import react from "react";
import { createRoot } from "react-dom/client";

const App = () => {
  return <div>Hello</div>;
};

createRoot(document.getElementById("root")).render(<App />);
```

```js
// index.js
import swc from "@swc/core";

console.time();
const result = swc.transformFileSync("./test.jsx", {
  jsc: {
    parser: {
      syntax: "ecmascript",
      jsx: true,
    },
    target: "es5",
    transform: {
      react: {
        runtime: "automatic",
      },
    },
  },
});
console.log(result.code);
console.timeEnd();
```
