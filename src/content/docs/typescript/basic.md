---
title: 基础
description: 基础
sidebar:
  order: 2
---

## 模块解析

### 默认导出

```ts
// src/count.ts
// 默认导出。一个模块只能出现一个默认导出
export default "foo";
```

```ts
// src/index.ts
// 导入使用，默认名随便写
import f from "./count.ts";

console.log(f);
```

### 分别导出

```ts
export function count(n1: number, n2: number): number {
  return n1 + n2;
}

export let x = 10;
export let y = 20;

export const arr = [1, 2, 3, 4, 5];
```

```ts
import { count, x, y, arr } from "./count.ts";

console.log(count(1, 2));
console.log(x);
console.log(y);
console.log(arr);
```

### 解构导出

```ts
function count(n1: number, n2: number): number {
  return n1 + n2;
}

let x = 10;
let y = 20;

const arr = [1, 2, 3, 4, 5];

export { count, x, y, arr };
```

```ts
import { count as counter, x, y, arr } from "./count.ts";

console.log(counter(1, 2));
console.log(x);
console.log(y);
console.log(arr);
```

### 查看所有导出

```ts
export default {
  name: "admin",
};

function count(n1: number, n2: number): number {
  return n1 + n2;
}

const arr = [1, 2, 3, 4, 5];

export { count, arr };
```

```ts
import * as a from "./count.ts";

console.log(a);
// [Module: null prototype] {
//   arr: [ 1, 2, 3, 4, 5 ],
//   count: [Function: count],
//   default: { name: 'admin' }
// }
```

### 动态引入

```ts
if (true) {
  import("./count.ts").then((module) => {
    console.log(module.default);
    console.log(module.count(10, 20));
    console.log(module.arr);
  });
}
```

## 声明文件

```ts
// src/counter.ts
function count(n1: number, n2: number): number {
  return n1 + n2;
}

const arr = [1, 2, 3, 4, 5];

export { count, arr };
```

```ts
// src/counter.d.ts
declare module "counter" {
  interface Counter {
    count(n1: number, n2: number): number;
    arr: number[];
  }
  const counter: Counter;
  export default counter;
}
```

## Mixins 混入

### 对象混入

```ts
interface A {
  name: string;
}

interface B {
  age: number;
}

let a: A = {
  name: "admin",
};

let b: B = {
  age: 18,
};

// 合并

// 1. 扩展运算符：浅拷贝，返回一个新的类型:{age: number;name: string;}
const c1 = {
  ...a,
  ...b,
};

// 2. Object.assign：浅拷贝，交叉类型:A & B
const c2 = Object.assign(a, b);

// 3. structuredClone：深拷贝，返回一个新的类型:{age: number;name: string;}
const c3 = structuredClone({
  ...a,
  ...b,
});
```

### 类混入

```ts
// A类和B类合并到一起
class Logger {
  log(message: string) {
    console.log(message);
  }
}

class Html {
  render() {
    console.log("render");
  }
}

class App {
  run() {
    console.log("run");
  }
}

type Constructor<T> = new (...args: any[]) => T;

function pluginMixins<T extends Constructor<App>>(Base: T) {
  return class extends Base {
    private logger = new Logger();
    private html = new Html();

    constructor(...args: any[]) {
      super(...args);
      this.logger = new Logger();
      this.html = new Html();
    }

    run(): void {
      this.logger.log("Running app");
    }

    render(): void {
      this.html.render();
    }
  };
}

const mixins = pluginMixins(App);

const app = new mixins();
app.run();
app.render();
```
