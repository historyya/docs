---
title: workspace
description: workspace
sidebar:
  order: 105
---

## 创建 workspace

1. 初始化 workspace

```bash
mkdir go-project

cd go-project

go work init
```

2. 添加模块到 workspace

```bash
go work use ./module1

go work use ./module2
```

3. 在 workspace 运行代码

```bash
go run .
```
