---
title: Express+Frontend
description: Express+Frontend
sidebar:
  order: 6
---

## Server

```js
// 1. 引入express
const express = require('express')

// 2. 创建应用对象
const app = express()
const port = 8000

// 3. 创建路由规则
// request 是对请求报文的封装
// response 是对相应报文的封装
app.get('/', (request, response) => {
    // 设置响应头，设置允许跨域
    response.setHeader('Access-Control-Allow-Origin', '*')
    // 设置响应体
    response.send('Hello')
})

app.post('/', (request, response) => {
    // 设置响应头，设置允许跨域
    response.setHeader('Access-Control-Allow-Origin', '*')
    response.setHeader('Access-Control-Allow-Headers', '*')
    // 设置响应体
    response.send('Hello POST Request')
})

app.all('/json-server', (request, response) => {
    // 设置响应头，设置允许跨域
    response.setHeader('Access-Control-Allow-Origin', '*')
    response.setHeader('Access-Control-Allow-Headers', '*')
    const data = {
        name: "username",
    }
    // 设置响应体
    response.send(JSON.stringify(data))
})

app.listen(port, () => {
    console.log('listening on port:' + port)
})
```

## Ajax GET

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>AJAX GET 请求</title>
    <style>
        #result {
            width: 300px;
            height: 200px;
            border: 1px solid #ccc;
        }
    </style>
</head>
<body>
<button>点击发送请求</button>
<div id="result"></div>

<script>
    const btn = document.getElementsByTagName("button")[0];
    const text = document.getElementById("result");
    btn.onclick = function () {
        // 创建对象
        const xhr = new XMLHttpRequest()
        // 初始化 设置请求方法和 url
        xhr.open("GET", 'http://localhost:8000/')
        // 发送
        xhr.send()
        // 事件绑定 处理服务端放回的结果
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    console.log(xhr.status)
                    console.log(xhr.statusText)
                    console.log(xhr.getAllResponseHeaders())
                    console.log(xhr.response)

                    text.innerHTML = xhr.response
                }
            }
        }
    }
</script>
</body>
</html>
```

## Ajax POST

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>AJAX POST 请求</title>
    <style>
        #result {
            width: 300px;
            height: 200px;
            border: 1px solid #ccc;
        }
    </style>
</head>
<body>
<button>点击发送请求</button>
<div id="result"></div>

<script>
    const btn = document.getElementsByTagName("button")[0];
    const text = document.getElementById("result");
    btn.onclick = function () {
        const xhr = new XMLHttpRequest()
        xhr.open("POST", 'http://localhost:8000/')
        // 设置请求头
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")

        xhr.send("username=admin&password=123456")
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    text.innerHTML = xhr.response
                }
            }
        }
    }
</script>
</body>
</html>
```

## Ajax POST JSON

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>AJAX JSON</title>
    <style>
        #result {
            width: 300px;
            height: 200px;
            border: 1px solid #ccc;
        }
    </style>
</head>
<body>
<button>点击发送请求</button>
<div id="result"></div>

<script>
    const btn = document.getElementsByTagName("button")[0];
    const text = document.getElementById("result");
    btn.onclick = function () {
        const xhr = new XMLHttpRequest()
        // 3. 设置响应体数据的类型
        xhr.responseType = "json"
        xhr.open("GET", 'http://localhost:8000/json-server')
        xhr.send()
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    // 1
                    // text.innerHTML = xhr.response
                    // 2
                    // let data = JSON.parse(xhr.responseText)
                    // console.log(data)
                    // 3
                    console.log(xhr.response)
                }
            }
        }
    }
</script>
</body>
</html>
```

## jQuery Ajax

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>jQuery 发送 AJAX 请求</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css">
</head>
<body>
<div class="container">
    <h2 class="page-header">jQuery 发送 AJAX 请求</h2>
    <button class="btn btn-primary">GET</button>
    <button class="btn btn-danger">POST</button>
    <button class="btn btn-info">通用型方法ajax</button>
</div>
<script src="https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js"></script>
<script>
    $('button').eq(0).click(function () {
        $.get('http://localhost:8000/', {
            username: "admin",
        }, function (data) {
            console.log(data);
        }, 'json')
    })

    $('button').eq(1).click(function () {
        $.post('http://localhost:8000/', {
            username: "admin",
        }, function (data) {
            console.log(data);
        })
    })

    $('button').eq(2).click(function () {
        $.ajax({
            url: 'http://localhost:8000/json-server',
            data: {
                username: "admin"
            },
            type: "GET",
            dataType: 'json',
            timeout: 3000,
            success: function (data) {
                console.log(data)
            },
            error: function () {
                console.log("Error")
            }

        })
    })
</script>

</body>
</html>
```
