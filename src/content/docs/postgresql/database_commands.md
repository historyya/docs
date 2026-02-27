---
title: Database Commands
description: Basic Commands
sidebar:
  order: 3
---

## 创建数据库

```sql
-- 创建数据库
CREATE DATABASE oa_db;

-- 给数据库添加注释
COMMENT ON DATABASE oa_db IS '业务数据库';
```

## 查看数据库

| 命令       | 说明           | 示例                             |
| :--------- | :------------- | :------------------------------- |
| \l         | 列出所有数据库 | \l                               |
| \l+        | 查看详细信息   | \l+                              |
| SELECT语句 | 查询系统表     | SELECT datname FROM pg_database; |

## 切换数据库

```sql
-- 切换到oa_db
\c oa_db

-- 查看当前连接信息
\conninfo
```

## 删除数据库

```sql
-- 删除数据库（需要先断开数据库连接）
DROP DATABASE oa_db;

-- 强制删除（如果有连接）
DROP DATABASE oa_db WITH (FORCE);
```

## 修改数据库

```sql
-- 重命名数据库
ALTER DATABASE oldname RENAME TO newname;
```

## Schema核心操作

### 创建Schema

```sql
-- 创建普通Schema
CREATE SCHEMA my_schema;
COMMENT ON SCHEMA my_schema IS '业务模块A的数据空间';

-- 创建指定所有者的Schema
CREATE SCHEMA sales_schema AUTHORIZATION sales_user;

-- 创建Schema并设置权限
CREATE SCHEMA finance_schema;
GRANT USAGE ON SCHEMA finance_schema TO finance_user;
```

### 查看Schema信息

```bash frame="none"
-- 查看所有Schema
\dn
\dn+  -- 查看详细信息

-- 查看特定Schema下的对象
\dt my_schema.*    -- 查看所有表
\dv my_schema.*    -- 查看所有视图
\df my_schema.*    -- 查看所有函数

-- 通过SQL查询
SELECT schema_name, schema_owner 
FROM information_schema.schemata 
ORDER BY schema_name;
```

### 使用Schema

```sql
-- 切换默认Schema（会话级别）
SET search_path TO my_schema, public;

-- 在当前搜索路径创建表（自动使用第一个Schema）
CREATE TABLE users (id SERIAL, name TEXT);

-- 指定Schema创建表（推荐显式指定）
CREATE TABLE my_schema.products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    price NUMERIC(10,2)
);

-- 指定Schema查询数据
SELECT * FROM my_schema.products;
SELECT * FROM public.users;  -- 显式指定public schema
```

### 修改Schema

```sql
-- 重命名Schema
ALTER SCHEMA my_schema RENAME TO new_schema;

-- 修改所有者
ALTER SCHEMA my_schema OWNER TO new_owner;

-- 修改注释
COMMENT ON SCHEMA my_schema IS '新的说明信息';
```

### 删除Schema

```sql
-- 删除空Schema
DROP SCHEMA IF EXISTS my_schema;

-- 删除Schema及其所有对象（谨慎使用！）
DROP SCHEMA my_schema CASCADE;
```

## 数据库备份

### 基础备份操作

#### 单数据库备份

```bash frame="none"
# 基本备份（默认格式，二进制）
pg_dump mydb > /tmp/mydb.dump

# 备份为SQL文件（可读、可编辑）
pg_dump mydb --format=plain --file=/tmp/mydb.sql

# 压缩备份（节省空间）
pg_dump mydb | gzip > /tmp/mydb.sql.gz

# 带加密的备份
pg_dump mydb | gpg -c > /tmp/mydb.sql.gpg
```

#### 连接参数详解

```bash frame="none"
# 完整连接参数
pg_dump \
  --host=localhost \
  --port=5432 \
  --username=postgres \
  --dbname=mydb \
  --file=/tmp/mydb.sql

# 使用连接字符串
pg_dump "postgresql://postgres:password@localhost:5432/mydb" > backup.sql

# 使用密码文件（避免密码暴露）
echo "localhost:5432:mydb:postgres:password" > ~/.pgpass
chmod 600 ~/.pgpass
pg_dump mydb > backup.sql
```

#### 备份选项优化

```bash frame="none"
# 常用选项组合
pg_dump mydb \
  --verbose \           # 显示详细过程
  --clean \            # 包含DROP语句
  --create \           # 包含CREATE DATABASE
  --if-exists \        # 与--clean一起使用，添加IF EXISTS
  --no-owner \         # 不设置对象所有者
  --no-privileges \    # 不备份权限
  --encoding=UTF8 \    # 指定编码
  --jobs=4 \           # 并行备份（目录格式）
  > backup.sql
```

### 完整集群备份

#### 备份所有数据库

```bash frame="none"
# 备份整个PostgreSQL集群
pg_dumpall \
  --host=localhost \
  --username=postgres \
  --file=/tmp/pg_backup.sql

# 备份并压缩
pg_dumpall | gzip > /tmp/pg_backup_$(date +%Y%m%d).sql.gz
```

## 数据库恢复操作

### 从SQL文件恢复

```bash frame="none"
# 创建新数据库并恢复
createdb newdb
psql newdb < /tmp/mydb.sql

# 直接恢复（SQL文件包含CREATE DATABASE）
psql --file=/tmp/mydb.sql postgres

# 恢复时显示进度
psql --echo-all --file=/tmp/mydb.sql newdb

# 恢复压缩的备份
gunzip -c /tmp/mydb.sql.gz | psql newdb
```

### 从二进制备份恢复

```bash frame="none"
# 恢复自定义格式备份
pg_restore \
  --dbname=newdb \
  --verbose \
  /tmp/mydb.dump

# 只恢复表结构（无数据）
pg_restore \
  --dbname=newdb \
  --schema-only \
  /tmp/mydb.dump

# 只恢复数据
pg_restore \
  --dbname=newdb \
  --data-only \
  /tmp/mydb.dump

# 恢复特定表
pg_restore \
  --dbname=newdb \
  --table=users \
  --table=orders \
  /tmp/mydb.dump
```

### 恢复整个集群

```bash frame="none"
# 先删除现有数据库（谨慎操作！）
dropdb --if-exists mydb
dropdb --if-exists otherdb

# 恢复所有数据库
psql --file=/tmp/pg_backup.sql postgres

# 并行恢复（提高速度）
pg_restore \
  --jobs=4 \
  --dbname=postgres \
  /tmp/pg_backup.dump
```
