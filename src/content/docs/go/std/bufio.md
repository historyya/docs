---
title: bufio
description: bufio
sidebar:
  order: 31
---

## bufio

```go
package main

import (
	"bufio"
	"fmt"
	"io"
	"os"
)

func main() {
	file, err := os.Create("file.txt")
	if err != nil {
		panic(err)
	}

	writer := bufio.NewWriter(file)
	for i := 0; i < 10; i++ {
		writer.WriteString(fmt.Sprintf("This is line %d\n", i+1))
	}
	writer.Flush()
	fmt.Println("Done")
	defer file.Close()

	f2, err := os.Open("file.txt")
	if err != nil {
		panic(err)
	}
	defer f2.Close()

	reader := bufio.NewReader(f2)
	for {
		line, err := reader.ReadString('\n')
		if err == io.EOF {
			break
		}
		if err != nil {
			panic(err)
		}
		fmt.Println(line)
	}
}
```
