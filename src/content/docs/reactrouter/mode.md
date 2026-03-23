---
title: Router Mode
description: 路由模式
sidebar:
  order: 2
---

## createBrowserRouter

### 特点

- 使用 HTML5 的 history API (pushState, replaceState, popState)
- 浏览器URL比较纯净 (/about, /blog/first-post)
- 需要服务器端支持 (nginx等)，否则会刷新404

### 使用场景

- 大部分现代浏览器环境

### 解决方案

#### 解决刷新404问题

浏览器默认会去请求资源，如果服务器上没有资源，就会返回 404 。要解决这个问题需要在服务器配置一个回退路由，当请求的资源不存在时，返回 `index.html` 。

##### Nginx

```txt
location / {
  try_files $uri $uri/ /index.html;
}
```

## createHashRouter

### 特点

- 使用 URL 的 hash 部分 (/#/system, /#/content/edit)
- 刷新页面不好丢失

### 使用场景

- 静态站点托管等

## createMemoryRouter

### 特点

- 使用内存中的路由表
- 刷新页面会丢失状态
- 切换页面路由不显示 URL

### 使用场景

- 非浏览器环境
- 单元测试

## createStaticRouter

### 特点

- 专为 SSR 设计
- 在服务器端匹配请求路径，生成静态 HTML
- 需与客户端路由器 (如 createBrowserRouter ) 配合使用

### 使用场景

- 服务器端渲染
- SEO优化的页面
