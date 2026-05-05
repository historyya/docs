---
title: 安装
description: 安装
sidebar:
  order: 0
---

## 安装

```bash
$ sudo apt update

$ curl -fsSL https://get.docker.com -o get-docker.sh

$ sudo sh get-docker.sh

# 把当前用户加入docker组，免root运行Docker
$ sudo usermod -aG docker $USER

$ docker --version
```
