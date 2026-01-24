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

- 如果post集合不存在，则会隐式创建

```sql
db.post.insert({"title":"Next.js 16","content":"This release provides the latest improvements to Turbopack, caching, and the Next.js architecture. Since the previous beta release, we added several new features and improvements"})
              
-- 批量插入
db.post.insertMany([
{"title":"title one","content":"content one"},
{"title":"title two","content":"content two"},
])
```

### 查询

```sql
db.post.find()

-- 单条查询
db.post.findOne({title: 'title one'})

-- 查询返回指定字段
db.post.find({title: 'title one'},{title:1,content:1,_id:0})
```

### 更新

```sql
-- 更新id为1的title的值
db.post.update({_id:"1"},{$set:{title:'title one update'}})

-- 修改所有符合条件的数据
db.post.update({_id:"1"},{$set:{title:'title one update'}},{multi:true})
```

### 删除

```sql
db.post.remove({_id: '1'})

-- 删除全部
db.post.remove({})
```
