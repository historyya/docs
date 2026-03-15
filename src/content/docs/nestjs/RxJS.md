---
title: RxJS
description: RxJS
sidebar:
  order: 2
---

> RxJS 使用的是观察者模式，用来编写异步队列和事件处理

## Observable

```ts
import { Observable } from "rxjs";

const observable = new Observable((subscribe) => {
  subscribe.next(1);
  subscribe.next(2);
  subscribe.next(3);

  setTimeout(() => {
    subscribe.next(4);

    subscribe.complete();
  }, 3000);
});

observable.subscribe({
  next: (num) => {
    console.log(num);
  },
  complete: () => {
    console.log("complete");
  },
});
```
