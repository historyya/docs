---
title: Cookie Session JWT的区别和用途
description: Cookie Session JWT的区别和用途
---

## 用户状态

### Cookie

前端发起登录请求，后端校验通过后，会通过`Set-Cookie` 将cookie保存到浏览器端，后续所有的请求都会自动携带上cookie.

### Session

前端发起登录请求，后端校验通过后，会在服务器端创建一个`SessionID`和`Max-Age`，后端会通过`Set-Cookie`将`SessionID`放在cookie中，再把过期时间设置为cookie的有效期，后续前端请求会自动携带上cookie中的`SessionID`，后端拿到cookie中的`SessionID`就可以得到当前这条请求对应的session信息.

[示例代码](https://www.bilibili.com/video/BV1ob4y1Y7Ep/)

### JWT

前端发起登录请求，后端校验通过后，会生产一个jwt的字符串返回给前端，后续前端请求时，需要在请求头添加`Authorization`属性，后端会拿到token进行解密，校验通过后进行放行.
