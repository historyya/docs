---
title: 安装配置
description: 安装配置
sidebar:
  order: 0
---

## 安装

```bash
sudo apt install git

git --version
```

## 配置

```bash
git config --global user.name "Your Name"
git config --global user.email "Your Email"
git config --global init.defaultBranch main

# set proxy
git config --global http.proxy http://127.0.0.1:7890
git config --global https.proxy http://127.0.0.1:7890

# 保存用户密码
git config --global credential.helper store

# 查看配置信息
git config --list

Output
user.name=QingLi
user.email=you@example.com

# 查看全局配置
git config --global --list
```
