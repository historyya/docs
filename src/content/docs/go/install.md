---
title: 安装
description: 安装
sidebar:
  order: 0
---

## 配置环境

```bash
$ vim ~/.profile
export PATH=$PATH:/usr/local/go/bin
export PATH="$HOME/go/bin:$PATH"

$ go version
```

## 运行

```go
// main.go
package main

import "fmt"

func main() {
	fmt.Println("hello world")
}
```

```bash
$ go run main.go
```

## 输出

```go
package main

import "fmt"

func main() {
	fmt.Println("hello world")

	fmt.Print("1")
	fmt.Print("2", "3\n")

	fmt.Printf("%v\n", "张三")                 // 占位符输出
	fmt.Printf("%d\n", 3)                    // 整数
	fmt.Printf("%.2f\n", 3.1415)             // 小数
	fmt.Printf("%s\n", "你好")                 // 字符串
	fmt.Printf("%v %T\n", "admin", "123456") // 打印类型
	fmt.Printf("%#v\n", "")                  // 格式输出，适合打印空字符串

	// 格式化后的内容赋值给一个变量
	password := fmt.Sprintf("%v", "password")
	fmt.Println(password)
}
```

## 输入

```go
package main

import "fmt"

func main() {
	var password string
	l, err := fmt.Scan(&password)
	fmt.Println(l, err, password)

	var num int
	n, err := fmt.Scanln(&num)
	fmt.Println(n, err, num)

	x, err := fmt.Scanf("%s - %d", &password, &num)
	fmt.Println(x, err, password, num)
}
```
