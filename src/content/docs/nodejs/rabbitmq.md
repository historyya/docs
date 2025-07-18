---
title: RabbitMQ
description: RabbitMQ
sidebar:
  order: 50
---

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
