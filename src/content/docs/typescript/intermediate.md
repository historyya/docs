---
title: 进阶
description: 进阶
sidebar:
  order: 3
---

## proxy 代理

```ts
let person = {
  name: "John",
  age: 30,
  city: "New York",
};

// Proxy 支持对象、数组、函数、set、map等引用类型的代理
let personProxy = new Proxy(person, {
  // 取值
  get(target, key, receiver) {
    console.log(`Getting property ${String(key)}`);
    return target[key as keyof typeof target];
  },
  // 赋值
  // person name xxx person
  set(target, key, newValue, receiver) {
    console.log(`Setting property ${String(key)} to ${newValue}`);
    target[key as keyof typeof target] = newValue;
    return true;
  },
  // 拦截函数调用
  apply(target, thisArg, argumentsList) {
    console.log(`Calling function with arguments ${argumentsList}`);
    return target.apply(thisArg, argumentsList);
  },
  // 拦截in操作符
  has(target, prop) {
    console.log(`Checking if property ${String(prop)} exists`);
    return prop in target;
  },
  // 拦截for...in
  ownKeys(target) {
    console.log(`Getting own property keys`);
    return Reflect.ownKeys(target);
  },
  // 拦截new操作符
  construct(target, args) {
    console.log(`Constructing object with arguments ${args}`);
    return new target(...args);
  },
  // 拦截delete的操作
  deleteProperty(target, prop) {
    console.log(`Deleting property ${String(prop)}`);
    return delete target[prop as keyof typeof target];
  },
});

console.log(personProxy.name);
personProxy.age = 31;
console.log(personProxy.age);
```

### 代码实现mobx的observable

```ts
// 事件存储器
const eventStore: Set<Function> = new Set();

// 订阅函数
export const subscribe = (fn: Function) => {
  if (eventStore.has(fn)) return;
  eventStore.add(fn);
};

// 取消订阅函数
export const unsubscribe = (fn: Function) => {
  eventStore.delete(fn);
};

const observable = <T extends object>(params: T) => {
  return new Proxy(params, {
    set(target: T, key: any, newValue: any, receiver: any) {
      const result = Reflect.set(target, key, newValue, receiver);
      eventStore.forEach((fn) => fn());
      return result;
    },
  });
};

const objProxy = observable({
  name: "admin",
  age: 18,
});

subscribe(() => {
  console.log("数据发生了变化");
});

objProxy.name = "user";
objProxy.age = 20;
```

## Reflect 反射

```ts
let obj = {
  name: "admin",
  age: 18,
};

// 取值
// 方式一
console.log(obj.name);
// 方式二
console.log(Reflect.get(obj, "name", obj));
```

## 类型守卫

Type Guards 是一种用于在运行时检查类型的机制。它允许你可以在代码中执行特定的检查，以确定变量的类型，并在需要时执行相应的操作。

### 类型收缩

```ts
// 判断是否为字符串
// typeof存在局限性，比如数组、对象、函数、null 会返回 'object'
const isString = (str: any) => typeof str === "string";

// 判断是否为数组
const isArray = (arr: any) => arr instanceof Array;
```

### 类型谓词

```ts
// 实现一个函数，该函数可以传入任意类型，
// 但是如果是object就检查里面的属性，如果里面的属性是num就取两位小数，
// 如果是string就去除左右空格，
// 如果是函数就执行

const isObject = (value: any) =>
  Object.prototype.toString.call(value) === "[object Object]";
// value is number 是类型谓词，告诉 TypeScript 编译器 value 是一个 number 类型
const isNumber = (value: any): value is number => typeof value === "number";
const isString = (value: any) => typeof value === "string";
const isFunction = (value: any) => typeof value === "function";

function processValue(value: any): any {
  if (isObject(value)) {
    let processedValue: any = {};
    // 注意：for...in会遍历原型上的属性
    Object.keys(value).forEach((key) => {
      const prop = value[key];
      if (isNumber(prop)) {
        processedValue[key] = prop.toFixed(2);
      } else if (isString(prop)) {
        processedValue[key] = prop.trim();
      } else if (isFunction(prop)) {
        prop(); // 执行函数
        processedValue[key] = prop; // 保持函数属性不变
      } else {
        processedValue[key] = prop; // 其他类型保持不变
      }
    });
    return processedValue;
  }
  return value;
}

// 示例用法
const obj = {
  num: 3.14159,
  str: "  Hello World!  ",
  func: () => console.log("Function executed!"),
};

console.log(processValue(obj));
```

## 类型兼容

类型兼容性，就是用于确定一个类型是否能赋值给其他的类型。

### 协变 (鸭子类型)

:::note
什么是鸭子类型？

一只鸟走路像鸭子，游泳也像鸭子，那么这只鸟就可以是鸭子。
:::

```ts
interface A {
  name: string;
  age: number;
}

interface B {
  name: string;
  age: number;
  address: string;
}

let a: A = {
  name: "admin",
  age: 18,
};

let b: B = {
  name: "user",
  age: 20,
  address: "US",
};

// 协变
a = b; // 允许赋值，因为 A 是 B 的子类型
// b = a; // 错误，不能将 A 赋值给 B，因为 A 缺少 address 属性

console.log(a);
```

### 逆变

```ts
let fn1 = (a: string) => {
  console.log(a);
};

let fn2 = (a: string | number) => {
  console.log(a);
};

// 逆变：函数参数类型的子类型关系与函数类型的子类型关系相反
fn1 = fn2; // 逆变：fn1的参数类型是string，fn2的参数类型是string | number，fn1的参数类型是fn2的参数类型的子类型，所以fn1可以赋值给fn2
// fn2 = fn1; // 错误：fn2的参数类型是string | number，fn1的参数类型是string，fn2的参数类型不是fn1的参数类型的子类型，所以fn2不能赋值给fn1
```

### 双向协变

```ts
let fn1 = (a: string) => {
  console.log(a);
};
let fn2 = (a: string | number) => {
  console.log(a);
};

// 双向协变
// 需要在tsconfig.json中设置 "strictFunctionTypes": false
fn1 = fn2;
fn2 = fn1;
```
