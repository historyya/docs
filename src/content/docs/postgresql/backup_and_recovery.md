---
title: Backup and Recovery
description: Backup and Recovery
sidebar:
    order: 5
---

## 备份

### 逻辑备份

```sql
-- 备份单个数据库，会生成blog.dump
pg_dump \
-h localhost \
-U postgres \
-d blog \
-F c \
-f blog.dump

-- 查看备份内容
pg_restore -l blog.dump
```

```sql
-- 备份整个数据库
pg_dumpall \
-U postgres \
> all.sql

-- 恢复
psql \
-U postgres \
-f all.sql
```

### Docker 环境备份

```bash
-- 备份
docker exec postgres \
pg_dump \
-U postgres \
-d blog \
-F c \
> blog.dump

-- 恢复
-- 复制到容器内
docker cp blog.dump postgres:/tmp/
-- 执行
docker exec -it postgres \
pg_restore \
-U postgres \
-d blog \
/tmp/blog.dump
```

#### Docker 数据卷备份

```bash
-- 备份数据卷
tar czf postgres_data.tar.gz db_data

-- 恢复数据卷，生产环境不推荐
tar xzf postgres_data.tar.gz
```

## 恢复

### 恢复到新数据库

```sql
-- 创建数据库
CREATE DATABASE blog_new;
```

恢复

```bash
pg_restore \
-U postgres \
-d blog_new \
blog.dump
```

### 覆盖恢复

```sql
-- 先删除
DROP DATABASE blog;

-- 重新创建
CREATE DATABASE blog;
```

恢复

```bash
pg_restore \
-U postgres \
-d blog \
blog.dump

-- 清理旧对象
pg_restore \
--clean \
-d blog \
blog.dump

-- 只恢复数据
pg_restore \
--data-only \
-d blog \
blog.dump

-- 只恢复结构
pg_restore \
--schema-only \
-d blog \
blog.dump

-- 多线程恢复
pg_restore \
-j 8 \
-d blog \
blog.dump
```
