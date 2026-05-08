---
title: regexp
description: regexp
sidebar:
  order: 34
---

## 字符串处理

```go
package main

import (
	"fmt"
	"regexp"
	"strconv"
	"strings"
	"unicode/utf8"
)

// 验证邮箱
func validateEmail(email string) bool {
	pattern := `^[0-9a-z][_.0-9a-z-]{0,31}@([0-9a-z][0-9a-z-]{0,30}[0-9a-z]\.){1,4}[a-z]{2,4}$`
	return regexp.MustCompile(pattern).MatchString(email)
}

// 验证手机号
func validateMobile(mobile string) bool {
	pattern := `^1[3-9]\d{9}$`
	return regexp.MustCompile(pattern).MatchString(mobile)
}

// 处理用户输入
// input: zhangsan:18:zhangsan@qq.com
func processUserInput(input string) map[string]interface{} {
	result := make(map[string]interface{})

	cleanedInput := strings.TrimSpace(input)
	cleanedInput = strings.ToLower(cleanedInput)

	split := strings.Split(cleanedInput, ":")
	if len(split) < 2 {
		result["error"] = "输入格式错误"
		return result
	}
	result["name"] = split[0]
	age, err := strconv.Atoi(split[1])
	if err != nil {
		result["age"] = "无效年龄"
	} else {
		result["age"] = age
	}

	email := split[2]
	if !validateEmail(email) {
		result["email"] = "无效邮箱"
	} else {
		result["email"] = email
	}

	result["origin_len"] = len(input)
	result["cleaned_len"] = len(cleanedInput)
	result["rune_count"] = utf8.RuneCountInString(input)

	return result
}

func main() {
	userInputs := []string{
		"zhangsan:18:zhangsan@qq.com",
		"lisi:abc:lisiqq.com",
		"王五:19:wangwu@qq.com",
	}

	for _, input := range userInputs {
		result := processUserInput(input)
		for k, v := range result {
			if k == "error" {
				fmt.Println("Invalid Input:", v)
			} else {
				fmt.Printf("%s: %v\n", k, v)
			}
		}
	}
	fmt.Println()

	phones := []string{
		"13800000001",
		"12345678901",
	}
	for _, phone := range phones {
		if validateMobile(phone) {
			fmt.Println("Valid Mobile:", phone)
		} else {
			fmt.Println("Invalid Mobile:", phone)
		}
	}

	// 字符串构造器
	var builder strings.Builder
	builder.WriteString("Hello, ")
	country := []string{"China", "USA", "Japan"}
	for _, v := range country {
		builder.WriteString(v)
		builder.WriteString("\n")
	}
	fmt.Println(builder.String())

	// 字符串的替换和重复
	str := "重要通知：{message} | 重复显示：{repeat}"
	replacedStr := strings.Replace(str, "{message}", "系统维护通知", 1)
	repeatedStr := strings.Repeat("注意！", 3)
	finalStr := strings.Replace(replacedStr, "{repeat}", repeatedStr, 1)
	fmt.Println(finalStr)  // 重要通知：系统维护通知 | 重复显示：注意！注意！注意！

	// 字符串的前缀和后缀
	url := "https://example.com/api/v1/users"
	if strings.HasPrefix(url, "https://") {
		fmt.Println("Valid URL")
	}
}
```
