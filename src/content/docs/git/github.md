---
title: 常用命令
description: 常用命令
sidebar:
  order: 1
---

## GitHub 流程

```bash
# 初始化仓库
git init

# 克隆远程仓库
git clone https://github.com/your-username/your-repo.git

# 查看状态
git status

# 添加文件到暂存区
git add README.md
git add .

# 提交更改
git commit -m "提交说明"

# 推送到远程仓库
git push origin main

# 拉取最新代码
git pull origin main

# 查看提交记录
git log

git log --oneline

# 查看操作的历史记录
git reflog

# 对比文件差异
git diff

git diff HEAD

git diff --cached

git diff b270efb HEAD

git diff HEAD^ HEAD

# 查看暂存区的文件
git ls-files

# 删除文件
git rm temp.go

# 从本地仓库删除不想要被提交的文件
git rm --cached temp.log

# 连接远程仓库
git remote add origin https://xxx

# 查看本地 Git 目录关联的远程仓库地址
git remote -v

# 取消与远程仓库的关联
git remote remove origin

# 推送代码到远程仓库
git push origin master
```

## 开发流程

```bash
# 1. 拉取最新代码
git switch main
git pull origin main

# 2. 创建功能分支
git checkout -b feature/ai-mvp

# 3. 开发功能，定期提交代码
git add .
git commit -m "feat: 添加 AI MVP 功能"

# 4. 同步主分支
git fetch origin
# git rebase origin/main

# 5. 推送代码到远程仓库
git push origin feature/ai-mvp

# 6. 发起 PR，合并到主分支
# git switch main
# git pull origin main
# git merge feature/ai-mvp
# git push origin main
# git branch -d feature/ai-mvp
# git push origin --delete feature/ai-mvp  # 删除远程分支

# 7. 删除本地分支
git branch -d feature/ai-mvp

# 8. 获取最新代码
git switch main
git pull origin main
```

### 同步最新代码

```shell
git switch dev

# 把 dev 更新到最新 main
git rebase main
```

### 紧急bug修复

```bash
# 1. 从main分支创建一个bugfix分支
git checkout -b bugfix/fix-bug-1010

# 2. 修复bug，并提交代码
git add .
git commit -m "fix: 修复 AI MVP 功能"

# 3. 合并到main分支
git switch main
git merge bugfix/fix-bug-1010

# 4. 合并到develop分支
git switch develop
git merge bugfix/fix-bug-1010

# 5. 删除bugfix分支
git branch -d bugfix/fix-bug-1010
```

## 撤销操作

```bash
# 撤销未提交的修改
git checkout -- README.md

# 撤销已提交的修改
git reset HEAD README.md

# 撤销提交，保留修改
git reset --soft HEAD^

# 回退到某个版本，并保留工作区和暂存区的内容
$ git reset --soft 5af90b8

# 回退到上一次版本
git reset --hard HEAD^

# 回退到某个版本，工作区和暂存区的内容都会被清空
$ git reset --hard 5af90b8
```
