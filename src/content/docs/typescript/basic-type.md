---
title: 基本类型
description: 基本类型
sidebar:
  order: 1
---

## 初始化环境

```bash
tsc --init

tsc -w

node index.ts
```

## 基础类型

```ts
let str: string = "Hello, TypeScript";
let num: number = 18;
let bool: boolean = true;
let nullValue: null = null;
let undefinedValue: undefined = undefined;
let voidValue: void = undefined;

console.log(str);
```

## 类型顺序

1. top type 顶级类型：any unknown
2. Object
3. Number String Boolean
4. number string boolean
5. 1 '1' true
6. never

## 任意类型

```ts
// any：任意类型
let a: any = 1;
a = "hello";
a = true;

// unknown：未知类型
let b: unknown = 1;
let n: number = 5;

// unknown类型的值不能直接赋值给其他类型的变量，必须进行类型断言或类型检查
// b = n // Error: Type 'unknown' is not assignable to type 'number'.
if (typeof b === "number") {
  n = b; // 通过类型检查后，可以赋值
}

// unknown没有办法读取属性或调用方法
// console.log(b.length) // Error: Object is of type 'unknown'.
// b.toString() // Error: Object is of type 'unknown'.

// unknown比any更安全，因为它强制开发者进行类型检查，避免了潜在的运行时错误。
```

## Object

```ts
let o1: Object = 123;
let o2: Object = "abc";
let o3: Object = true;
let o4: Object = { x: 1, y: 2 };
let o5: Object = [1, 2, 3];
let o6: Object = function () {
  return 123;
};
```

### object

```ts
// 只能赋值为对象类型，不能赋值为基本类型
// 一般用于泛型约束
let o1: object = { a: 1 };
let o2: object = [1, 2, 3];
let o3: object = () => 18;
```

###

```ts
let a1: {} = 12; // => new Object

let a2: {} = { name: "admin" };
// a2.age = 18  // => error: Property 'age' does not exist on type '{}'.ts(2339)
```

## 接口和对象类型

```ts
interface Person {
  name: string;
  age: number;
  [propName: string]: any; // 2. 索引签名，允许添加任意属性
  id?: number; // 3. 可选属性，表示该属性可以存在也可以不存在
  readonly callback: () => void; // 4. 函数类型属性，表示该属性是一个函数； readonly表示该属性只能被赋值一次，不能被修改
}

// 1. 可以同名，会进行合并
interface Person {
  address: string;
}

// 5. 接口继承，SuperPerson接口继承了Person接口，拥有Person接口的所有属性和方法
interface SuperPerson extends Person {
  x: string;
}

let p1: Person = {
  name: "Alice",
  age: 18,
  address: "123 Main St",
  a: "hello",
  b: 123,
  id: 1,
  callback: () => {
    console.log("Callback function");
  },
};

p1.callback();

// 6. 定义一个函数类型的接口，表示该接口是一个函数，参数为两个数字，返回值为一个数字
interface Add {
  (a: number, b: number): number;
}

let add: Add = (x, y) => x + y;

console.log(add(2, 3)); // 输出：5
```

## 数组类型

```ts
let arr1: number[] = [1, 2, 3];
// 泛型写法
let arr2: Array<string> = ["a", "b", "c"];

// 定义对象数组
interface Person {
  name: string;
  age: number;
}

let arr3: Array<Person> = [
  { name: "Alice", age: 30 },
  { name: "Bob", age: 25 },
];
let arr4: Person[] = [
  { name: "Charlie", age: 35 },
  { name: "Dave", age: 28 },
];

// 定义二维数组
let arr5: number[][] = [
  [1, 2, 3],
  [4, 5, 6],
];
let arr6: Array<Array<string>> = [
  ["a", "b", "c"],
  ["d", "e", "f"],
];

// 定义混合类型数组
let arr7: (number | string)[] = [1, "two", 3, "four"];
let arr8: Array<number | string> = [5, "six", 7, "eight"];
let arr9: any[] = [1, "two", true, { name: "Alice" }, [1, 2, 3]];

// 定义只读数组
let arr10: ReadonlyArray<number> = [1, 2, 3];
let arr11: ReadonlyArray<string> = ["a", "b", "c"];

// 定义元组
let tuple1: [number, string] = [1, "one"];
let tuple2: [string, number, boolean] = ["two", 2, true];

// 定义枚举数组
enum Color {
  Red,
  Green,
  Blue,
}

let arr12: Color[] = [Color.Red, Color.Green, Color.Blue];

// 定义函数数组
type Func = (x: number) => number;
let arr13: Func[] = [(x) => x + 1, (x) => x * 2, (x) => x - 3];

function sum(...args: number[]): number {
  return args.reduce((acc, val) => acc + val, 0);
}
sum(1, 2, 3); // 6
sum(4, 5); // 9

// 定义数组的类型别名
type StringArray = string[];
let arr14: StringArray = ["a", "b", "c"];

// 定义数组的接口
interface NumberArray {
  [index: number]: number;
}
let arr15: NumberArray = [1, 2, 3];
```

## 函数类型

```ts
// 函数定义类型和返回值
function add(x: number, y: number): number {
  return x + y;
}
console.log(add(5, 10)); // 输出: 15

// 函数表达式
const myAdd = function (x: number, y: number): number {
  return x + y;
};
console.log(myAdd(5, 10)); // 输出: 15

// 箭头函数
const myArrowAdd = (x: number, y: number): number => {
  return x + y;
};
console.log(myArrowAdd(5, 10)); // 输出: 15

// 函数可选参数
function buildName(firstName: string, lastName?: string): string {
  if (lastName) {
    return firstName + " " + lastName;
  } else {
    return firstName;
  }
}

// 函数默认参数(默认值)
function buildNameWithDefault(
  firstName: string,
  lastName: string = "Smith",
): string {
  return firstName + " " + lastName;
}

// 函数剩余参数
function buildNameWithRest(firstName: string, ...restOfName: string[]): string {
  return firstName + " " + restOfName.join(" ");
}

// 函数类型接口
interface Person {
  name: string;
  age: number;
}

function getPerson(person: Person): Person {
  return person;
}
console.log(getPerson({ name: "Alice", age: 30 })); // 输出: { name: "Alice", age: 30 }

// 函数this类型
interface Card {
  suit: string;
  card: number;
}

interface Deck {
  suits: string[];
  cards: number[];
  createCardPicker(this: Deck): () => Card;
}

let deck: Deck = {
  suits: ["hearts", "spades", "clubs", "diamonds"],
  cards: Array(52),
  createCardPicker: function (this: Deck) {
    return () => {
      const pickedCard = Math.floor(Math.random() * 52);
      const pickedSuit = Math.floor(pickedCard / 13);
      return { suit: this.suits[pickedSuit], card: pickedCard % 13 };
    };
  },
};

const cardPicker = deck.createCardPicker();
const pickedCard = cardPicker();
console.log(`You picked the ${pickedCard.card} of ${pickedCard.suit}.`);

// 函数重载
function reverse(x: number): number;
function reverse(x: string): string;
function reverse(x: number | string): number | string {
  if (typeof x === "number") {
    return Number(x.toString().split("").reverse().join(""));
  } else {
    return x.split("").reverse().join("");
  }
}

// 使用函数重载
const reversedNumber = reverse(12345); // reversedNumber 的类型是 number
const reversedString = reverse("Hello"); // reversedString 的类型是 string

console.log(reversedNumber); // 输出: 54321
console.log(reversedString); // 输出: "olleH"
```

## 联合类型

```ts
let phone: string | number;
phone = "1234567890"; // 可以是字符串
phone = 1234567890; // 也可以是数字

const getLength = (input: string | number): number => {
  if (typeof input === "string") {
    return input.length; // 如果是字符串，返回长度
  } else {
    return input.toString().length; // 如果是数字，转换为字符串后返回长度
  }
};

console.log(getLength("Hello")); // 输出: 5
console.log(getLength(12345)); // 输出: 5

const isValidPhoneNumber = (phone: string | number): boolean => {
  const phoneStr = phone.toString();
  const phoneRegex = /^\d{10}$/; // 简单的正则表达式，匹配10位数字
  return phoneRegex.test(phoneStr);
};

console.log(isValidPhoneNumber("1234567890")); // 输出: true
```

## 交叉类型

```ts
interface Person {
  name: string;
  age: number;
}

interface Employee {
  company: string;
  salary: number;
}

type EmployeePerson = Person & Employee;

const employeePerson: EmployeePerson = {
  name: "John",
  age: 30,
  company: "ABC Inc.",
  salary: 50000,
};

console.log(employeePerson);
```

## 类型断言

```ts
const someValue: unknown = "this is a string";
const strLength: number = (someValue as string).length;

console.log(strLength); // 输出: 16
```

## class

### class的基本用法、继承、类型约束

实现简单虚拟DOM

```ts
interface VNode {
  tag: string; // div
  text?: string;
  children?: VNode[];
}

// 构建父类
class Dom {
  // 创建节点的方法
  createElement(el: string) {
    return document.createElement(el);
  }

  // 填充文本的方法
  setText(el: HTMLElement, text: string | null) {
    el.textContent = text;
  }

  // 渲染函数
  render(data: VNode) {
    let root = this.createElement(data.tag);
    if (data.children && Array.isArray(data.children)) {
      data.children.forEach((item) => {
        let child = this.render(item);
        root.appendChild(child);
      });
    } else {
      this.setText(root, data.text);
    }

    return root;
  }
}

interface Options {
  el: string | HTMLElement;
}

interface IVue {
  options: Options;
  init(): void;
}

// 类型约束：使用implements
// 继承：使用extends
class Vue extends Dom implements IVue {
  options: Options;

  constructor(options: Options) {
    super();
    this.options = options;
    this.init();
  }

  init(): void {
    let data: VNode = {
      tag: "div",
      children: [
        { tag: "h1", text: "标题" },
        { tag: "p", text: "内容" },
      ],
    };

    let app =
      typeof this.options.el == "string"
        ? document.querySelector(this.options.el)
        : this.options.el;

    // 在子类调用父类的方法
    app.appendChild(this.render(data));
  }
}

new Vue({
  el: "#app",
});
```

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>vite-ts</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

### class的修饰符

```ts
class Person {
  // readonly：只能添加在属性上
  readonly id: string;
  name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  // public：可以在父类中使用、子类中使用，实例中也可以使用
  public init(): void {
    console.log("init");
  }

  // private：只能在父类的内部使用，不能在子类中使用
  private getId() {
    return this.id;
  }

  // protected：可以在父类的内部和子类中使用
  protected getName() {
    return this.name;
  }
}
```

### super的原理

```ts
class Person {
  readonly id: string;

  constructor(id: string) {
    this.id = id;
  }

  public init(): void {
    console.log("init");
  }
}

class People extends Person {
  constructor() {
    // super 指向的就是Person父类
    // 就是父类的prototype.construct.call()
    super("admin");
    // 调用父类的方法
    this.init();
  }
}

new People();
```

### 静态方法

```ts
class Person {
  readonly id: string;

  constructor(id: string) {
    this.id = id;
  }

  public init(): void {
    console.log("init");
  }
}

class People extends Person {
  static name: string;

  constructor() {
    super("admin");
    this.init();
  }

  static logger() {
    return console.log("logger...");
  }

  static version() {
    // static：只能调用static的属性和方法
    this.logger();
    return "1.0";
  }
}

const p1 = new People();

// 调用static方法
People.version();
```

## get set

```ts
class Person {
  private _id: string;

  constructor(id: string) {
    this._id = id;
  }

  get id() {
    return this._id;
  }

  set id(newId: string) {
    this._id = newId + " new";
  }
}

const p1 = new Person("admin");
// 读取值
console.log(p1.id); // admin

// 设置值
p1.id = "user";
console.log(p1.id); // user new
```

## 抽象类

```ts
// abstract：定义抽象类
abstract class Person {
  name: string;

  constructor(name: string = "") {
    this.name = name;
  }

  getName(): string {
    return this.name;
  }

  // abstract定义的方法只能描述，不能有方法体
  abstract init(name: string): void;
}

// 抽象类无法被实例化
// new Person()

// 派生类
class People extends Person {
  constructor() {
    super();
  }

  init(name: string): void {
    this.name = name;
  }

  setName(name: string) {
    this.name = name;
  }
}

const p1 = new People();
console.log(p1.getName());

p1.setName("admin");
console.log(p1.getName()); // admin
```

## 元组类型

```ts
let arr1: [number, string, boolean] = [1, "admin", false];

arr1[0] = 2;

arr1.push(true);

// 获取类型
type n1 = (typeof arr1)[0];

const arr2: readonly [x: number, y?: boolean] = [1];

// 实际应用
let excel: [string, number][] = [
  ["张三", 18],
  ["李四", 19],
];
```

## 枚举类型

```ts
// 数字
enum Status {
  disable, // 0
  active, // 1
}

// 字符串
enum Color {
  red = "red",
  green = "green",
}

// const
const enum Types {
  success,
  fail,
}

//
enum Sex {
  man,
  woman,
}

let man: number = Sex.man; // 0
let key = Sex[man]; // man
```

## 类型别名

```ts
// 使用type关键字定义类型别名
type str = string;

let s: str = "admin";
```

### 区别

```ts
// 交叉类型
// 表示：同时是 string 和 number
// 问题来了：一个值不可能既是 string 又是 number
type S = string & number; // 等价于 never

interface A extends B {}

interface B {}
```

```ts
// 联合类型
// 表示：可以是 string 或 number
type S = string | number;

let a: S;
a = "hello";
a = 18;

interface A {
  name: string | number;
}

interface A {
  age: number;
}
```

### 高级用法

```ts
// extends：包含的意思
// 左边的值 会作为右边类型的子类型
type num = 1 extends number ? 1 : 0;
```

## never类型

```ts
type A = "唱" | "跳" | "跑";

function get(value: A) {
  switch (value) {
    case "唱":
      console.log("唱...");
      break;
    case "跳":
      console.log("跳...");
      break;
    case "跑":
      console.log("跑...");
      break;
    default:
      // 兜底逻辑
      const v: never = value;
      console.log(v);
      break;
  }
}
```

## Symbol类型

```ts
let s1: symbol = Symbol(1); // Symbol的值唯一的
let s2: symbol = Symbol(1);

console.log(s1 == s2); // false

// Symbol.for()会在全局查找是否注册过1这个key，如果有直接拿来用
console.log(Symbol.for("1") == Symbol.for("1")); // true

// 使用场景：用作对象的key
let obj = {
  name: "admin",
  [s1]: 11,
  [s2]: 22,
};

// for...in 无法读取symbol
for (const key in obj) {
  console.log(key);
}

// Object.keys(obj)
// Object.getOwnPropertyNames(obj)

// console.log(Object.getOwnPropertySymbols(obj));

console.log(Reflect.ownKeys(obj));
```

## Generator

```ts
function* gen() {
  yield Promise.resolve("1");
  yield "2";
  yield "3";
}

const g = gen();
console.log(g.next()); // { value: Promise { '1' }, done: false }
console.log(g.next()); // { value: '2', done: false }
console.log(g.next()); // { value: '3', done: false }
console.log(g.next()); // { value: undefined, done: true }
```

## iterator

```ts
let set: Set<number> = new Set([1, 1, 2, 2, 3]);
console.log(set); // Set(3) { 1, 2, 3 }

let map: Map<any, any> = new Map();

let arr = [1, 2, 3];
map.set(arr, "admin");
console.log(map.get(arr)); // admin

function args() {
  console.log(arguments); // 伪数组
}

// const list = document.querySelectorAll('div')  // 伪数组

// 实现迭代器
const each = (value: any) => {
  let it: any = value[Symbol.iterator]();
  let next: any = { done: false };
  while (!next.done) {
    next = it.next();
    if (!next.done) {
      console.log(next.value); // [ [ 1, 2, 3 ], 'admin' ]
    }
  }
};

each(map);

// 迭代器的语法糖
for (const value of map) {
  console.log(value); // [ [ 1, 2, 3 ], 'admin' ]
}

// 解构
let [a, b] = [10, 11];
console.log(a, b);

// 对象支持for...of
const obj = {
  max: 5,
  current: 0,
  [Symbol.iterator]() {
    return {
      max: this.max,
      current: this.current,
      next() {
        if (this.current == this.max) {
          return {
            value: undefined,
            done: true,
          };
        } else {
          return {
            value: this.current++,
            done: false,
          };
        }
      },
    };
  },
};

for (const value of obj) {
  console.log(value);
}
```

## 泛型

```ts
// 函数泛型
function foo<T>(a: T, b: T): Array<T> {
  return [a, b];
}

foo(1, 2);
foo("admin", "user");

function add<T = number, K = number>(a: T, b: K): Array<T | K> {
  return [a, b];
}

add(1, false);

// 定义泛型接口
type A<T> = string | number | T;

let a1: A<number> = 10;
let a2: A<boolean> = true;

interface Response<T> {
  data: T;
}

let res: Response<string> = {
  data: "success",
};

// 使用场景
const axios = {
  get<T>(url: string): Promise<T> {
    return new Promise((resolve, reject) => {
      let xhr: XMLHttpRequest = new XMLHttpRequest();
      xhr.open("GET", url);
      xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
          resolve(JSON.parse(xhr.responseText));
        }
      };
      xhr.send(null);
    });
  },
};

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

axios.get<Todo[]>("https://jsonplaceholder.typicode.com/todos").then((res) => {
  console.log(res[0].title);
});

// 泛型约束
function sum<T extends number>(a: T, b: T) {
  return a + b;
}
sum(10, 20);

// keyof的使用场景
const person = {
  name: "admin",
  address: "CN",
};

type Key = keyof typeof person;

function ob<T extends object, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}

ob(person, "name");

// 高级用法
interface Res {
  code: number;
  msg: string;
  data: string;
}

type Options<T extends object> = {
  [Key in keyof T]?: T[Key];
};

type B = Options<Res>;
```
