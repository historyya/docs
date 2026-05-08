---
title: 数据类型
description: 数据类型
sidebar:
  order: 2
---

## int uint 整型

- 默认为 `int64`
- `uint` 无符号整型，只能存正整数

```go
package main

import "fmt"

func main() {
	var n1 uint = 2
	var n2 uint8 = 255
	var n3 uint16 = 65535
	var n4 uint32 = 4294967295
	var n5 uint64 = 18446744073709551615
	fmt.Println(n1, n2, n3, n4, n5)

	var n6 int = -2
	var n7 int8 = -128
	var n8 int16 = -32768
	var n9 int32 = -2147483648
	var n10 int64 = -9223372036854775808
	fmt.Println(n6, n7, n8, n9, n10)
}
```

## byte 字节

```go
// byte 就是字节，本质是uint8
// 一个字节=8个bit
type byte = uint8
```

```go
package main

import (
	"fmt"
)

func main() {
	var b1 byte
	b1 = 'a'
	fmt.Println(b1)        // 97
	fmt.Printf("%c\n", b1) // a
}
```

## rune 字符

```go
// rune就是字符，本质是int32，一个rune=4个字节
// 接近其他语言的char
type rune = int32
```

```go
package main

import (
	"fmt"
)

func main() {
	var a rune
	a = '啊'
	fmt.Println(a)        // 21834
	fmt.Printf("%c\n", a) // 啊
}
```

## float64 浮点数

```go
package main

import (
	"fmt"
	"math"
)

func main() {
	fmt.Println(math.MaxFloat64)
	fmt.Println(math.MaxFloat32)

	f1 := 1.0
	fmt.Println(f1)

	f2 := float64(2.0)
	fmt.Println(f2)

	// 正无穷
	fmt.Println(math.Inf(1) > 10000000000000000.1)
	// 负无穷
	fmt.Println(math.Inf(-1) < -10000000000000000.1)
	// NaN
	fmt.Println(math.NaN() == math.NaN())
}
```

## string 字符串类型

```go
package main

// 字符串等价于 []byte
const s = "hello world"

func main() {
	// 一般用于短的
	println("Hello, World")

	// 多行字符串
	println(`Hello, World
我是第二行
`)
}
```

### 方法

```go
package main

import (
	"fmt"
	"strings"
	"unicode/utf8"
)

func main() {
	// 获取字符串长度
	// 获取的是字节(byte)长度，与编码无关
	println(len("你好")) // 6

	// 获取字符长度
	println(utf8.RuneCountInString("你好")) // 2

	// 对应的操作包在 strings 下
	fmt.Println(strings.Cut("hello world", " ")) // hello world true

	// 统计1出现的次数
	fmt.Println(strings.Count("00000011110000101010", "1")) // 7

	// 是否包含
	fmt.Println(strings.Contains("zhang123456san", "san")) // true

	// 去除前后空格
	fmt.Println(strings.TrimSpace("  account ")) // account

	// 后缀匹配
	fmt.Println(strings.HasSuffix("avatar.png", ".png")) // true
}
```

## bool

- 默认值为：false

## 零值

```go
package main

import (
	"fmt"
)

func main() {
	var i int
	fmt.Println(i) // 0

	var b byte
	fmt.Println(b) // 0

	var s string
	fmt.Printf("%q\n", s) // ""
}
```

## array 数组

- 数组是**固定长度**的
- 具有**相同数据类型**元素的有序集合
- 值类型（当数组被赋值给一个新变量或传递给函数时，会创建整个数组的副本）

```go
package main

import "fmt"

func main() {
    // 声明数组，但不初始化
    var a [5]int
    fmt.Println("emp:", a)  // emp: [0 0 0 0 0]

    a[4] = 100
    fmt.Println("set:", a)  // set: [0 0 0 0 100]
    fmt.Println("get:", a[4])  // get: 100

    fmt.Println("len:", len(a))  // len: 5

    // 声明数组并初始化
    b := [5]int{1, 2, 3, 4, 5}
    fmt.Println("dcl:", b)  // dcl: [1 2 3 4 5]

    // 声明数组，长度由编译器计算
    c := [...]int{1, 2, 3, 4, 5}

    var twoD [2][3]int
    for i := 0; i < 2; i++ {
        for j := 0; j < 3; j++ {
            twoD[i][j] = i + j
        }
    }
    fmt.Println("2d: ", twoD)  // 2d:  [[0 1 2] [1 2 3]]
}
```

**应用场景**

1. 存储固定大小的数据集合（如一周的温度数据）
2. 内存敏感场景，数组在栈上分配
3. 加密或编码等需要精确控制内存布局的场景

## slice 切片

- 长度是可变的
- 切片是引用类型，包含三个组件：底层数组指针，当前切片长度，切片容量

```go
package main

import "fmt"

func main() {
    // 声明切片
    var slice1 []int

    // make初始化 make([]T, len, cap) cap不传则和len一样
    // len(slice) 获取切片长度
    // cap(slice) 获取切片容量
    // 初始化一个长度为3的切片
    s := make([]string, 3)
    fmt.Println("emp:", s)  // emp: [  ]

    s[0] = "a"
    s[1] = "b"
    s[2] = "c"
    fmt.Println("set:", s)  // set: [a b c]
    fmt.Println("get:", s[2])  // get: c

    fmt.Println("len:", len(s))  // len: 3

    // append 追加元素
    // 如果添加元素没有超过容量限制，不会发生扩容
    // 如果添加元素超过容量限制，会发生扩容，扩容规则是翻倍
    s = append(s, "d")
    s = append(s, "e", "f")
    fmt.Println("apd:", s)

    c := make([]string, len(s))  // apd: [a b c d e f]
    copy(c, s)
    fmt.Println("cpy:", c)  // cpy: [a b c d e f]

    /*

    子切片
    数组和切片都可以通过[start:end]的方式来获取子切片
    1. arr[start:end] 获取[start:end)之间的元素
    2. arr[:end] 获取[0:end)之间的元素
    3. arr[start:] 获取[start:len(arr))之间的元素

    注意：左闭右开，包含左边，不包含右边

    */

    l := s[2:5]
    fmt.Println("sl1:", l)  // sl1: [c d e]

    l = s[:5]
    fmt.Println("sl2:", l)  // sl2: [a b c d e]

    l = s[2:]
    fmt.Println("sl3:", l)  // sl3: [c d e f]

    t := []string{"g", "h", "i"}
    fmt.Println("dcl:", t)  // dcl: [g h i]

    // slice的len和cap不一定相等，len代表这个slice目前有多少个元素，cap代表这个切片能放多少个元素
    // 初始化一个4个元素的切片
	s1 := []int{1, 2, 3, 4, 5, 6}
	fmt.Printf("s1: %v\n", s1)           // s1: [1 2 3 4 5 6]
	fmt.Printf("len(s1): %v\n", len(s1)) // len(s1): 6
	fmt.Printf("cap(s1): %v\n", cap(s1)) // cap(s1): 6

	// 初始化一个长度为3，容量为10的切片
	s2 := make([]int, 3, 10)
	fmt.Printf("s2: %v\n", s2)           // s2: [0 0 0]
	fmt.Printf("len(s2): %v\n", len(s2)) // len(s2): 3
	fmt.Printf("cap(s2): %v\n", cap(s2)) // cap(s2): 10

	// 最佳实践
	// 初始化一个空切片，容量为10
	slice := make([]int, 0, 10)

    twoD := make([][]int, 3)
    for i := 0; i < 3; i++ {
        innerLen := i + 1
        twoD[i] = make([]int, innerLen)
        for j := 0; j < innerLen; j++ {
            twoD[i][j] = i + j
        }
    }
    fmt.Println("2d: ", twoD)  // 2d:  [[0] [1 2] [2 3 4]]
}

// 共享底层
func shareSlice() {
	s1 := []int{1, 2, 3, 4}
	s2 := s1[2:]
	fmt.Printf("s1: %v, len: %d, cap: %d \n", s1, len(s1), cap(s1)) // s1: [1 2 3 4], len: 4, cap: 4
	fmt.Printf("s2: %v, len: %d, cap: %d \n", s2, len(s2), cap(s2)) // s2: [3 4], len: 2, cap: 2

	s2[0] = 99
	fmt.Printf("s1: %v, len: %d, cap: %d \n", s1, len(s1), cap(s1)) // s1: [1 2 99 4], len: 4, cap: 4
	fmt.Printf("s2: %v, len: %d, cap: %d \n", s2, len(s2), cap(s2)) // s2: [99 4], len: 2, cap: 2

	s2 = append(s2, 200)
	fmt.Printf("s1: %v, len: %d, cap: %d \n", s1, len(s1), cap(s1)) // s1: [1 2 99 200], len: 4, cap: 4
	fmt.Printf("s2: %v, len: %d, cap: %d \n", s2, len(s2), cap(s2)) // s2: [99 200], len: 2, cap: 2

	s2[1] = 1999
	fmt.Printf("s1: %v, len: %d, cap: %d \n", s1, len(s1), cap(s1)) // s1: [1 2 99 1999], len: 4, cap: 4
	fmt.Printf("s2: %v, len: %d, cap: %d \n", s2, len(s2), cap(s2)) // s2: [99 1999], len: 2, cap: 2
}
```

### 排序

```go
package main

import (
	"fmt"
	"sort"
)

func main() {
	s1 := []int{4, 5, 2, 1, 3}
	// 升序
	sort.Ints(s1)
	fmt.Println(s1)

	// 升序
	sort.Slice(s1, func(i, j int) bool {
		return s1[i] < s1[j]
	})
	fmt.Println(s1)

	// 降序
	sort.Sort(sort.Reverse(sort.IntSlice(s1)))
	fmt.Println(s1)

	// 降序
	sort.Slice(s1, func(i, j int) bool {
		return s1[i] > s1[j]
	})
	fmt.Println(s1)
}
```

**应用场景**

1. 动态数据集合（如读取未知长度的文件内容）
2. 复用内存，避免复制（如截取日志子集）
3. 实现栈或队列数据结构
4. 高性能批量处理

## array vs slice

|              | array  | slice        |
| ------------ | ------ | ------------ |
| 直接初始化   | 支持   | 支持         |
| make         | 不支持 | 支持         |
| 访问元素     | arr[i] | s[i]         |
| len          | 长度   | 已有元素个数 |
| cap          | 长度   | 容量         |
| append       | 不支持 | 支持         |
| 是否可以扩容 | 不可以 | 可以         |

:::tip[总结]
遇事不决用切片，基本不会出错。
:::

### 如何理解切片

最直观的对比：arraylist，即基于数组的list的实现，切片的底层也是数组

跟arraylist的区别：

1. 切片操作是有限的，不可以随机增删(没有add，delete方法，可以自己实现)
2. 只有append操作
3. 切片支持子切片，和原本切片是共享底层数组

### 数组和切片有什么区别

- 数组的大小是固定的，切片不是，切片可以动态扩容
- 切片和子切片共享底层，部分修改相互之间会有影响
- 需要注意切片的扩容策略，扩容后会重新分配底层数组，不再共享

## map 集合

- 无序的 `key - value ` 集合
- `map` 中的 `key` `必须是基本数据类型，value` 可以是任意类型

```go
package main

import "fmt"

func main() {
    // 声明nil map
    var m1 map[string]int

    // 字面量创建
    m2:= map[string]int{
        "A": 1,
        "B": 2,
    }

    // 使用make创建一个map
    m := make(map[string]int)

    // 赋值
    m["k1"] = 7
    m["k2"] = 13

    fmt.Println("map:", m)  // map: map[k1:7 k2:13]

    // 取值
    v1 := m["k1"]
    fmt.Println("v1: ", v1)  // v1:  7

    fmt.Println("len:", len(m))  // len: 2

    delete(m, "k2")
    fmt.Println("map:", m)  // map: map[k1:7]

    // 取值，判断是否存在，后面的ok会告诉map中是否存在这个key
    value, ok := m["k2"]
    fmt.Println("ok:", ok)  // ok: false

    // 初始化一个map
    n := map[string]int{"foo": 1, "bar": 2}
    fmt.Println("map:", n)  // map: map[foo:1 bar:2]

    // 遍历
    for k, v := range m {
        fmt.Printf("key: %s, value: %d\n", k, v)
    }
}
```

```go
package main

import (
	"fmt"
	"sort"
	"sync"
)

func main() {
	// 作为集合使用
	uniqueIds := make(map[int]bool)
	ids := []int{1, 2, 2, 3, 3, 4, 5, 5}
	for _, id := range ids {
		uniqueIds[id] = true
	}
	fmt.Println(len(uniqueIds))  // 5

	// 键值反转
	originMap := map[string]int{
		"A": 1,
		"B": 2,
		"C": 3,
	}
	reversedMap := make(map[int]string)
	for key, value := range originMap {
		reversedMap[value] = key
	}
	fmt.Println(reversedMap)  // map[1:A 2:B 3:C]

	// map是无序的键值对
	ageMap := map[string]int{
		"Alice": 18,
		"Bob":   20,
		"Coco":  19,
	}
	keys := make([]string, 0, len(ageMap))
	for key := range ageMap {
		keys = append(keys, key)
	}
	sort.Strings(keys)
	for _, key := range keys {
		fmt.Printf("%s: %d\n", key, ageMap[key])
	}

	// sync.Map
	var syncMap sync.Map
	syncMap.Store("A", 1)
	syncMap.Store("B", 2)
	fmt.Println(syncMap.Load("A"))  // 1 true
	syncMap.Delete("A")
	syncMap.Range(func(key, value interface{}) bool {
		fmt.Println(key, value)  // B 2
		return true
	})
}
```

## 自定义数据类型

```go
package main

import "fmt"

// 自定义类型
type codeType int
type payType int

// 给自定义类型绑定方法
func (c codeType) String() string {
	return fmt.Sprintf("%d", c)
}

var successCode codeType = 0
var failCode codeType = 1

var wechatPay payType = 0
var aliPay payType = 1

func Pay(p payType) {

}

func main() {
	Pay(aliPay)
}
```

## 类型别名

```go
package main

type myInt = int

func main() {
	var m myInt = 2
	println(m)
}
```
