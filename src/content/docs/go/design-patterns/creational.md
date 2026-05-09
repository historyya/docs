---
title: 创建型模式
description: 创建型模式
sidebar:
  order: 90
---

:::tip
创建型模式是一类用于处理对象创建的设计模式。
:::

```go
package main

type Obj struct {
	Name string
	Age  int
	Addr string
}

func NewObj(name string, age int, addr string) *Obj {
	return &Obj{
		Name: name,
		Age:  age,
		Addr: addr,
	}
}

func main() {
	obj1 := Obj{
		Name: "张三",
		Age:  18,
		Addr: "北京",
	}

	var obj2 Obj
	obj2.Name = "李四"
	obj2.Age = 20
	obj2.Addr = "上海"
}
```

## 单例模式

确保一个类只有一个实例，并提供一个全局访问点。

```go
package main

import "fmt"

type DB struct {
	DSN string
}

var GlobelDB *DB

func InitDB(dsn string) *DB {
	return &DB{
		DSN: dsn,
	}
}

func GetDB() *DB {
	if GlobelDB == nil {
		GlobelDB = InitDB("root:123456@tcp(127.0.0.1:3306)/test")
	}
	return GlobelDB
}

func main() {
	d1 := GetDB()
	d2 := GetDB()

	// d1 和 d2 的内存地址是一样的
	fmt.Printf("%p\n", d1)
	fmt.Printf("%p\n", d2)
}
```

优化：增加锁

```go
package main

import (
	"fmt"
	"sync"
)

type DB struct {
	DSN string
}

var GlobelDB *DB

func InitDB(dsn string) *DB {
	return &DB{
		DSN: dsn,
	}
}

var once sync.Once

func GetDB() *DB {
	once.Do(func() {
		GlobelDB = InitDB("root:123456@tcp(127.0.0.1:3306)/test")
	})

	return GlobelDB
}

func main() {
	d1 := GetDB()
	d2 := GetDB()

	fmt.Printf("%p\n", d1)
	fmt.Printf("%p\n", d2)
}
```

## 简单工厂模式

特点：一个工厂类负责创建所有产品，通过条件判断决定创建哪种产品。

适用场景：产品种类较少，创建逻辑简单。

```go
package main

import "fmt"

type Pay interface {
	PayQRCode(price int64) (string, error)
}

type AliPay struct {
}

func (a *AliPay) PayQRCode(price int64) (string, error) {
	return "AliPay", nil
}

type WechatPay struct {
}

func (w *WechatPay) PayQRCode(price int64) (string, error) {
	return "WechatPay", nil
}

type PayType int8

const (
	AliPayType    PayType = 1
	WechatPayType PayType = 2
)

func NewPay(payType PayType) Pay {
	switch payType {
	case AliPayType:
		return &AliPay{}
	case WechatPayType:
		return &WechatPay{}
	default:
		return nil
	}
}

func main() {
	aliPay := NewPay(AliPayType)
	fmt.Println(aliPay.PayQRCode(100))

	wechatPay := NewPay(WechatPayType)
	fmt.Println(wechatPay.PayQRCode(200))
}
```

## 工厂方法模式

特点：每个产品对应一个工厂类，符合开闭原则。

适用场景：产品种类较多，创建逻辑复杂。

```go
package main

type Pay interface {
	PayQRCode(price int64) (string, error)
}

type AliPay struct {
}

func (a *AliPay) PayQRCode(price int64) (string, error) {
	return "AliPay", nil
}

type WechatPay struct {
}

func (w *WechatPay) PayQRCode(price int64) (string, error) {
	return "WechatPay", nil
}

type UnionPay struct {
}

func (u *UnionPay) PayQRCode(price int64) (string, error) {
	return "UnionPay", nil
}

type PayFactory interface {
	CreatePay() Pay
}

type AliPayFactory struct {
}

func (a *AliPayFactory) CreatePay() Pay {
	return &AliPay{}
}

type WechatPayFactory struct {
}

func (w *WechatPayFactory) CreatePay() Pay {
	return &WechatPay{}
}

type UnionPayFactory struct {
}

func (u *UnionPayFactory) CreatePay() Pay {
	return &UnionPay{}
}

func main() {
	aliPayFactory := AliPayFactory{}
	aliPay := aliPayFactory.CreatePay()
	aliPay.PayQRCode(100)

	wechatPayFactory := WechatPayFactory{}
	wechatPay := wechatPayFactory.CreatePay()
	wechatPay.PayQRCode(200)

	unionPayFactory := UnionPayFactory{}
	unionPay := unionPayFactory.CreatePay()
	unionPay.PayQRCode(300)
}
```

## 抽象工厂模式

特点：每个工厂类可以创建一组相关产品，强调产品族的概念。

适用场景：需要创建一组相关对象的场景。

```go
package main

// 支付
type Pay interface {
	PayQRCode(price int64) (string, error)
}

type AliPay struct {
}

func (a *AliPay) PayQRCode(price int64) (string, error) {
	return "AliPay", nil
}

type WechatPay struct {
}

func (w *WechatPay) PayQRCode(price int64) (string, error) {
	return "WechatPay", nil
}

// 退款
type Refund interface {
	ProductRefund(no string) error
}

type AliRefund struct {
}

func (a *AliRefund) ProductRefund(no string) error {
	return nil
}

type WechatRefund struct {
}

func (w *WechatRefund) ProductRefund(no string) error {
	return nil
}

type PayFactory interface {
	CreatePay() Pay
	CreateRefund() Refund
}

type AliPayFactory struct {
}

func (a *AliPayFactory) CreatePay() Pay {
	return &AliPay{}
}

func (a *AliPayFactory) CreateRefund() Refund {
	return &AliRefund{}
}

type WechatPayFactory struct {
}

func (w *WechatPayFactory) CreatePay() Pay {
	return &WechatPay{}
}

func (w *WechatPayFactory) CreateRefund() Refund {
	return &WechatRefund{}
}

func main() {
	aliPayFactory := AliPayFactory{}
	aliPay := aliPayFactory.CreatePay()
	aliPay.PayQRCode(100)
	aliPayFactory.CreateRefund().ProductRefund("123")

	wechatPayFactory := WechatPayFactory{}
	wechatPay := wechatPayFactory.CreatePay()
	wechatPay.PayQRCode(200)
	wechatPayFactory.CreateRefund().ProductRefund("456")
}
```

## 建造者模式

```go
package main

type House struct {
	Door   string
	Window string
}

type HouseBuilder interface {
	buildDoor(value string)
	buildWindow(value string)
	getHouse() *House
}

type ProjectManager struct {
	house *House
}

func NewProjectManager() *ProjectManager {
	return &ProjectManager{
		house: &House{},
	}
}

func (p *ProjectManager) buildDoor(value string) {
	p.house.Door = value
}

func (p *ProjectManager) buildWindow(value string) {
	p.house.Window = value
}

func (p *ProjectManager) getHouse() *House {
	return p.house
}

type Boss struct {
	builder HouseBuilder
}

func NewBoss(pm *ProjectManager) *Boss {
	return &Boss{
		builder: pm,
	}
}

func (b *Boss) constructHouse() *House {
	b.builder.buildDoor("door")
	b.builder.buildWindow("window")
	return b.builder.getHouse()
}

func main() {
	pm := NewProjectManager()
	boss := NewBoss(pm)
	boss.constructHouse()

	// pm.buildDoor("door")
	// pm.buildWindow("window")
	// pm.getHouse()
}
```

## 原型模式

```go
package main

import "fmt"

type ProtoTyoe interface {
	Clone() ProtoTyoe
}

type Student struct {
	Name string
	Age  int
}

func (s *Student) Clone() ProtoTyoe {
	return &Student{
		Name: s.Name,
		Age:  s.Age,
	}
}

func main() {
	s1 := Student{
		Name: "张三",
		Age:  18,
	}

	s2 := s1.Clone().(*Student)
	s2.Name = "李四"
	s2.Age = 20

	fmt.Println(s1)
	fmt.Println(s2)
}
```
