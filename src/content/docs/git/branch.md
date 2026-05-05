---
title: 分支操作
description: 分支操作
sidebar:
  order: 2
---

## 分支管理

### 常用分支类型

- `main` 主分支
- `develop` 开发分支
- `feature/*` 功能分支
- `bugfix/*` 修复分支
- `release/*` 发布分支

### 分支操作命令

```bash
# 查看分支
git branch
# 查看远程分支
git branch -r
# 查看所有分支
git branch -a

# 创建分支
git branch feature/ai-mvp
# 创建并切换分支
git checkout -b feature/ai-mvp

# 切换分支
git switch main

# 合并分支，需要先切换到主分支
git merge feature/ai-mvp

# 删除本地分支
git branch -d feature/ai-mvp
# 删除远程分支
git push origin --delete feature/ai-mvp
```
