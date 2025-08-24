---
title: Next.js Caching
description: Next.js Caching
sidebar:
  order: 102
---

## Next.js Caching Strategies

| Strategy              | What                                           | Where                                | Why                                   | How long                                | How to refresh                   | How to cancel                         |
|-----------------------|-----------------------------------------------|--------------------------------------|---------------------------------------|------------------------------------------|-----------------------------------|----------------------------------------|
| Request Memoization   | memoize identical requests in single render pass | server-side in memory (build & run time) | dedupe requests & avoid props drilling | short lived                             | not needed                        | auto – only GET requests are memoized  |
| Data Cache            | memoize any server-side fetch                 | local/edge/custom storage server-side | minimize network calls & increase performance | persistent even across deployments | time-based or on-demand revalidation | `{ cache: "no-store" }`              |
| Full Route Cache      | memoize static pages (HTML + RSC payload)     | localstorage/custom storage server-side | serve HTML & RSC fast for FCP & smooth hydration | persistent across user requests & restarts | revalidation or redeploying      | making the page dynamic                |


[Caching in Next.js](https://nextjs.org/docs/app/guides/caching)