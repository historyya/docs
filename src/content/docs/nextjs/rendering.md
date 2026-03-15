---
title: Rendering
description: Rendering
sidebar:
  order: 5
---

## CSR

客户端渲染 (Client Side Rendering)

### 工作流程

1. 浏览器发起请求
2. 服务器返回HTML/JS/CSS等文件
3. JS动态渲染生成DOM
4. 浏览器渲染DOM

### 优点

- 交互流畅，可直接响应
- 前后端分离，前端注重UI，后端注重数据

### 缺点

- 首屏加载慢，因为需要下载JS/CSS等文件
- SEO不友好，因为JS动态渲染

### 适合场景

- 后台管理系统开发
- 单页面应用开发 (SPA)

## SSR

服务端渲染 (Server Side Rendering)

### 工作流程

1. 浏览器发起请求
2. 服务器(内部调用API接口->渲染HTML页面)
3. 浏览器读取HTML页面并加载JS/CSS等文件
4. 执行水合

### 优点

1. 首屏加载快，因为服务器已经渲染了HTML页面
2. SEO友好，搜索引擎能爬取到完整内容

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

### 缺点

- 服务器承担渲染工作，如果用户访问量大，对服务器配置要求高，增大成本

### 适合场景

- 企业官网
- 电商网站
- 博客网站

## SSG

静态站点生成 (Static Side Generation)

Next.js use generateStaticParams()

### 工作流程

1. 项目构建 `npm run build`
2. 生成静态文件 (路由对应HTML页面)
3. 部署到Nginx或CDN
4. 浏览器发起请求
5. 服务器返回HTML页面
6. 水合

### 优缺点

1. [x] Better Performance
2. [x] Server has less load
3. [x] Instant page load
4. [ ] Not suitable for Dynamic Content

## ISR

(Incremental Static Regeneration)

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

(Partial Prerendering)

## 水合

> HTML页面是静态的，需要通过JS才能变成动态的，不然HTML是没有任何交互效果的，当JS下载完成在赋予HTML交互效果的阶段称之为**水合**

### Next.js水合

1. HTML structure
2. CSS design
3. JavaScript for hydration
4. Client part of React & Next.js
5. RSC payload

#### 服务端操作

1. Next.js 服务器接收到用户请求
2. 服务器执行 React 组件代码，获取数据 (比如从 API 接口请求文章列表)
3. 服务器将 React 组件渲染成静态 HTML 字符串 (包含了文章列表的所有内容)
4. 服务器将这个 HTML 字符串返回给浏览器

#### 客户端操作

1. 浏览器接收到 HTML，立即解析并展示给用户 (此时用户能看到文章列表，但点击 “查看详情” 按钮没有反应)
2. 浏览器开始下载页面所需的 JS 文件 (包括 React 核心库、组件代码等)
3. JS 下载完成后，React 会执行 `ReactDOM.hydrateRoot()` 方法 (在 React 18+ 中)
4. `hydrateRoot()` 会对比浏览器中的真实 DOM 和 React 组件的虚拟 DOM
   - 如果结构一致，React 会给真实 DOM 绑定事件监听器
   - 如果发现差异 (比如服务器和客户端数据不一致)，React 会发出警告，并以客户端渲染的结果为准
5. 水合完成后，页面变成可交互的动态页面 (用户可以点击按钮、滚动加载更多内容等)
