---
title: os
description: os
sidebar:
  order: 30
---

## 文件处理

### 打开与读取文件

```go
package t

import (
	"log"
	"os"
)

func main() {
	// 打开文件
	os.Open("readme.md")

	// 创建文件
	os.Create("temp.txt")

	// 打开或创建文件
	f, err := os.OpenFile("notes.txt", os.O_RDWR|os.O_CREATE, 0644)
	if err != nil {
		log.Fatal(err)
	}

	// 读取文件
	data, err := os.ReadFile("testdata/hello")
	if err != nil {
		log.Fatal(err)
	}
	os.Stdout.Write(data)

	// 写入文件
	err = os.WriteFile("testdata/hello", []byte("Hello, Gophers!"), 0666)
	if err != nil {
		log.Fatal(err)
	}

	// 关闭文件
	if err := f.Close(); err != nil {
		log.Fatal(err)
	}
}
```

### 复制文件

```go
package t

import (
	"io"
	"log"
	"os"
	"strings"
)

func main() {
	// 适用于小文件，占用内存较高
	data, err := os.ReadFile("note.txt")
	if err != nil {
		log.Fatal(err)
	}

	err = os.WriteFile("readme.txt", []byte(data), 0666)
	if err != nil {
		log.Fatal(err)
	}

	// 高效，适用于任何大小的文件，占用内存较低
	r := strings.NewReader("some io.Reader stream to be read\n")
	if _, err := io.Copy(os.Stdout, r); err != nil {
		log.Fatal(err)
	}
}
```

### 重命名文件

```go
package t

import (
	"log"
	"os"
)

func main() {
	err := os.Rename("old.txt", "new.txt")
	if err != nil {
		log.Fatal(err)
	}
}
```

### 删除文件或目录

```go
package t

import (
	"log"
	"os"
)

func main() {
	// 提供路径，删除路径下的所有文件
	err := os.RemoveAll("logs")
	if err != nil {
		log.Fatal(err)
	}
}
```

## 目录处理

### 读取目录

```go
package main

import (
	"fmt"
	"log"
	"os"
)

func main() {
	files, err := os.ReadDir(".")
	if err != nil {
		log.Fatal(err)
	}

	for _, file := range files {
		fmt.Println(file.Name())
	}
}
```

### 创建目录

```go
package main

import (
	"log"
	"os"
)

func main() {
	err := os.Mkdir("testdir", 0750)
	if err != nil && !os.IsExist(err) {
		log.Fatal(err)
	}
	err = os.WriteFile("testdir/testfile.txt", []byte("Hello, Gophers!"), 0660)
	if err != nil {
		log.Fatal(err)
	}
}
```

#### 创建多级目录

```go
package main

import (
	"log"
	"os"
)

func main() {
	err := os.MkdirAll("test/subdir", 0750)
	if err != nil {
		log.Fatal(err)
	}
	err = os.WriteFile("test/subdir/testfile.txt", []byte("Hello, Gophers!"), 0660)
	if err != nil {
		log.Fatal(err)
	}
}
```
