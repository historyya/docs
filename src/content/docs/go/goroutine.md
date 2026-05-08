---
title: goroutine
description: goroutine
sidebar:
  order: 8
---

## goroutine

协程（goroutine）是轻量级的执行线程

- 主线程结束协程自动结束，主线程不会等待协程的结束

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

```go
package main

import (
	"fmt"
	"sync"
	"time"
)

var wait = sync.WaitGroup{}

func study() {
	time.Sleep(2 * time.Second)
	fmt.Println("去学习")
}

func swim() {
	time.Sleep(3 * time.Second)
	fmt.Println("去游泳")
	wait.Done()
}

func main() {
	t1 := time.Now()
	wait.Add(1)
	go swim()
	study()
	wait.Wait()
	t2 := time.Now()
	fmt.Println("总耗时：", t2.Sub(t1))
}
```
