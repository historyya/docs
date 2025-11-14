---
title: goroutine
description: 协程
sidebar:
  order: 8
---

协程(goroutine) 是轻量级的执行线程

### 代码示例

```go
package main

import (
	"fmt"
	"time"
)

func f(from string) {
	for i := 0; i < 3; i++ {
		fmt.Println(from, ":", i)
	}
}

func main() {
	f("direct")

	// 创建一个 goroutine
	go f("goroutine")

	// 创建一个匿名 goroutine
	go func(msg string) {
		fmt.Println(msg)
	}("going")

	time.Sleep(time.Second)
	fmt.Println("done")
	
// direct : 0
// direct : 1
// direct : 2
// going
// goroutine : 0
// goroutine : 1
// goroutine : 2
// done
}
```
