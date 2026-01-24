---
title: 用户权限
description: 用户权限
sidebar:
  order: 2
---

## 用户

### 查看当前用户

```shell
whoami

# 查看用户的uid gid groups
id
```

### 查看用户所属组

```shell
groups

# 查看系统全部的组
cat /etc/group
```

### 添加组

```shell
groupadd group1

# 删除组
groupdel group1
```

### 添加用户

```shell
# m:在home目录创建文件夹,G:用户所属组
useradd -m -G root,group1 testuser

# 切换用户,su:switch user
su testuser

# 切换组
newgrp root
```

### 修改用户密码

```shell
passwd root
```

## 权限

```text
-:表示文件，d:表示目录
r:
w:
x:
permissions:(当前owner的权限)(group的权限)(其他用户的权限)
-rwxrwxrwx
```

### 修改权限

```shell
# 给所有用户添加执行权限
chmod a+x a.txt

# 给所有用户添加读写执行权限
chmod a+rwx a.txt
# 或
chmod 777 a.txt
# 给dir1目录及其内的文件添加读写执行权限
chmod -R 777 dir1

# 只有读写权限
chmod 666 a.txt

# 移除所有权限
chmod 000 a.txt

# 给当前用户添加可写权限
chmod u+w a.txt

# 移除其他用户的可读权限
chmod o-r a.txt
```
