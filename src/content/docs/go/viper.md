---
title: Viper库的使用
description: Viper库的使用
sidebar:
  order: 201
---

## 设置和读取值

```go
package main

import (
	"fmt"

	"github.com/spf13/viper"
)

func main() {
	viper.SetDefault("name", "张三")
	viper.Set("name", "李四")

	fmt.Println(viper.Get("name")) // 李四
}
```

## 写配置文件

```go
package main

import (
	"github.com/spf13/viper"
)

func main() {
	viper.Set("Server", "Server")
	type ServerConfig struct {
		Addr string `json:"addr"`
		Port string `json:"port"`
	}

	var serverConfig = ServerConfig{
		Addr: "localhost",
		Port: "8080",
	}
	viper.SetDefault("ServerConfig", serverConfig)

	viper.SetConfigType("json")
	viper.WriteConfigAs("config.json")
}
```

```json
{
  "server": "Server",
  "serverconfig": {
    "addr": "localhost",
    "port": "8080"
  }
}
```

## 读取配置文件

```go
package main

import (
	"fmt"

	"github.com/spf13/viper"
)

func main() {
	viper.SetConfigType("yaml")
	viper.SetConfigFile("config.yaml")

	err := viper.ReadInConfig()
	if err != nil {
		panic(err)
		return
	}

	fmt.Println(viper.Get("app"))

	fmt.Println(viper.Get("server.port"))

	type Config struct {
		App string `json:"mapstructure:app"`
	}

	var config Config
	err = viper.Unmarshal(&config)
	if err != nil {
		panic(err)
		return
	}

	fmt.Println(config)
}
```

## 监控配置文件变化

```go
package main

import (
	"fmt"

	"github.com/fsnotify/fsnotify"
	"github.com/spf13/viper"
)

func main() {
	viper.SetConfigType("yaml")
	viper.SetConfigFile("config.yaml")

	viper.WatchConfig()
	viper.OnConfigChange(func(e fsnotify.Event) {
		// name是文件名，op是变化的类型:WRITE
		fmt.Println("Config file changed:", e.Name, e.Op)
	})

	select {}
}
```

## 读取系统环境变量

```go
package main

import (
	"fmt"

	"github.com/spf13/viper"
)

func main() {
	viper.AutomaticEnv()
	viper.SetEnvPrefix("")

	fmt.Println(viper.Get("GOPATH"))
}
```

Linux下使用`echo $GOPATH`命令查看。

## 获取命令行参数

```go
package main

import (
	"fmt"

	"github.com/spf13/pflag"
	"github.com/spf13/viper"
)

func main() {
	var ip string
	var port int
	pflag.StringVar(&ip, "ip", "localhost", "ip address")
	pflag.IntVar(&port, "port", 3000, "port number")
	pflag.Parse()

	viper.BindPFlags(pflag.CommandLine)

	fmt.Println(viper.Get("ip"))
}
```

运行: `go run main.go --ip 127.0.0.1 --port 8080` 

## 读取远程配置

### etcd

```go
package main

import (
	"fmt"

	"github.com/spf13/viper"
	_ "github.com/spf13/viper/remote"
)

func main() {
	viper.AddRemoteProvider("etcd3", "http://127.0.0.1:2379", "config/dev")
	viper.SetConfigType("json")

	err := viper.ReadRemoteConfig()
	if err != nil {
		panic(err)
	}

	fmt.Println(viper.Get("addr"))
}
```
