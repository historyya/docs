---
title: Date
description: Date
sidebar:
  order: 10
---

## Date()

```js
// 当前时间，返回Sun Dec 17 1995 03:24:00 GMT
const now = new Date();

// 返回Sun Nov 26 1989 02:30:00 GMT
const birthday = new Date(628021800000);

// 返回Wed Jan 01 2025 08:00:00 GMT
const fromString = new Date('2025-01-01');
```

## Timestamp

时间戳是从 1970年1月1日 00:00:00 UTC（Unix 纪元）到指定时间的毫秒数

```js
// 获取当前时间戳
const timestamp = Date.now();
// 或
const timestamp = new Date().getTime();

// 从时间戳还原日期，返回Sun Dec 17 1995 03:24:00 GMT
const date = new Date(timestamp);
```
