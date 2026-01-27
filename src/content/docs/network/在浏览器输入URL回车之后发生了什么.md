---
title: 在浏览器输入URL回车之后发生了什么
description: 在浏览器输入URL回车之后发生了什么
sidebar:
  order: 1
---

## 步骤

1. URL解析：判断URL是否合法
2. DNS解析：将域名解析成ip，找到具体的服务器
3. 建立TCP连接：TPC三次握手，保证通道安全可靠
4. 发送HTTP请求
5. 服务器处理请求，返回HTTP响应：返回状态码200，响应体HTML、JSON、文件等
6. 浏览器解析HTML、CSS、JS
7. 页面渲染完成
