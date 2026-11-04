---
title: Install
description: Install
sidebar:
  order: 1
---

## Docker 启动

```bash
docker run -itd \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=mydb \
  -e TZ=Asia/Shanghai \
  -p 5432:5432 \
  -v /opt/postgres/data:/var/lib/postgresql/18/data \
  --name postgres \
  postgres
```

### 查看容器状态

```bash
# 查看容器是否启动成功，端口信息
docker ps | grep postgres

# 查看容器具体进程
docker top postgres
```

### 配置远程连接

1. 进入容器

```bash
docker exec -it postgres bash
# 或
docker exec -it postgres /bin/bash
```

2. 修改配置

```bash
echo "listen_addresses = '*'" >> /var/lib/postgresql/18/data/postgresql.conf
```

3. 重启容器

```bash
docker restart postgres
```

### 连接数据库

#### psql命令行连接

```bash
psql -h localhost -U postgres -d postgres -p 5432
```

#### 容器连接

```bash
docker exec -it postgres psql -U postgres
```

执行sql测试

```sql
-- 查看版本
SELECT version();

-- 查看所有数据库
\l

-- 退出psql
\q
```

### 忘记密码

```bash
docker exec -it postgres psql -U postgres

ALTER USER postgres WITH PASSWORD '新密码';
```
