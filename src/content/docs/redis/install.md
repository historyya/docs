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

$ ps -ef | grep redis

$ redis-cli
ping

auth password123

config get requirepass  #获取redis密码

config set requirepass "123456"  #设置redis密码
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
```
