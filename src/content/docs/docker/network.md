---
title: Network
description: Network
sidebar:
  order: 2
---

## Networking

默认是 Bridge 桥接模式

```bash
# 查看网络列表
$ sudo docker network list

# 删除自定义的子网
$ sudo docker network rm b286e035
```

### Bridge

```bash
# 创建子网
# 同一子网下的容器之间可以相互访问
$ sudo docker network create my-net

$ sudo docker run -d \
--name=my_mongodb
-p 27017:27017 \
-e MONGO_INITDB_ROOT_USERNAME=admin \
-e MONGO_INITDB_ROOT_PASSWORD=password \
--network=my-net
mongo

$ sudo docker run -d \
--name my-mongo-express \
-p 8081:8081 \
-e ME_CONFIG_MONGODB_SERVER="my_mongodb" \
-e ME_CONFIG_MONGODB_ADMINUSERNAME="admin" \
-e ME_CONFIG_MONGODB_ADMINPASSWORD="password" \
--network my-net \
mongo-express

$ sudo docker exec -it my-mongo-express /bin/sh
ping my_mongodb
```

### Host

Host 模式下 Docker 共享宿主机的网络空间

```bash
$ sudo docker run -d --network host nginx

# 进入容器，查看IP
$ sudo docker exec -it my-nginx /bin/sh
apt update

apt install iproute2

ip addr show
```

### None

容器与宿主机间不联网
