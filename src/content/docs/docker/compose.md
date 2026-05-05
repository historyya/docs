---
title: Docker Compose
description: Docker Compose
sidebar:
  order: 4
---

## Docker Compose

```bash
$ sudo docker compose version

$ mkdir mongodb-express

$ cd mongodb-express

$ vim docker-compose.yaml
services:
  web:
    image: mongo-express
    ports:
      - 8081:8081
    environment:
      - ME_CONFIG_MONGODB_SERVER: db
      - ME_CONFIG_MONGODB_ADMINUSERNAME: admin
      - ME_CONFIG_MONGODB_ADMINPASSWORD: password
    depends_on:
      - db

  db:
    image: mongo
    restart: always
    environment:
      - MONGO_INITDB_ROOT_USERNAME: admin
      - MONGO_INITDB_ROOT_PASSWORD: password
    volumes:
      - /home/data/db:/data/db

# 启动
$ sudo docker compose up -d

# 启动并指定文件名
$ sudo docker compose -f compose.yaml up -d

# 停止并删除容器
$ sudo docker compose down

$ sudo docker ps -a

# 停止容器
$ sudo docker compose stop

$ sudo docker compose start

# 更新镜像最新版本
$ docker compose up -d --pull always
```
