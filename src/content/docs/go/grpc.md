---
title: grpc
description: grpc
sidebar:
  order: 104
---

## 安装

```bash
# 1. 安装protoc
PB_REL="https://github.com/protocolbuffers/protobuf/releases"
curl -LO $PB_REL/download/v30.2/protoc-30.2-linux-x86_64.zip

# 2. 解压
unzip protoc-30.2-linux-x86_64.zip -d $HOME/.local

# 3. 添加环境变量
export PATH="$PATH:$HOME/.local/bin"

# 4. 查看版本
protoc --version

# Linux下直接安装
apt install -y protobuf-compiler

protoc --version

# 5. 安装protoc-gen-go
go install google.golang.org/protobuf/cmd/protoc-gen-go@latest

# 6. 编写proto文件

# 7. 生成go代码
protoc --proto_path=src --go_out=out --go_opt=paths=source_relative foo.proto bar/baz.proto
```

## 参考

1. [Protocol Buffer Compiler Installation](https://protobuf.dev/installation/)
2. [Go Generated Code Guide (Open)](https://protobuf.dev/reference/go/go-generated/)
