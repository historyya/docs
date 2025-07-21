---
title: Nacos
description: Nacos
sidebar:
  order: 52
---

- 服务注册
- 服务发现
- 服务健康检查
- 负载均衡
- 动态配置管理

## 安装

依赖 JDK+MySQL

```bash
$ unzip nacos-server-$version.zip

$ cd nacos/bin

# 单机运行
$ sh startup.sh -m standalone

# 访问 http://127.0.0.1:8080/index.html 登录，管理员用户:nacos
```

## 注册中心

```js
import Nacos from "nacos";

// 创建实例
const nacosClient = new Nacos.NacosNamingClient({
  serverList: ["localhost:8848"],
  namespace: "public",
  logger: console,
});

await nacosClient.ready();

// 注册服务
await nacosClient.registerInstance("user-service", {
  ip: "127.0.0.1",
  port: 3001,
  weight: 1,
  enable: true,
  healthy: true,
  metadata: {
    "nacos.healthcheck.type": "HTTP",
    "nacos.healthcheck.url": "/health",
    "nacos.healthcheck.interval": 5,
    "nacos.healthcheck.timeout": 3,
  },
});

await nacosClient.deregisterInstance("user-service", {
  ip: "127.0.0.1",
  port: 3000,
  weight: 1,
  enable: true,
  healthy: true,
  metadata: {
    "nacos.healthcheck.type": "HTTP",
    "nacos.healthcheck.url": "/health",
    "nacos.healthcheck.interval": 5,
    "nacos.healthcheck.timeout": 3,
  },
});
```

## 动态配置

```js
import Nacos from "nacos";
import express from "express";

const nacosClient = new Nacos.NacosConfigClient({
  serverAddr: "localhost:8848",
});

// 监听配置项的变化
nacosClient.subscribe(
  {
    dataId: "type",
    group: "DEFAULT_GROUP",
  },
  (err, value) => {
    console.log(value);
  }
);

// 新增配置项
await nacosClient.publishSingle("type", "DEFAULT_GROUP", "12");

const enums = {
  type: 1,
};

const app = express();

app.get("/", async (req, res) => {
  // 获取配置
  let result = await nacosClient.getConfig("type", "DEFAULT_GROUP");
  res.json({
    data: JSON.parse(result),
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
```
