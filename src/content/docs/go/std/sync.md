---
title: sync
description: sync
sidebar:
  order: 37
---

## sync

```go
package main

import (
	"fmt"
	"sync"
)

func main() {
	// 并发安全的map
	m1 := sync.Map{}
	// store 存储
	m1.Store("name", "Tom")
	m1.Store("age", 20)

	// load 读取
	value, ok := m1.Load("name")
	if ok {
		fmt.Println(len(value.(string))) // 动态类型断言
	}
}
```

### sync.Mutex

```go
import "sync"

var mutex sync.Mutex
var rwMutex sync.RWMutex // 尽量使用读写锁

func Mutex() {
	mutex.Lock()
	defer mutex.Unlock()
	// 你的代码
}

func RWMutex() {
	// 加读锁
	rwMutex.RLock()
	defer rwMutex.RUnlock()
}
```

### sync.Once

```go
package main

import (
	"fmt"
	"sync"
)

var once sync.Once

// 这个方法不论调用几次，只会执行一次
func PrintOnce() {
	once.Do(func() {
		fmt.Println("----------")
	})
}

func main() {
	PrintOnce()
	PrintOnce()
	PrintOnce()
}
```

### sync.WaitGroup

```go
package main

import (
	"fmt"
	"sync"
)

func main() {
	res := 0
	wg := sync.WaitGroup{}
	wg.Add(10)
	for i := 0; i < 10; i++ {
		go func(value int) {
			res += value
			wg.Done()
		}(i)
	}

	//wg.Wait() // 45
	fmt.Println(res) // 10
}
```
