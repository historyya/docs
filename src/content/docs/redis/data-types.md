---
title: 数据类型
description: 数据类型
sidebar:
  order: 2
---

## String 字符串

- string支持序列化
- value最大512MB
- 单值单value

```bash
# 设置key
set name '张三'

# 获取value
get name
"张三"

# NX：key不存在时才会设置成功，若key存在则不设置
set name '张三' NX

# XX：key存在时才会设置成功，若key不存在则不设置
set name '张三' XX

# GET：返回指定key的原本value，再设置新value，若key不存在返回nil
set name '李四' get

# EX:设置过期时间/秒
set token 'xxx' EX 60

# PX：设置过期时间/毫秒
set token 'yyy' PX 6000

# EXAT：设置过期时间/秒级时间戳(unix时间戳)
set user 'admin' EXAT 1762177700999

# PXAT：设置过期时间/毫秒级时间戳(unix时间戳)
set user 'guest' PXAT 1762177700999

# 设置k1 30s后过期
set k1 v1 ex 30

# KEEPTTL：修改k1的值，并保留k1的过期时间
set k1 v11 KEEPTTL

# 查看过期时间
ttl token

# 删除key
del name
```

### 同时设置/获取多个键值

```bash
# 同时设置多个键值对
mset k1 value1 k2 value2 k3 value3

# 同时获取多个键值对
mget k1 k2 k3
# 返回值：
# value1
# value2
# value3

# MSETNX：同时设置多个键值对，若其中有一个key存在，则所有设置都不生效
msetnx k1 value1 k10 value10
```

### 获取指定区间范围内的值

```bash
set k1 abcd123456

# 获取索引0到-1之间的字符
getrange k1 0 -1

# 从索引4开始替换为efgh
setrange k1 4 efgh
# 返回值：
# abcdefgh56
```

### 数值增减

```bash
set n1 0

# 每次增加1
incr n1

# 每次增加10
incrby n1 10

# 每次减少1
decr n1

# 每次减少5
decrby n1 5
```

### 获取字符串长度和内容追加

```bash
set s1 hello

strlen s1

append s1 world
```

### 分布式锁

```bash
set k1 v1

expire k1 10

ttl k1

# 设置k1为v1，并且10s后过期
setex k1 10 v1

# 若k1不存在，则设置k1为v2
setnx k1 v2
```

### getset

```bash
# 获取k1的原始值，并将value设置为hello，若k1不存在则返回nil
getset k1 hello
```

### 应用场景

1. 抖音视频点赞 `incr video1:1`
2. 阅读量 `incr article1:read`

## Hash 哈希表

```bash
# 设置
hset person name '张三'
hset person age 18

# 获取
hget person name

hgetall person

# 移除
hdel person age
```

## List 列表

## Set 集合

- 成员唯一，无序
- 添加、删除、查找的时间复杂度都是O(1)

```bash
# 添加
sadd set1 1 1 1 2 2 3

# 获取
smembers set1

# 检查
sismember set1 3

# 移除
srem set1 2
```

## Sorted set 有序集合

- 有序集合，每个元素都会关联一个double类型的分数，根据分数从低到高排序

## Stream 流

## Bitmap 位图

- 位图，每个位可以存储0或1。例如每日签到，钉钉打卡等

## Bitfield 位操作

## Geospatial 地理空间索引

- 主要用于存储地理位置信息，例如添加用户的位置信息，或者查询用户附近的其他用户等

## JSON 文档存储

## HyperLogLog 基数估计

- 用于做基数统计的算法。例如统计网站的唯一访问量等




[官方文档](https://redis.io/docs/latest/develop/data-types/)