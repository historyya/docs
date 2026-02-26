---
title: Database Commands
description: Basic Commands
sidebar:
  order: 2
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
