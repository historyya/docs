---
title: install
description: install
sidebar:
  order: 1
---

## 安装

### Linux

```shell
wget https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-debian12-8.2.2.tgz

tar -xvf mongodb-linux-x86_64-debian12-8.2.2.tgz

mv mongodb-linux-x86_64-debian12-8.2.2 /usr/local/mongodb

# 数据存储目录
mkdir -p /mongodb/single/data/db

# 日志存储目录
mkdir -p /mongodb/single/log

vim /mongodb/single/mongod.conf

# mongod.conf
storage:
  dbPath: /mongodb/single/data/db
  journal:
    enabled: true
  directoryPerDB: true

systemLog:
  destination: file
  path: /mongodb/single/log/mongod.log
  logAppend: true
  logRotate: reopen

net:
  port: 27017
  bindIp: 0.0.0.0
  maxIncomingConnections: 20000

processManagement:
  fork: true
  pidFilePath: /var/run/mongodb/mongod.pid

security:
  authorization: enabled
  
# 使用配置文件启动
/usr/local/mongodb/bin/mongod -f /mongodb/single/mongod.conf

# 检查配置文件语法
mongod --config /mongodb/single/mongod.conf --configExpand rest --dry-run

# 查看服务进程
ps -ef | grep mongod

# 关闭进程
kill -2 23070

# 客户端连接关闭服务
mongo --host=127.0.0.1 --port 27010

use admin

db.shutdownServer()
```

### 版本命名规范

`x.y.z` : y为奇数时表示当前版本为开发版，y为偶数时表示当前版本为稳定版；z是修正版本号，数字越大越好。

