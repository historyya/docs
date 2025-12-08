---
title: install
description: install
sidebar:
  order: 1
---

## 安装

### Docker

```shell
docker run -e RABBITMQ_DEFAULT_USER=user -e RABBITMQ_DEFAULT_PASS=password --name rabbitmq --hostname my-rabbit -p 5672:5672 -p 15672:15672 -d rabbitmq:4-management
```
