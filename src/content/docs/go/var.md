---
title: 变量和常量
description: 变量和常量
sidebar:
  order: 1
---

## 参考

[Go by Example 中文版](https://gobyexample-cn.github.io/)

## 变量

```go
package main

import "fmt"

// 全局变量定义
var app_version = "1.0.0"

func main() {
    // 先定义，后赋值
    var name string
    name = "张三"
    fmt.Println(name)  // 张三

    // 定义并赋值
    var a = "initial"
    fmt.Println(a)  // initial

    var b, c int = 1, 2
    fmt.Println(b, c)  // 1 2

    var d = true
    fmt.Println(d)  // true

    var e int
    e = 10  // 赋值
    fmt.Println(e)  // 10

    // 简短声明
    f := "apple"
    fmt.Println(f)  // apple
}
```

## 常量

```go
package main

import (
    "fmt"
    "math"
)

const s string = "constant"

func main() {
    fmt.Println(s)  // constant

    const n = 500000000

    const d = 3e20 / n
    fmt.Println(d)  // 6e+11

    fmt.Println(int64(d))  // 600000000000

    fmt.Println(math.Sin(n))  // -0.28470407323754404
}
```
