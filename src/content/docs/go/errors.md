---
title: 错误处理
description: 错误处理
sidebar:
  order: 6
---

## 错误处理

### error

- 用于数据库连接错误，文件读写错误等

```go
type error interface {
	Error() string
}
```

### defer

- 资源清理（关闭文件，释放锁，数据库关闭）

```go
// 延迟执行，后进先出
defer fun(){
	// 延迟执行的代码
}()
```

### panic/recover

- 处理不可恢复的错误（如数组越界）

```go
// 抛出错误
panic("panic")

// 恢复错误，只针对当前协程
func recover() interface{}
```

### 示例

```go
package main

import (
	"errors"
	"fmt"
	"os"
	"time"
)

const (
	TimeFormat = "2006-01-02 15:04:05"
)

// BusinessError 自定义error
type BusinessError struct {
	Code    int
	Message string
	Time    time.Time
}

func (e *BusinessError) Error() string {
	return fmt.Sprintf("code: %d, message: %s, time: %s", e.Code, e.Message, e.Time.Format(TimeFormat))
}

func queryDB(id int) (string, error) {
	if id < 0 {
		return "", &BusinessError{
			Code:    -1,
			Message: "用户不存在",
			Time:    time.Now(),
		}
	}

	if id > 1000 {
		// errors.New 创建一个新的error
		return "", errors.New("数据库链接超时")
	}

	return "id = 1", nil
}

func readFile(fileName string) error {
	file, err := os.Open(fileName)
	if err != nil {
		return fmt.Errorf("打开文件失败：%v", err)
	}
	defer file.Close()

	buf := make([]byte, 100)
	n, err := file.Read(buf)
	if err != nil {
		return fmt.Errorf("读取文件失败：%v", err)
	}
	fmt.Println(string(buf[:n]))
	return nil
}

func safeAccess(arr []int, index int) (i int, err error) {
	defer func() {
		if r := recover(); r != nil {
			err = fmt.Errorf("发生 panic: %v", r)
		}
	}()
	return arr[index], nil
}

func deferReturn() (result int) {
	defer func() {
		result++
	}()
	return 10
}

func main() {
	result, err := queryDB(-1)
	if err != nil {
		fmt.Println(err)
	} else {
		fmt.Println(result)
	}

	err = readFile("not_exists.txt")
	if err != nil {
		if errors.Is(err, os.ErrNotExist) {
			// TODO：创建文件?
		}
		fmt.Println(err)
	}

	arr := []int{1, 2, 3}
	r, err := safeAccess(arr, 5)
	if err != nil {
		fmt.Println(err)
	} else {
		fmt.Println(r)
	}

	i := deferReturn()
	fmt.Println(i)
}
```
