---
title: 数据类型
description: 数据类型
sidebar:
  order: 2
---

# 官方文档

[官方文档](https://redis.io/docs/latest/develop/data-types/)

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

## List 列表

- 是一个双端链表的结构

### 操作

```bash
# 从左插入，输出 5 4 3 2 1
lpush list1 1 2 3 4 5

type list1

# 获取列表所有元素
lrange list1 0 -1

# 从右插入，输出 100 200 300 400 500
rpush list2 100 200 300 400 500
```

### 删除

```bash
# 删除并返回列表的第一个元素，输出 5
lpop list1

# 删除并返回列表的最后一个元素，输出 1
rpop list1
```

### 通过索引下标获取元素

```bash
# 获取列表索引为0的元素，输出 4
lindex list1 0
```

### 获取列表中元素个数

```bash
# 获取列表list1的元素个数，输出 3
llen list1
```

### 删除值相同的元素

```yaml
lpush list1 1 1 2 2 3 3 4 4 5 5 6 1

# 删除列表中2个值为1的元素
lrem list1 2 1
```

### 截取

```yaml
lpush list1 0 1 2 3 4 5 6 7 8 9

ltrim list1 1 3

# 输出： 8 7 6
lrange list1 0 -1
```

### 源列表

移除列表的最后一个元素，并将该元素添加到另一个列表并返回

```yaml
lpush list1 0 1 2

rpush list2 99 98

# 输出： 0
rpoplpush list1 list2

# 输出：0 99 98
lrange list2 0 -1
```

### 修改

```bash
lpush list1 0 1 2

lset list1 1 0

# 输出： 2 0 0
lrange list1 0 -1
```

### 已有值插入新的值

```yaml
lpush list1 1 3 5

# 在3前面插入4
linsert list1 before 3 4

# 输出： 5 4 3 1
lrange list1 0 -1
```

### 应用场景

1. 微信公众号订阅消息：查看最新订阅号信息：`lrange list:subscribers 0 9`，订阅号推送：`lpush list:subscribers 11 22`

## Hash 哈希表

- KV模式不变，但V是一个键值对。 `Map<String, Map<Object, Object>>`

### 常用操作

```bash
hset user:001 id 001 name zhangsan age 25

hget user:001 id

hget user:001 name

hmset u:2 id 2 name wangwu

hmget u:2 id name

hgetall user:001

hdel user:001 age

# 获取某个key的全部数量
hlen user:001

# 检查某个字段是否存在
hexists user:001 age

# 获取所有字段名
hkeys user:001

# 获取所有字段值
hvals user:001

# 增加/减少某个字段的整数值
hincrby post:10 view 1

# 增加/减少某个字段的浮点数值
hincrbyfloat student:10 score 0.5

# 若字段不存在，则设置字段为指定值，若存在了则无效
hsetnx user:001 hight 1.80
```

### 应用场景

1. 购物车（不推荐）
    - 新增商品：`hset shopcart:uid1001 pid9918 1`
    - 再新增商品：`hset shopcart:uid1001 pid9919 1`
    - 增加商品数量：`hincrby shopcart:uid1001 pid9918 1`
    - 减少商品数量：`hincrby shopcart:uid1001 pid9918 1 -1`
    - 获取商品总数：`hlen shopcart:uid1001`
    - 全部选择商品：`hgetall shopcart:uid1001`

## Set 集合

- 成员唯一，无序
- 添加、删除、查找的时间复杂度都是O(1)

### 常用操作

```bash
# 添加元素
sadd set1 1 1 1 2 2 3 3 4 5 5

# 遍历集合中的所有元素
smembers set1

# 判断元素是否在集合中
sismember set1 3

# 删除元素
srem set1 4

# 获取集合中的元素个数
scard set1

# 从集合中随机展示2个元素，元素不会被删除
srandmember set1 2

# 从集合中随机删除1个元素，元素会被删除
spop set1 1

# 将set1中的元素1移动到set2中
smove set1 set2 1
```

### 集合运算

```bash
sadd set1 a b c 1 2

sadd set2 1 2 3 a x

-- 查看属于set1，但不属于set2的元素集合
sdiff set1 set2

-- 属于set1或set2 合并后的集合
sunion set1 set2

-- 属于set1 set2 共同拥有的元素集合
sinter set1 set2

-- 返回给定集合的交集产生的集合的基数
-- 不返回结果集，只返回结果的基数
sintercard 2 set1 set2
```

### 应用场景

1. 微信抽奖小程序
   - 用户参与抽奖：`sadd suprise uid101`
   - 显示有多少人参与抽奖：`scard suprise`
   - 抽奖(随机抽2个人，元素不删除)：`srandmember suprise 2`
   - 抽奖(随机抽1个人，元素会被删除)：`spop suprise 1`
2. 微信朋友圈点赞查看共同点赞好友
   - 用户点赞：`sadd like:article1001 uid101 uid102 uid103`
   - 取消点赞：`srem like:article1001 uid102`
   - 显示共同点赞好友：`smembers like:article1001`
   - 点赞用户数统计：`scard like:article1001`
   - 判断某个朋友是否点赞了这篇文章：`sismember like:article1001 uid102`
3. 可能认识的人/猜你喜欢：`sdiff friends:uid1001 friends:uid1002`

## Sorted set 有序集合

- 在set基础上，每一个value值前加一个score分数值

### 常用操作

```text
-- 向有序集合中加入一个元素和该元素的分数
zadd zset1 100 value1 150 value2 200 value3

-- 返回索引从0到-1之间的全部元素
zrange zset1 0 -1

-- 按照元素分数从小到大排序
zrange zset1 0 -1 withscores

-- 按照元素分数从大到小排序
zrevrange zset1 0 -1 withscores

-- 获取指定分数范围的元素
zrangebyscore zset1 150 200 withscores

-- 获取指定分数范围的元素，不包含150 200
zrangebyscore zset1 (150 200 withscores

-- 获取指定分数范围的元素，不包含150 200，分页显示
zrangebyscore zset1 (150 200 withscores limit  0 1

-- 获取元素的分数
zscore zset1 value1

-- 获取集合中元素的数量
zcard zset1

-- 删除元素
zrem zset1 value3

-- 增加某个元素的分数
zincrby zset1 1 value1

-- 统计指定分数范围内的元素个数
zcount zset1 100 200

-- 弹出最小的一个元素
zmpop 1 zset1 min count 1

-- 正序获取下标值
zrank zset1 value1

-- 逆序获取下标值
zrevrank zset1 value3
```

### 应用场景

1. 根据商品销量对商品进行排序显示
   - 商品销量：`zadd goods:sellsort 100 product1001`
   - 销量增加：`zincrby goods:sellsort 5 product1001`
   - 商品排序显示：`zrevrange goods:sellsort 0 9 withscores`

## Bitmap 位图

- 由0和1状态表现的二进制位的bit数组
- 用于状态统计

### 常用操作

```text
-- 给下标为0赋值value
setbit b1 0 1

setbit b1 1 1

setbit b1 2 0

-- 获取下标为2的value值
getbit b1 2

-- 统计当前key占用的字节数。超过8个字节自动扩容新的
strlen b1

-- 统计当前key的value为1的总数
bitcount b1

-- 统计20251010和20251011两天都签到的人
bitop and b2 20251010 20251011

bitcount b2
```

### 应用场景

1. 用户是否签到，钉钉打卡
2. 某电影是否被点击播放过

#### 每日签到

```text
-- 202501 u1 用户第0天签到
setbit sign:u1:202501 0 1

-- 202501 u1 用户第1天签到
setbit sign:u1:202501 1 1

-- 202501 u1 用户第2天未签到
setbit sign:u1:202501 2 0

-- 查看u1用户第2天是否签到
getbit sign:u1:202501 2

-- 统计u1用户202501 第0到30天的签到天数
bitcount sign:u1:202501 0 30
```

#### 统计一年共签到的天数

```text
setbit sign:u1 0 1

setbit sign:u1 364 0

bitcount sign:u1

strlen sign:u1
```

## HyperLogLog 基数估计

- 去重复统计功能的基数估计算法。
- 不会存储输入元素本身
- 基数：统计一个集合中不重复的元素个数

### 常用操作

```text
pfadd h1 1 2 3 4 5

pfadd h2 1 2 2 2 5 6

pfcount h2

pfmerge hresult h1 h2

pfcount hresult
```

### 应用场景

1. 统计某个网站的UV，统计某篇文章的UV(独立访客)
2. 用户搜索网站关键词的数量
3. 统计用户每天搜索不同词条的个数

## Geospatial 地理空间索引

- 主要用于存储地理位置信息，例如添加用户的位置信息，或者查询用户附近的其他用户等

### 常用操作

```text
-- 添加经纬度坐标
geoadd city 116.41 39.90 "北京" 121.47 31.23 "上海" 114.05 22.55 "深圳"

type city
-- zset

-- 返回经纬度
geopos city 北京 上海

-- 返回坐标的hash值
geohash city 北京 上海

-- 返回两个位置之间的距离，默认米
geodist city 北京 上海 km

-- 返回以苏州为中心，指定半径范围内的所有位置
georadius city 120.59 31.30 100 km withdist withhash count 10 desc

-- 返回以上海为中心，指定半径范围内的所有位置
georadiusbymember city 上海 100 km withdist withhash count 10 desc
```

## Stream 流

- 消息中间件+阻塞队列

### 常用命令

#### 队列相关命令

```text
-- 添加消息到队列末尾
-- *：让系统自动生成id
xadd s1 * id 10 message hello

xadd s1 * k1 v1 k2 v2

type s1
-- stream

-- 获取消息列表
xrange s1 - + count 1

-- 获取消息列表，倒序
xrevrange s1 + -

-- 删除消息
xdel s1 1762587010829-0

-- 获取队列长度
xlen s1

-- 对stream进行截取
-- maxlen：允许最大长度
xtrim s1 maxlen 2

-- minid：删除小于指定id的消息
xtrim s1 minid 1762587010829-0

-- 获取消息，返回大于指定id的消息
-- $: 表示最新的id，比当前最大的id还要大一个
xread count 2 streams s1 $

-- 0-0: 表示从最开始的位置获取消息
xread count 2 streams 00
```

#### 消费组相关命令

```text
-- 创建消费者组
-- $：表示从stream尾部开始消费
-- 0：表示从stream头部开始消费
xgroup create stream1 group1 $

xgroup create stream1 group2 0

-- 不同消费组的消费者可以消费同一条消息
xreadgroup group group1 consumer1 streams stream1 >

xreadgroup group group2 consumer2 count 1 streams stream1 >

-- 查看每个消费者组内所有消费者(已读取但未确认)的消息
-- 查看某个消费者具体读取了哪些数据
xpending stream1 group1 - + 10 consumer1

-- 向消息队列确认1607518709271-0消息处理已完成
xack stream1 group1 1607518709271-0

-- 查看stream1消息队列的详细信息
xinfo stream stream1
```

## Bitfield 位域

- 将一个redis字符串看作是一个由二进制组成的数组，并能对变长位宽和任意没有字节对齐的指定整形位域进行寻址和修改

### 常用操作

```text
set fieldkey hello

get fieldkey

-- 获取0号位h的二进制表示
bitfield fieldkey get i8 0

bitfield fieldkey set i8 8 120

bitfield fieldkey incrby u4 2 1
```

## JSON 文档存储
