---
title: Express
description: Express
sidebar:
  order: 5
---

## 基本使用

```js
// index.js
import express from "express";
import userRouter from "./router/user.js";
import Logger from "./middleware/logger.js";

const app = express();
app.use(express.json()); // 解析json
app.use(express.urlencoded({ extended: true })); // 解析urlencoded

app.use(Logger);

app.use("/user", userRouter); // 注册路由

// req.query
app.get("/get", (req, res) => {
  console.log(req.query);
  res.send("get");
});

// 动态参数 req.params
app.get("/get/:id", (req, res) => {
  res.send(`get ${req.params.id}`);
});

// req.body
app.post("/post", (req, res) => {
  console.log(req.body);
  res.send("post");
});

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
```

```js
// router/user.js
import express from "express";

const router = express.Router();

router.post("/register", (req, res) => {
  res.json({
    code: 0,
    message: "success",
  });
});

router.post("/login", (req, res) => {
  res.json({
    code: 0,
    message: "success",
  });
});

export default router;
```

```js
// middleware/logger.js
import log4js from "log4js";

log4js.configure({
  appenders: {
    out: { type: "stdout", layout: { type: "colored" } },
    file: {
      type: "file",
      filename: "logs/server.log",
      layout: { type: "basic" },
    },
  },
  categories: {
    default: { appenders: ["out", "file"], level: "info" },
  },
});

const logger = log4js.getLogger("default");

const Logger = (req, res, next) => {
  logger.info(`${req.method} ${req.url} ${JSON.stringify(req.body)}`);
  next();
};

export default Logger;
```

### 响应头

### CORS

```js
import express from "express";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 后端设置跨域
app.use("*", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000"); // 允许指定域名访问
  res.setHeader("Access-Control-Allow-Headers", "Content-Type"); // 允许指定请求头
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE"); // 允许指定请求方法
  next();
});

/**
 * 预检请求OPTIONS
 * 1. 浏览器会先发送一个OPTIONS请求，询问服务器是否允许跨域
 * 2. 如果服务器允许跨域，浏览器会发送真正的请求
 * 3. 如果服务器不允许跨域，浏览器会阻止请求
 */

app.get("/index", (req, res) => {
  res.set("token", "1234567890"); // 新增响应头
  res.set("Access-Control-Expose-Headers", "token"); // 允许暴露的响应头
  res.json({
    code: 0,
    message: "success",
  });
});

// 大屏项目
app.get("/sse", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream"); // SSE 流式响应
  //   res.setHeader("Cache-Control", "no-cache");
  //   res.setHeader("Connection", "keep-alive");
  //   res.setHeader("Access-Control-Allow-Origin", "*");
  //   res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  //   res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  //   res.setHeader("Access-Control-Allow-Credentials", "true");

  setInterval(() => {
    res.write("event: msg\n"); // 自定义事件名
    res.write("data: " + Date.now() + "\n\n");
  }, 1000);

  res.json({
    code: 0,
    message: "success",
  });
});

app.post("/index", (req, res) => {
  res.json({
    code: 0,
    message: "success",
  });
});

app.delete("/index", (req, res) => {
  res.json({
    code: 0,
    message: "success",
  });
});

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
```

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <script>
      fetch("http://localhost:3000/index")
        .then((res) => {
          console.log(res.headers.get("token"));
          return res.json();
        })
        .then((data) => console.log(data));

      fetch("http://localhost:3000/index", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: "John", age: 18 }),
      })
        .then((res) => res.json())
        .then((data) => console.log(data));

      fetch("http://localhost:3000/index", {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => console.log(data));

      const eventSource = new EventSource("http://localhost:3000/sse");
      eventSource.onmessage = (event) => {
        console.log(event.data);
      };
    </script>
  </body>
</html>
```

### 请求头

## 实战-防盗链

```js
import express from "express";

const app = express();

// 静态资源
app.use(express.static("static"));

const whiteList = ["localhost:3000"];

const preventHotlinking = (req, res, next) => {
  const referer = req.get("referer");
  if (referer) {
    const host = new URL(referer).host;
    if (!whiteList.includes(host)) {
      res.status(403).send("Forbidden");
    }
  }
  next();
};

// 防盗链
app.use(preventHotlinking);

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
```
