---
title: Fastify
description: Fastify
sidebar:
  order: 30
---

## 基本使用

```js
import Fastify from "fastify";
import cors from "@fastify/cors";

const fastify = Fastify({
  logger: true,
});

// 插件
await fastify.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});

// Declare a route
fastify.get("/", async function handler(request, reply) {
  return { success: true };
});
// 天然支持POST
fastify.post("/", async function handler(request, reply) {
  console.log(request.body);
  return { success: true, data: request.body };
});

// 路由
fastify.route({
  method: "POST",
  url: "/new",
  // 序列化入参和出参
  schema: {
    body: {
      type: "object", // 要求前端传入一个对象
      properties: {
        name: { type: "string" },
        age: { type: "number" },
      },
      required: ["name", "age"],
    },
    response: {
      200: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          data: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                age: { type: "number" },
              },
            },
          },
        },
      },
    },
  },
  handler: async (request, reply) => {
    return { success: true, data: request.body };
  },
});

// Run the server!
try {
  await fastify.listen({ port: 3000 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
```

## 网关层

以下是一些网关层的主要功能和优势：

1.  路由：网关层可以根据请求的 URL 路径或其他条件将请求转发到不同的后端服务。它可以根据特定的路由规则来决定请求应该被发送到哪个服务处理。
2.  负载均衡：当有多个后端服务提供相同的功能时，网关层可以通过负载均衡算法将请求分发到这些服务中，以达到分散负载、提高系统性能和可用性的目的。
3.  缓存和性能优化：网关层可以缓存一些经常请求的数据或响应，以减少后端服务的负载和提高响应速度。通过缓存静态内容或频繁请求的数据，可以减少对后端服务的请求，从而提升整体性能。
4.  信道加密：网关层可以提供对请求和响应数据的加密和解密功能，以确保数据在传输过程中的安全性和保密性。通过使用加密算法和安全证书，网关层可以保护敏感数据免受未经授权的访问和窃听。
5.  熔断技术：当后端服务出现故障或异常时，网关层可以使用熔断技术来防止请求继续发送到出现问题的服务上。通过监控后端服务的状态和性能指标，网关层可以自动切换到备用服务或返回错误响应，以提高系统的容错性和可靠性。
6.  限流：网关层可以实施请求限制策略，以防止对后端服务的过度请求造成的负载过载。通过限制每个客户端的请求速率或总请求数量，网关层可以保护后端服务免受滥用或恶意攻击。

代码实现，请访问 Github 仓库。
