---
title: Kafka
description: Kafka
sidebar:
  order: 51
---

## 安装

### 安装 JDK

必须配置 `JAVA_HOME` 环境变量

```bash
$ java --version
```

### 安装 ZooKeeper

```bash
$ bin/zkServer.sh start
```

### 安装 Kafka

```bash
$ bin/kafka-server-start.sh config/server.properties
```

## 基本用法

生产者

```js
import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092"],
});

// 创建生产者
const producer = kafka.producer();

const run = async () => {
  // 连接服务器
  await producer.connect();
  // 发送消息
  await producer.send({
    topic: "test-topic",
    messages: [
      { value: "Hello KafkaJS user!" },
      { value: Buffer.from("Hello KafkaJS") },
    ],
  });

  // 关闭生产者
  await producer.disconnect();
};

run().catch(console.error);
```

消费者

```js
import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092"],
});

// 创建消费者
const consumer = kafka.consumer({ groupId: "test-group" });

// 连接服务器
await consumer.connect();
// 订阅主题
// fromBeginning为true时，会从主题的最早消息开始
// fromBeginning为false时，会从最新的消息开始
await consumer.subscribe({ topic: "test-topic", fromBeginning: true });
// 消费消息
await consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    console.log({
      topic,
      partition,
      value: message.value.toString(),
    });
  },
});
```

## 进阶用法

生产者

```js
import { Kafka, CompressionTypes } from "kafkajs";

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092"],
});

// 创建生产者
const producer = kafka.producer();

// 连接服务器
await producer.connect();
// 发送消息
await producer.sendBatch({
  topicMessages: [
    {
      topic: "aaa-topic",
      messages: [{ value: "Hello AAA" }],
    },
    {
      topic: "bbb-topic",
      messages: [{ value: "Hello BBB" }],
    },
  ],
});

// 关闭生产者
await producer.disconnect();
process.exit(0);
```

消费者

```js
import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092"],
});

// 创建消费者
const consumer = kafka.consumer({ groupId: "test-group" });

// 连接服务器
await consumer.connect();
// 订阅主题
await consumer.subscribe({ topic: "aaa-topic", fromBeginning: true });
await consumer.subscribe({ topic: "bbb-topic", fromBeginning: true });

// 批量消费消息
await consumer.run({
  eachBatch: async ({ batch }) => {
    console.log(batch);
    batch.messages.forEach(async (message) => {
      console.log({
        value: message.value.toString(),
      });
    });
  },
});
```

## 高级用法

### 集群

```js
import { Kafka, CompressionTypes } from "kafkajs";

const kafka = new Kafka({
  clientId: "kafka-node",
  brokers: ["localhost:9092", "localhost:9093"],
});

// 创建一个客户端
const client = await kafka.admin();
awaitclient.connect();

// 查看集群信息
const clusterInfo = await client.describeCluster();
console.log(clusterInfo);

// 管理主题

// 查看主题
const topicsList = await client.listTopics();
console.log(topicsList);
// 删除主题
await client.deleteTopics({ topics: ["aaa-topic", "bbb-topic"] });
// 新增主题
await client.createTopics({
  topics: [
    {
      topic: "aaa-topic",
      numPartitions: 1,
      replicationFactor: 1,
    },
  ],
});
```

### 事务

```js
import { Kafka, CompressionTypes } from "kafkajs";

const kafka = new Kafka({
  clientId: "kafka-node",
  brokers: ["localhost:9092", "localhost:9093"],
});

const producer = kafka.producer({
  transactionalId: "my-transactional-id", // 事务id
});

// 创建事务
const transaction = await producer.transaction();
try {
  await transaction.send({
    topic: "aaa-topic",
    messages: [{ value: "A-100" }],
  });
  await transaction.send({
    topic: "bbb-topic",
    messages: [{ value: "B+100" }],
  });
  await transaction.commit();
} catch (error) {
  // 回滚
  await transaction.abort();
  throw error;
}
```
