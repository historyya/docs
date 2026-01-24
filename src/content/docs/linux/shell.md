---
title: shell
description: shell
sidebar:
  order: 9
---

## 查看shell

```bash
echo $SHELL

cat /etc/shells
```

## 变量

```bash
vim var.sh
```

```shell
#!/bin/bash

n1=1
echo $n1

str1="hello"
echo $str1

arr1=(1 2 3)
echo ${arr1[@]}
echo ${arr1[0]}

# 打印目录下所有文件
file1=$(ls)
echo ${file1[@]}

# 打印环境变量
echo $ENV

# -:不会赋默认值，=会若不存在会赋默认值
echo ${ENV1:-"8080"}
echo ${ENV1:="8081"}
echo $ENV1
echo $RNV2

# 输出脚本名称
echo $0
# 输出运行脚本时的参数:bash var.sh -h会输出-h
echo $1
# 输出1
echo "参数个数: $#"

# 控制流
a=10
b=20
if [$a -gt $b]; then 
  echo "更大"
else 
  echo "更小"
fi 

for num in 1 2 3 4 5; do
  echo "this number is $num"
done

# 输出目录下所有文件名
for file in $(ls); do
  echo $file
done


n=1
while (($n<5)); do
    echo $n
    let "n++"
done

echo "please enter a number"
read aNum
case aNum in
  1) echo 'you input 1'
  ;;
  2) echo 'you input 2'
  ;;
  *) echo 'invalid number'
  ;;
esac

function foo() {
    if [$1 -gt $2];then
      echo "bigger"
    else
      echo "smaller"
    fi 
}
foo 1 2
```

```bash
# 运行脚本
bash var.sh

# 将运行结果输出到temp.txt
bash var.sh > temp.txt

# 将运行结果追加到temp.txt
bash var.sh >> temp.txt

# 将shell脚本中的错误信息输出到error.txt
bash var.sh 2 >> error.txt

# 将输出和错误信息合并输出到log.txt
bash var.sh > log.txt 2>&1
```
