---
title: 内置对象
description: 内置对象
sidebar:
  order: 20
---

## ECMAScript的内置对象

```ts
let num: Number = new Number(18);
let date: Date = new Date();
let regExp: RegExp = new RegExp("abc");
let error: Error = new Error("An error occurred");
let xhr: XMLHttpRequest = new XMLHttpRequest();
```

## DOM的内置对象

```ts
let div: HTMLElement | null = document.querySelector("div");
let input: HTMLInputElement | null = document.querySelector("input");

let a: NodeList = document.querySelectorAll("a");

let el: NodeListOf<HTMLDivElement | HTMLElement> =
  document.querySelectorAll("div");
```

## BOM的内置对象

```ts
let local: Storage = localStorage;
let cookies: Storage = document.cookie as unknown as Storage;
```
