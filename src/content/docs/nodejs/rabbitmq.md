---
title: RabbitMQ
description: RabbitMQ
sidebar:
  order: 50
---

> AMQP(高级消息队列协议)实现了对于消息的排序，点对点通讯和发布订阅，保证可靠性和安全性。

## 安装

### 安装 erlang

```bash
apt install erlang

# 验证安装成功
erl
```

### 安装 MQ

默认端口:5672

可视化面板访问:http://localhost:15672/，默认 guest 登录

```bash
sudo apt install rabbitmq-server

systemctl start rabbitmq-server

ps -ef | grep rabbitmq

rabbitmq-plugins enable rabbitmq_management
```

## 基本用法

生产者

```js
import amqp from "amqplib";
import express from "express";

const connect = await amqp.connect("amqp://localhost:5672");
// 创建一个channel
const channel = await connect.createChannel();
// 创建一个队列名称
const queueName = "task_queue";

const app = express();

app.get("/send", (req, res) => {
  const message = req.query.message;
  channel.sendToQueue(queueName, Buffer.from(message), {
    persistent: true, // 消息持久化
  });
  res.send("Message sent to the queue");
});

app.listen(3000, () => {
  console.log(`Publisher is running on port 3000`);
});

// curl http://localhost:3000/send?message=Hello
```

消费者

```js
import amqp from "amqplib";

const connect = await amqp.connect("amqp://localhost:5672");
const channel = await connect.createChannel();
const queueName = "task_queue";

// 连接channel
await channel.assertQueue(queueName, {
  durable: true, // 队列和交换机持久化
});

// 消费消息
channel.consume(queueName, (message) => {
  console.log(`Received message: ${message.content.toString()}`);
  channel.ack(message); // 确认消息被消费
});
```

## 进阶用法

生产者

```js
import amqp from "amqplib";
import express from "express";

// 1. 连接到RabbitMQ
const connect = await amqp.connect("amqp://localhost:5672");
// 2. 创建一个channel
const channel = await connect.createChannel();
// 3. 创建一个交换机
/**
 * @param {string} exchangeName 交换机名称
 * @param {string} type 交换机类型 direct, topic, headers, fanout
 * @param {options} options 配置项
 */
// await channel.assertExchange("direct-1", "direct");
// await channel.assertExchange("topic-1", "topic");
await channel.assertExchange("headers-1", "headers");

// 4.发送消息
/**
 * @param {string} exchange 要发送到的交换机名称
 * @param {string} routingKey 路由键，匹配路由的key
 * @param {Buffer} content 消息内容
 * @param {options} options 配置项 消息持久化
 */
// channel.publish("direct-1", "key", Buffer.from("direct-message"), {
//   persistent: true, // 消息持久化
// });
// channel.publish("topic-1", "topic.message", Buffer.from("topic-message"), {
//   persistent: true, // 消息持久化
// });
channel.publish("headers-1", "", Buffer.from("headers-message"), {
  headers: {
    name: "admin",
    age: 18,
  },
});

// 5. 关闭连接
await channel.close();
await connect.close();
process.exit(0);
```

消费者 1

```js
import amqp from "amqplib";

// 1. 连接到RabbitMQ
const connect = await amqp.connect("amqp://localhost:5672");
// 2. 创建一个channel
const channel = await connect.createChannel();
// 3. 创建交换机
// await channel.assertExchange("direct-1", "direct");
// await channel.assertExchange("topic-1", "topic");
await channel.assertExchange("headers-1", "headers");
// 4. 创建队列
const { queue } = await channel.assertQueue("queue-1");
// 5. 绑定队列到交换机
/**
 * @param {string} queue 队列名称
 * @param {string} exchange 交换机名称
 * @param {string} routingKey 路由键
 */
// channel.bindQueue(queue, "direct-1", "key");
// channel.bindQueue(queue, "topic-1", "topic.*");
channel.bindQueue(queue, "headers-1", "", {
  name: "admin",
  age: 18,
});

// 6. 消费消息
channel.consume(
  queue,
  (message) => {
    console.log(`Received message: ${message.content.toString()}`);
  },
  {
    noAck: true,
  }
);
```

消费者 2

```js
import amqp from "amqplib";

// 1. 连接到RabbitMQ
const connect = await amqp.connect("amqp://localhost:5672");
// 2. 创建一个channel
const channel = await connect.createChannel();
// 3. 创建交换机
await channel.assertExchange("direct-1", "direct");
// 4. 创建队列
const { queue } = await channel.assertQueue("queue-2");
// 5. 绑定队列到交换机
/**
 * @param {string} queue 队列名称
 * @param {string} exchange 交换机名称
 * @param {string} routingKey 路由键
 */
channel.bindQueue(queue, "direct-1", "key");

// 6. 消费消息
channel.consume(
  queue,
  (message) => {
    console.log(`Received message: ${message.content.toString()}`);
  },
  {
    noAck: true,
  }
);
```

## 高级用法

### 延时消息

1. 下载 RabbitMQ Delayed Message Plugin

2. 启用插件

```bash
$ rabbitmq-plugins enable rabbitmq_delayed_message_exchange
```

#### 代码

生产者

```js
import amqp from "amqplib";

// 1. 连接到RabbitMQ
const connect = await amqp.connect("amqp://localhost:5672");
// 2. 创建一个channel
const channel = await connect.createChannel();
// 3. 创建一个交换机
await channel.assertExchange("delayed-1", "x-delayed-message", {
  arguments: {
    "x-delayed-type": "direct", // 交换机类型
  },
});

// 4.发送延时消息
channel.publish("delayed-1", "key", Buffer.from("delayed-message"), {
  headers: {
    "x-delay": 10000, // 延时10秒
  },
});

// 5. 关闭连接
await channel.close();
await connect.close();
process.exit(0);
```

消费者

```js
import amqp from "amqplib";

// 1. 连接到RabbitMQ
const connect = await amqp.connect("amqp://localhost:5672");
// 2. 创建一个channel
const channel = await connect.createChannel();
// 3. 创建交换机
await channel.assertExchange("delayed-1", "x-delayed-message", {
  arguments: {
    "x-delayed-type": "direct", // 交换机类型
  },
});
// 4. 创建队列
const { queue } = await channel.assertQueue("queue-1");
// 5. 绑定队列到交换机
channel.bindQueue(queue, "delayed-1", "key");

// 6. 消费消息
channel.consume(
  queue,
  (message) => {
    console.log(`Received message: ${message.content.toString()}`);
  },
  {
    noAck: true,
  }
);
```
