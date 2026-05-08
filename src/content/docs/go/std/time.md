---
title: time
description: time
sidebar:
  order: 36
---

## Time

```go
package main

import (
	"fmt"
	"time"
)

const (
	DateTime = "2006-01-02 15:04"
)

func main() {
	// 获取当前时间
	now := time.Now()
	fmt.Println(now)

	// 获取当前时间加1小时之后的时间
	add := now.Add(time.Hour)
	fmt.Println(add)

	// 计算两个时间间隔的差值
	hours := add.Sub(now).Hours()
	fmt.Println(hours)  // 1

	// 判断时间大小
	fmt.Println(now.After(add))  // false

	// 格式化时间:YYYY-MM-DD HH:mm:ss
	fmt.Println(now.Format(time.DateTime))
	fmt.Println(now.Format(DateTime))

	// 获取指定时区时间
	location, _ := time.LoadLocation("America/New_York")
	nyTime := time.Now().In(location)
	fmt.Println(nyTime.Format(time.DateTime))

	// 解析时间
	dtime := "2000-01-01 12:12:13"
	t, _ := time.Parse(time.DateTime, dtime)
	fmt.Println(t.Format(time.DateTime))

	// 计算时间间隔
	start := time.Date(2020, 1, 1, 0, 0, 0, 0, time.Local)
	end := time.Date(2020, 2, 1, 0, 0, 0, 0, time.Local)
	days := end.Sub(start).Hours() / 24
	fmt.Println(days)  // 31
}
```
