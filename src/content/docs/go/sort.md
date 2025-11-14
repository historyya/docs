---
title: 排序
description: 排序
sidebar:
  order: 31
---

## 基本

```go
package main

import (
    "fmt"
    "sort"
)

func main() {
    // 字符串排序
    strs := []string{"c", "a", "b"}
    sort.Strings(strs)
    fmt.Println("Strings:", strs)  // Strings: [a b c]

    ints := []int{7, 2, 4}
    sort.Ints(ints)
    fmt.Println("Ints: ", ints)  // Ints: [2 4 7]

    // 检查一个切片是否是有序的
    s := sort.IntsAreSorted(ints)
    fmt.Println("Sorted: ", s)  // Sorted:  true
}
```

## 自定义排序

```go
package main

import (
    "fmt"
    "sort"
)

type byLength []string

// 实现sort.Interface 接口的 Len、Less 和 Swap 方法
func (s byLength) Len() int {
    return len(s)
}
func (s byLength) Swap(i, j int) {
    s[i], s[j] = s[j], s[i]
}
func (s byLength) Less(i, j int) bool {
    return len(s[i]) < len(s[j])
}

func main() {
    fruits := []string{"peach", "banana", "kiwi"}
    // 按字符串的长度进行排序
    sort.Sort(byLength(fruits))
    fmt.Println(fruits)  // [kiwi peach banana]
}
```