---
title: 安装
description: 安装
sidebar:
  order: 1
---

## 什么是 Redis

Redis 是一款开源的、高性能的 key-value的**非关系型数据库**。也是内存数据库。

### 特点

- 支持持久化，可以把内存中的数据持久化到磁盘，重启后可以再次从磁盘中加载到内存中继续使用
- 支持多种数据结构
- 支持数据的备份：主从模式的备份，支持集群
- 高性能，读速度达11万次/秒，写速度达8万次/秒
- 支持事务，支持多线程

## 安装

### 源码编译

#### Debian 12

```yaml
# 检查gcc版本
$ gcc -v

$ sudo apt install -y gcc g++

$ cd /usr/src

$ wget -O redis-8.2.2.tar.gz https://github.com/redis/redis/archive/refs/tags/8.2.2.tar.gz

$ tar xvf redis-8.2.2.tar.gz

$ rm redis-8.2.2.tar.gz

$ cd /usr/src/redis-8.2.2

$ sudo make

$ sudo make install # 安装到默认目录 /usr/local/bin

$ cd /usr/local/bin

$ redis-server -v

$ redis-server /myredis/redis.conf

  # 查看redis进程
$ ps -ef | grep redis

  # 查看redis服务是否在运行
$ lsof -i:6379

  # 强制关闭redis服务
$ kill -9 <redis进程号>

  # 性能测试：测试100个并发连接数，100000个请求数
$ redis-benchmark -h 127.0.0.1 -p 6379 -a password123 -c 100 -n 100000

$ redis-cli
ping

auth password123

config get requirepass  #获取redis密码

config set requirepass "123456"  #设置redis密码

config get port  # 获取redis端口号

config get dir  # 获取redis数据目录
```

#### CentOS 7

```yaml
$ cd /opt

  $ wget https://download.redis.io/redis-stable.tar.gz

  $ tar xzf redis-stable.tar.gz

  $ cd redis-stable

  $ yum install gcc-c++

  $ make

  $ make install

  $ cd /usr/local/bin

  $ ls
  redis-cli        redis-server

  $ mkdir redis-config

  $ cp /opt/redis-stable/redis.conf redis-config/

  $ cd redis-config

  $ vim redis.conf
  # 修改以下配置内容
  #bind 127.0.0.1  #IP访问限制。注释掉，或者修改为0.0.0.0允许所有IP访问
  protected-mode no  #保护模式。修改成no
  daemonize yes  #以守护进程方式运行。修改成yes
  requirepass password123 # 设置密码

  # 启动redis
  $ redis-server /usr/local/bin/redis-config/redis.conf

  $ ps -ef | grep redis | grep -v grep

  $ redis-cli -h 127.0.0.1 -p 6379 -a
  ping #测试
  PONG
  set name '张三'
  get name
  "张三"
  keys *  #查看数据库中所有的key
  flushdb #清空当前数据库
  flushall #清空所有数据库
  quit # 退出，或exit
  SHUTDOWN # 关闭redis服务

  # 处理登录redis提示waring错误
  $ redis-cli -a password123 -p 6379 2>/dev/null # 忽略警告信息

  # 关闭redis服务
  $ redis-cli -a password123 -p 6379 shutdown
```

### 卸载

```yaml
# 停止redis服务
$ redis-cli -a password123 -p 6379 shutdown

  # 删除目录
$ rm -rf /usr/local/bin/redis-*
```

## 基本使用

### 常用命令

```bash
keys *  #查看当前库中所有的key

exists name  #检查key为name是否存在

type name  #查看key为name的数据类型

del name  #删除key为name的数据

unlink name  #非阻塞删除，仅仅将name从keyspace元数据中删除，真正的删除会在后续异步中操作

ttl name  #查看key为name的过期时间，-1表示永不过期，-2表示已过期

expire name 60  #设置key为name的过期时间为60秒

move name 1  #将key为name的数据移动到数据库1中

select 1  #切换到数据库1

dbsize  #查看当前数据库中key的数量

flushdb  #清空当前数据库

flushall  #清空所有数据库

shutdown  #关闭redis服务
```

### 常见问题

1. 解决中文显示乱码

```bash
redis-cli --raw
```

## Question

### Redis是单线程为什么这么快

Redis是基于内存操作，CPU不是Redis的性能瓶颈，Redis的性能瓶颈是机器的内存和网络带宽。

核心：Redis是将所有的数据全部放在内存中的，所有说使用单线程去操作执行效率就是最高的，多线程在执行过程中需要进行 CPU 的上下文切换，这个是耗时操作。

对于内存系统来说，如果没有上下文切换效率就是最高的，多次读写都是在一个 CPU 上的，在内存情况下，这个就是最佳方案。

Redis 采用网络IO多路复用技术来保证在多连接的时候， 系统的高吞吐量。

Redis使用跳表，链表，动态字符串，压缩列表等来实现它的数据结构，效率更高。

### redis缓存如何保持一致性

读数据的时候首先去 Redis 中读取，没有读到再去 MySQL 中读取，读取到数据更新到 Redis 中作为下一次的缓存。

写数据的时候会产生数据不一致的问题。无论是先写入 Redis 再写入 MySQL 中，还是先写入 MySQL 再写入 Redis 中，这两步操作都不能保证原子性，所以会出现 Redis 和 MySQL 中数据不一致的问题。

无论采取何种方式都不能保证强一致性，如果对 Redis 中的数据设置了过期时间，能够保证最终一致性，对架构的优化只能降低发生的概率，不能从根本上避免不一致性。

更新缓存的两种方式：删除失效缓存、更新缓存。

更新缓存和数据库有两种顺序：先数据库后缓存、先缓存后数据库。