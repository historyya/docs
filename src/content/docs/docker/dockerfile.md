---
title: Dockerfile
description: Dockerfile
sidebar:
  order: 3
---

## Dockerfile

```bash
# 设置目录
# 复制当前目录下的文件到/app目录下
$ vim Dockerfile
FROM node:slim

WORKDIR /app

COPY . .

RUN pnpm install

EXPOSE 3000

CMD ["pm2","index.ts"]

# 在当前目录下构建构建镜像
$ sudo docker build -t express_app .

# 启动容器
$ sudo docker run -d -p 3000:3000 express_app
```

## Docker Hub

```bash
$ sudo docker login

$ sudo docker build -t username/express_app .

$ sudo docker push username/express_app
```
