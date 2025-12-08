---
title: basic
description: basic
sidebar:
  order: 2
---

## 数据库

### 创建

```shell
# 查看所有数据库
show dbs

# 创建或选择数据库
use articledb

# 查看当前数据库名
db
```

### 删除

```shell
db.dropDatabase()
```

## 集合

like table

### 创建

```sql
db.createCollection("users")
```

### 查看

```sql
show collections
```

### 删除

```sql
db.users.drop()
```

## 文档

### 插入

```sql

```
