---
title: channel
description: 通道
sidebar:
  order: 9
---

### 代码示例

```go
package main

import (
	"fmt"
)

func main() {
	// 创建一个无缓存的channel
	messages := make(chan string)

	go func() {
		// 发送消息到 channel
		messages <- "ping"
	}()

	// 从channel中接收消息
	msg := <-messages
	fmt.Println(msg)  // ping
}
```

```go
package main

import (
	"fmt"
	"time"
)

func main() {
	channelWithCache()
	channelWithoutCache()
}

func channelWithCache() {
	// 创建一个带缓冲的channel
	ch := make(chan string, 1)
	go func() {
		ch <- "Hello, first message from channel"
		time.Sleep(time.Second)
		ch <- "Hello, second message from channel"
	}()

	time.Sleep(2 * time.Second)
	message := <-ch
	fmt.Println(time.Now().String() + message)  // first message from channel
	message = <-ch
	fmt.Println(time.Now().String() + message)  // second message from channel
}

func channelWithoutCache() {
	// 不带缓冲的channel
	ch := make(chan string)
	go func() {
		time.Sleep(time.Second)
		ch <- "Hello, message from channel"
	}()

	message := <-ch
	fmt.Println(message)  // Hello, message from channel
}
```
