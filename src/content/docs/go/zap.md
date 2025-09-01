---
title: zap库的使用
description: zap库的使用
---

## 基本使用

```go
package main

import (
	"go.uber.org/zap"
)

func dev() {
	logger, _ := zap.NewDevelopment()
	logger.Info("this is dev info logger")
	logger.Debug("this is dev debug logger")
	logger.Error("this is dev error logger")
	logger.Warn("this is dev warn logger")
	logger.Panic("this is dev panic logger")
	//logger.Fatal("this is dev fatal logger")
}

func test() {
	logger := zap.NewExample()
	logger.Info("this is test info logger")
	logger.Debug("this is test debug logger")
	logger.Error("this is test error logger")
	logger.Warn("this is test warn logger")
	logger.Panic("this is test panic logger")
	logger.Fatal("this is test fatal logger")
}

func prod() {
	logger, _ := zap.NewProduction()
	logger.Info("this is prod info logger")
	logger.Debug("this is prod debug logger")
	logger.Error("this is prod error logger")
	logger.Warn("this is prod warn logger")
	logger.Panic("this is prod panic logger")
	logger.Fatal("this is prod fatal logger")
}

func main() {
	//dev()
	//test()
	prod()
}
```

## 日志配置

```go
package main

import (
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

func main() {
	cfg := zap.NewDevelopmentConfig()
	cfg.Level = zap.NewAtomicLevelAt(zap.DebugLevel)                                  // 设置日志级别
	cfg.EncoderConfig.EncodeTime = zapcore.TimeEncoderOfLayout("2006-01-02 15:04:05") // 设置时间格式
	//cfg := zap.NewProductionEncoderConfig()
	logger, _ := cfg.Build()

	sugaredLogger := logger.Sugar()
	sugaredLogger.Infof("this is sugared logger: %s", "test")

	logger.Info("this is prod info logger")
	logger.Debug("this is prod debug logger")
	logger.Error("this is prod error logger")
	logger.Warn("this is prod warn logger")
}
```

## 结构化日志

```go
package main

import (
	"os"

	"go.uber.org/zap"
)

func main() {
	logger, _ := zap.NewDevelopment()
	logger.Info("this is info log",
		zap.String("version", "1.0.0"),
		zap.Int("pid", os.Getpid()),
		zap.Bool("debug", os.Getenv("DEBUG") == "true"),
	)
}
```

## 输出美化

```go
package main

import (
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

const (
	colorRed    = "\033[31m"
	colorGreen  = "\033[32m"
	colorYellow = "\033[33m"
	colorBlue   = "\033[34m"
	colorReset  = "\033[0m"
)

func encodeLevel(level zapcore.Level, enc zapcore.PrimitiveArrayEncoder) {
	switch level {
	case zapcore.InfoLevel:
		enc.AppendString(colorBlue + "INFO" + colorReset)
		return
	case zapcore.WarnLevel:
		enc.AppendString(colorYellow + "WARN" + colorReset)
		return
	case zapcore.ErrorLevel, zapcore.DPanicLevel, zapcore.PanicLevel, zapcore.FatalLevel:
		enc.AppendString(colorRed + "ERROR" + colorReset)
		return
	default:
		enc.AppendString(level.String())
	}
}

func main() {
	config := zap.NewDevelopmentConfig()
	config.EncoderConfig.EncodeLevel = encodeLevel
	logger, _ := config.Build()

	logger.Info("this is info log")
	logger.Debug("this is debug log")
	logger.Warn("this is warn log")
}
```

## 添加日志前缀

```go
package main

import (
	"os"

	"go.uber.org/zap"
	"go.uber.org/zap/buffer"
	"go.uber.org/zap/zapcore"
)

type myEncoder struct {
	zapcore.Encoder
}

func (m myEncoder) EncodeEntry(entry zapcore.Entry, fields []zapcore.Field) (*buffer.Buffer, error) {
	buf, err := m.Encoder.EncodeEntry(entry, fields)
	if err != nil {
		return nil, err
	}
	s := buf.String()
	buf.Reset()
	buf.AppendString("[GIN] " + s)
	return buf, nil
}

func main() {
	core := zapcore.NewCore(
		myEncoder{
			zapcore.NewConsoleEncoder(zap.NewDevelopmentEncoderConfig()),
		},
		os.Stdout,
		zapcore.InfoLevel,
	)
	logger := zap.New(core, zap.AddCaller())

	logger.Info("this is info log")
	logger.Debug("this is debug log")
	logger.Warn("this is warn log")
}
```

## 全局日志

```go
package main

import (
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

func InitLogger() {
	config := zap.NewDevelopmentConfig()
	config.EncoderConfig.EncodeTime = zapcore.TimeEncoderOfLayout("2006-01-02 15:04:05")
	logger, _ := config.Build()
	zap.ReplaceGlobals(logger)
}

func main() {
	InitLogger()
	zap.L().Info("this is info log")
	zap.S().Infof("this is info log: %s", "info")
}
```

## 日志双写

```go
package main

import (
	"os"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

// 方式一
func f1() {
	config := zap.NewDevelopmentConfig()
	config.EncoderConfig.EncodeTime = zapcore.TimeEncoderOfLayout("2006-01-02 15:04:05")
	consoleCore := zapcore.NewCore(
		zapcore.NewConsoleEncoder(config.EncoderConfig),
		os.Stdout,
		zapcore.InfoLevel,
	)
	file, _ := os.OpenFile("app.log", os.O_CREATE|os.O_APPEND|os.O_WRONLY, 0666)
	fileCore := zapcore.NewCore(
		zapcore.NewConsoleEncoder(config.EncoderConfig),
		file,
		zapcore.InfoLevel,
	)
	core := zapcore.NewTee(consoleCore, fileCore)
	logger := zap.New(core, zap.AddCaller())
	logger.Info("this is info log")
}

func f2() {
	config := zap.NewDevelopmentConfig()
	config.EncoderConfig.EncodeTime = zapcore.TimeEncoderOfLayout("2006-01-02 15:04:05")
	file, _ := os.OpenFile("app.log", os.O_CREATE|os.O_APPEND|os.O_WRONLY, 0666)
	core := zapcore.NewCore(
		zapcore.NewConsoleEncoder(config.EncoderConfig),
		zapcore.NewMultiWriteSyncer(os.Stdout, file),
		zapcore.InfoLevel,
	)
	logger := zap.New(core, zap.AddCaller())
	logger.Info("this is info log")
}

func main() {
	//f1()
	f2()
}
```

## 日志切片

```go
package main

import (
	"fmt"
	"os"
	"sync"
	"time"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

type myWriter struct {
	file        *os.File
	currentDate string
	mutex       sync.Mutex
}

func (m *myWriter) Write(b []byte) (n int, err error) {
	m.mutex.Lock()
	defer m.mutex.Unlock()

	now := time.Now().Format("2006-01-02")
	if m.currentDate == now {
		return m.file.Write(b)
	}
	if m.file != nil {
		m.file.Close()
	}
	fileName := fmt.Sprintf("logs/%s.log", now)
	file, _ := os.OpenFile(fileName, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	m.file = file
	m.currentDate = now
	return file.Write(b)
}

func main() {
	config := zap.NewDevelopmentConfig()
	config.EncoderConfig.EncodeTime = zapcore.TimeEncoderOfLayout("2006-01-02 15:04:05")
	core := zapcore.NewCore(
		zapcore.NewConsoleEncoder(config.EncoderConfig),
		zapcore.NewMultiWriteSyncer(os.Stdout, zapcore.AddSync(&myWriter{})),
		zapcore.InfoLevel,
	)
	logger := zap.New(core, zap.AddCaller())
	for i := 0; i < 10; i++ {
		logger.Sugar().Infof("this is %d log", i)
		time.Sleep(time.Second)
	}
}
```

### 按照Level分片

```go
package main

import (
	"os"

	"go.uber.org/zap"
	"go.uber.org/zap/buffer"
	"go.uber.org/zap/zapcore"
)

type levelEncoder struct {
	zapcore.Encoder
	errFile *os.File
}

func (m levelEncoder) EncodeEntry(entry zapcore.Entry, fields []zapcore.Field) (*buffer.Buffer, error) {
	buf, err := m.Encoder.EncodeEntry(entry, fields)
	if err != nil {
		return nil, err
	}
	switch entry.Level {
	case zapcore.ErrorLevel, zapcore.PanicLevel, zapcore.FatalLevel:
		if m.errFile == nil {
			file, _ := os.OpenFile("error.log", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0666)
			m.errFile = file
		}
		m.errFile.WriteString(buf.String())
	}
	return buf, nil
}

func main() {
	config := zap.NewDevelopmentConfig()
	config.EncoderConfig.EncodeTime = zapcore.TimeEncoderOfLayout("2006-01-02 15:04:05")
	encoder := levelEncoder{
		Encoder: zapcore.NewConsoleEncoder(config.EncoderConfig),
	}
	core := zapcore.NewCore(encoder, zapcore.AddSync(os.Stdout), zapcore.DebugLevel)
	logger := zap.New(core, zap.AddCaller())

	logger.Info("this is info log")
	logger.Debug("this is debug log")
	logger.Warn("this is warn log 1")
	logger.Warn("this is warn log 2")
}
```

## 功能整合

1. 可以设置级别
2. 时间格式化
3. 输出美化
4. 日志前缀
5. 日志双写
6. 日志时间分片，error日志单独存放

```go
package main

import (
	"fmt"
	"os"
	"time"

	"go.uber.org/zap"
	"go.uber.org/zap/buffer"
	"go.uber.org/zap/zapcore"
)

const (
	colorRed    = "\033[31m"
	colorGreen  = "\033[32m"
	colorYellow = "\033[33m"
	colorReset  = "\033[0m"
)

// 支持时间分片和level分片
type logEncoder struct {
	zapcore.Encoder
	file        *os.File
	errFile     *os.File
	currentDate string
}

func myEncodeLevel(level zapcore.Level, enc zapcore.PrimitiveArrayEncoder) {
	switch level {
	case zapcore.InfoLevel:
		enc.AppendString(colorGreen + "INFO" + colorReset)
		return
	case zapcore.WarnLevel:
		enc.AppendString(colorYellow + "WARN" + colorReset)
		return
	case zapcore.ErrorLevel, zapcore.DPanicLevel, zapcore.PanicLevel, zapcore.FatalLevel:
		enc.AppendString(colorRed + "ERROR" + colorReset)
		return
	default:
		enc.AppendString(level.String())
	}
}

func (e *logEncoder) EncodeEntry(entry zapcore.Entry, fields []zapcore.Field) (*buffer.Buffer, error) {
	// 先调用原始的Encoder方法生成日志行
	buf, err := e.Encoder.EncodeEntry(entry, fields)
	if err != nil {
		return nil, err
	}
	// 日志前缀
	data := buf.String()
	buf.Reset()
	buf.AppendString("[MyApp] " + data)
	data = buf.String()
	// 时间分片
	now := time.Now().Format("2006-01-02")
	if e.currentDate != now {
		os.MkdirAll(fmt.Sprintf("logs/%s", now), 0666)
		// 时间不同，先创建目录
		name := fmt.Sprintf("logs/%s/out.log", now)
		file, _ := os.OpenFile(name, os.O_CREATE|os.O_APPEND|os.O_WRONLY, 0666)
		e.file = file
		e.currentDate = now
	}
	// level分片
	switch entry.Level {
	case zapcore.ErrorLevel, zapcore.PanicLevel, zapcore.FatalLevel:
		if e.errFile == nil {
			name := fmt.Sprintf("logs/%s/err.log", now)
			file, _ := os.OpenFile(name, os.O_CREATE|os.O_APPEND|os.O_WRONLY, 0666)
			e.errFile = file
		}
		e.errFile.WriteString(buf.String())
	}
	if e.currentDate == now {
		e.file.WriteString(data)
	}
	return buf, nil
}

func InitLogger() *zap.Logger {
	config := zap.NewDevelopmentConfig()
	config.EncoderConfig.EncodeTime = zapcore.TimeEncoderOfLayout("2006-01-02 15:04:05")
	config.EncoderConfig.EncodeLevel = myEncodeLevel
	encoder := &logEncoder{
		Encoder: zapcore.NewConsoleEncoder(config.EncoderConfig),
	}
	core := zapcore.NewCore(encoder, zapcore.AddSync(os.Stdout), zapcore.InfoLevel)
	logger := zap.New(core, zap.AddCaller())
	zap.ReplaceGlobals(logger)
	return logger
}

func main() {
	logger := InitLogger()
	logger.Info("this is info log")
	logger.Warn("this is warn log")
	logger.Error("this is error log 1")
	logger.Error("this is error log 2")
	zap.S().Infof("this is a simple log %d", 1)
}
```
