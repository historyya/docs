---
title: 常用命令
description: 常用命令
sidebar:
  order: 1
---

## 常用命令

```bash
# 从仓库下载镜像
$ sudo docker pull postgres:13-alpine

# 下载指定CPU架构的镜像
$ sudo docker pull --platform=linux/arm64 nginx

# 列出下载过的镜像
$ sudo docker images

# 删除镜像
$ sudo docker rmi 1e5f3c5b

# 下载镜像并运行容器
$ sudo docker run nginx

# 启动并后台运行容器
# 宿主机端口80:容器内端口80
# 宿主机目录:容器内目录(绑定挂载)
# 容器停止时总是重启/unless-stopped手动停止的容器不会尝试重启
# 自定义容器名
$ sudo docker run -p 80:80 -v /website/html:/html -d --restart always --name my_nginx nginx
# 使用已创建的挂载卷
$ sudo docker run -p 80:80 -v nginx_html:/html -d nginx
# 传入环境变量
$ sudo docker run -d \
-p 27017:27017 \
-e MONGO_INITDB_ROOT_USERNAME=admin \
-e MONGO_INITDB_ROOT_PASSWORD=password \
mongo
# 打开容器的控制台
# 当容器停止时删除容器
$ sudo docker run -it --rm alpine

# 只创建容器，启动用start
$ sudo docker create -p 27017:27017 mongo

# 查看正在运行的容器
$ sudo docker ps

# 查看容器列表，包括正在运行和已经停止的
$ sudo docker ps -a

# 查看容器详细信息
$ sudo docker inspect 1e5f3c5b

# 进入容器内部
$ sudo docker exec -it 1e5f3c5b /bin/sh
# 在容器内部执行Linux命令
$ sudo docker exec 1e5f3c5b ps -ef

# 重启被停止的容器
$ sudo docker start 1e5f3c5b

# 查看容器日志
$ sudo docker logs 1e5f3c5b
# 查看容器实时日志
$ sudo docker logs 1e5f3c5b -f

# 停止正在运行的容器
$ sudo docker stop 1e5f3c5b

# 删除正在运行的容器
$ sudo docker rm -f 1e5f3c5b

# 创建挂载卷
$ sudo docker volume create nginx_html

# 查看宿主机下挂载卷的路径
$ sudo docker volume inspect nginx_html

# 查看挂载卷列表
$ sudo docker volume list

# 删除挂载卷
$ sudo docker volume rm nginx_html

# 删除容器未在使用的挂载卷
$ sudo docker volume prune -a
```

### 配置镜像

```bash
$ sudo vim /etc/docker/daemon.json
{
    "registry-mirrors": [
        "https://docker.m.daocloud.io",
        "https://docker.1panel.live",
        "https://hub.rat.dev"
    ]
}

$ sudo service docker restart
```
