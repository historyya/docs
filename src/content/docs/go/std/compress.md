---
title: compress
description: compress
sidebar:
  order: 32
---

## 压缩

```go
package main

import (
	"bytes"
	"compress/gzip"
	"fmt"
	"io"
	"strings"
)

func main() {
	originData := "这是一段需要压缩的文本数据，" + "重复内容" + strings.Repeat("重复内容", 100) + "，结束。"

	var compressData bytes.Buffer
	writer := gzip.NewWriter(&compressData)
	_, err := writer.Write([]byte(originData))
	if err != nil {
		panic(err)
	}
	writer.Close()

	fmt.Printf("原始数据大小：%d，压缩数据大小：%d\n", len(originData), compressData.Len())
	fmt.Printf("压缩率：%.2f%%\n", float64(compressData.Len())/float64(len(originData))*100)

	// 解压
	reader, err := gzip.NewReader(&compressData)
	if err != nil {
		panic(err)
	}
	defer reader.Close()
	readAll, err := io.ReadAll(reader)
	if err != nil {
		panic(err)
	}
	fmt.Println(string(readAll))
}
```
