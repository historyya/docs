---
title: Install
description: Install
sidebar:
  order: 1
---

## Docker 方式

```bash frame="none"
docker run -itd \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=mydb \
  -p 5432:5432 \
  -v /opt/postgres/data:/var/lib/postgresql/data \
  --name postgresql \
  postgres
```

### 查看容器状态

```bash frame="none"
docker ps | grep postgresql
```

### 配置远程连接

1. 进入容器

```bash frame="none"
docker exec -it postgresql bash
```

2. 修改配置

```bash frame="none"
echo "listen_addresses = '*'" >> /var/lib/postgresql/data/postgresql.conf
```

3. 重启容器

```bash frame="none"
docker restart postgresql
```

### 连接数据库

#### psql命令行连接

```bash frame="none"
psql -h localhost -U postgres -d postgres -p 5432
```

#### 容器连接

```bash frame="none"
docker exec -it postgresql psql -U postgres
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

```bash frame="none"
docker exec -it postgresql psql -U postgres

ALTER USER postgres WITH PASSWORD '新密码';
```
