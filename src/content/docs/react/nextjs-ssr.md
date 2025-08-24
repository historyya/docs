---
title: Next.js CSR vs SSR vs SSG
description: Next.js CSR vs SSR vs SSG
sidebar:
  order: 100
---

## CSR

Client Side Rendering

比如 SPA 应用

## SSR

Server Side Rendering

### 优点

1. 首屏渲染
2. SEO 优化(title、description、keywords)

### 代码

```js
import { JSDOM } from "jsdom";
import fs from "node:fs";

const dom = new JSDOM(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <div id="app"></div>
    </body>
    </html>
`);

const document = dom.window.document;
const app = document.querySelector("#app");

fetch("https://api.github.com/users")
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
    app.innerHTML = data.forEach((user) => {
      const div = document.createElement("div");
      div.innerHTML = user.login;
      app.appendChild(div);
    });
    fs.writeFileSync("index.html", dom.serialize());
  });
```

## SSG

Static Side Generation (use generateStaticParams())

1. [x] Better Performance
2. [x] Server has less load
3. [x] Instant page load
4. [ ] Not suitable for Dynamic Content

## ISR

Incremental Static Regeneration

```tsx
"use server";

export const createPost = async (formData: FormData) => {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  await prisma.post.create({
    data: {
      title,
      content,
      slug: title.toLowerCase().replace(/ /g, "-"),
    },
  });

  // look here
  revalidatePath("/blog");
};
```

## PPR

Partial Prerendering
