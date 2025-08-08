---
title: RxJS
description: RxJS
sidebar:
  order: 7
---

## 概念

RxJS使用的是观察者模式，用来编写异步队列和事件处理。

### Observable

```ts
import { Observable } from 'rxjs';

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
  next: (value) => console.log(value),
});

// 输出 1 2 3 4
```

### interval

```ts
import { interval, take } from 'rxjs';

interval(100)
  .pipe(take(5))
  .subscribe((e) => console.log(e));

// 输出 0 1 2 3 4
```

### of

```ts
import { filter, map, of } from 'rxjs';

of(1, 2, 3, 4, 5, 6)
  .pipe(
    map((v) => ({ num: v })),
    filter((v) => v.num % 2 == 0),
  )
  .subscribe((e) => {
    console.log(e);
  });
```
