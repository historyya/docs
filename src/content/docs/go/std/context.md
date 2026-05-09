---
title: context
description: context
sidebar:
  order: 41
---

## 数据传递

```go
package main

import (
	"context"
	"fmt"
)

func main() {
	ctx := context.Background()
	ctx = context.WithValue(ctx, "name", "张三")
	GetUser(ctx)
}

func GetUser(ctx context.Context) {
	fmt.Println(ctx.Value("name")) // 张三
}
```

## 取消协程

```go
package main

import (
	"context"
	"fmt"
	"sync"
	"time"
)

var wait = sync.WaitGroup{}

func main() {
	t1 := time.Now()

	ctx, cancel := context.WithCancel(context.Background())

	wait.Add(1)
	go func() {
		ip, err := GetIP(ctx)
		if err != nil {
			fmt.Println(err)
		}
		fmt.Println(ip)
	}()

	go func() {
		time.Sleep(2 * time.Second)
		// 取消协程
		cancel()
	}()

	wait.Wait()
	fmt.Println("执行完成，耗时：", time.Since(t1))
}

func GetIP(ctx context.Context) (ip string, err error) {
	go func() {
		select {
		case <-ctx.Done():
			fmt.Println("协程取消", ctx.Err())
			err = ctx.Err()
			wait.Done()
			return
		}
	}()

	time.Sleep(4 * time.Second)
	ip = "127.0.0.1"
	wait.Done()
	return
}
```

## 截至时间

```go
package main

import (
	"context"
	"fmt"
	"sync"
	"time"
)

func main() {
	var wg = sync.WaitGroup{}

	t1 := time.Now()

	ctx, _ := context.WithDeadline(context.Background(), time.Now().Add(2*time.Second))

	wg.Add(1)
	go func() {
		ip, err := GetIP(ctx, &wg)
		if err != nil {
			fmt.Println(err)
		}
		fmt.Println(ip)
	}()

	wg.Wait()
	fmt.Println("执行完成，耗时：", time.Since(t1))
}

func GetIP(ctx context.Context, wg *sync.WaitGroup) (ip string, err error) {
	go func() {
		select {
		case <-ctx.Done():
			fmt.Println("协程取消", ctx.Err())
			err = ctx.Err()
			wg.Done()
			return
		}
	}()

	time.Sleep(4 * time.Second)
	ip = "127.0.0.1"
	wg.Done()
	return
}
```

## 超时时间

```go
package main

import (
	"context"
	"fmt"
	"sync"
	"time"
)

func main() {
	var wg = sync.WaitGroup{}

	t1 := time.Now()

	ctx, _ := context.WithTimeout(context.Background(), 2*time.Second)

	wg.Add(1)
	go func() {
		ip, err := GetIP(ctx, &wg)
		if err != nil {
			fmt.Println(err)
		}
		fmt.Println(ip)
	}()

	wg.Wait()
	fmt.Println("执行完成，耗时：", time.Since(t1))
}

func GetIP(ctx context.Context, wg *sync.WaitGroup) (ip string, err error) {
	go func() {
		select {
		case <-ctx.Done():
			fmt.Println("协程取消", ctx.Err())
			err = ctx.Err()
			wg.Done()
			return
		}
	}()

	time.Sleep(4 * time.Second)
	ip = "127.0.0.1"
	wg.Done()
	return
}
```
