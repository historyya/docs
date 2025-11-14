---
title: web开发
description: web开发
sidebar:
  order: 100
---

## 路由

### net/http

```go
package main

import "net/http"

func main() {
	// 创建路由实例
	mux := http.NewServeMux()

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
	    w.Header.Set("Content-Type", "application/json")
		w.Write([]byte("Hello, World!"))
		w.WriteHeader(http.StatusOK)
	})

	http.ListenAndServe(":8080", mux)
}
```

