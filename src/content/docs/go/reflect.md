---
title: 反射
description: 反射
sidebar:
  order: 33
---

## 反射

### 两大核心组件

```go
package main

import (
	"fmt"
	"reflect"
)

func main() {
	var x int = 10
	t := reflect.TypeOf(x) // 获取变量的类型信息
	fmt.Println(t)

	v := reflect.ValueOf(x) // 获取变量的值信息
	fmt.Println(v)
}
```

### 代码示例

```go
package main

import (
	"fmt"
	"reflect"
	"strconv"
)

type Config struct {
	AppName string `config:"app_name" default:"my_app"`
	Port    int    `config:"port" default:"8080"`
	Debug   bool   `config:"debug" default:"false"`
}

func (c *Config) UpdatePort(newPort int) (int, int) {
	oldPort := c.Port
	c.Port = newPort
	return oldPort, c.Port
}

type ConfigManager struct {
	config interface{}
}

func (cm *ConfigManager) CallMethod(methodName string, args ...interface{}) []interface{} {
	v := reflect.ValueOf(cm.config)
	if v.Kind() != reflect.Ptr {
		v = v.Addr()
	}

	method := v.MethodByName(methodName)
	if !method.IsValid() {
		return []interface{}{
			fmt.Errorf("method %s not found", methodName),
		}
	}

	in := make([]reflect.Value, len(args))
	for i, arg := range args {
		in[i] = reflect.ValueOf(arg)
	}

	out := method.Call(in)
	result := make([]interface{}, len(out))
	for i, outVal := range out {
		result[i] = outVal.Interface()
	}

	return result
}

type Person struct {
	Name string
	Age  int
}

func createInstance(t reflect.Type) interface{} {
	return reflect.New(t).Interface()
}

func (cm *ConfigManager) LoadFromMap(data map[string]string) error {
	v := reflect.ValueOf(cm.config).Elem()
	t := v.Type()

	for i := 0; i < t.NumField(); i++ {
		field := v.Field(i)
		fieldType := t.Field(i)

		configKey := fieldType.Tag.Get("config")
		defaultValue := fieldType.Tag.Get("default")
		value := data[configKey]
		if value == "" {
			value = defaultValue
		}

		switch field.Kind() {
		case reflect.String:
			field.SetString(value)
		case reflect.Int:
			intValue, err := strconv.Atoi(value)
			if err != nil {
				return err
			}
			field.SetInt(int64(intValue))
		case reflect.Bool:
			boolValue, err := strconv.ParseBool(value)
			if err != nil {
				return err
			}
			field.SetBool(boolValue)
		}
	}
	return nil
}

func main() {
	config := &Config{}
	configManager := &ConfigManager{config: config}

	configData := map[string]string{
		"app_name": "test_app",
		"port":     "3000",
		"debug":    "false",
	}
	err := configManager.LoadFromMap(configData)
	if err != nil {
		panic(err)
	}
	fmt.Printf("app_name=%s, port=%d, debug=%t\n", config.AppName, config.Port, config.Debug)  // app_name=test_app, port=3000, debug=false

	results := configManager.CallMethod("UpdatePort", 8000)
	for _, result := range results {
		fmt.Println(result)
	}
	fmt.Printf("Update app_name=%s, port=%d, debug=%t\n", config.AppName, config.Port, config.Debug)  // Update app_name=test_app, port=8000, debug=false

	personType := reflect.TypeOf(Person{})
	instance := createInstance(personType)
	if person, ok := instance.(*Person); ok {
		person.Name = "John"
		person.Age = 30
		fmt.Printf("Person: %+v\n", person)  // Person: &{Name:John Age:30}
	}
}
```