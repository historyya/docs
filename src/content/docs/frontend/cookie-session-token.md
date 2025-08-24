---
title: Cookie Session JWT的区别和用途
description: Cookie Session JWT的区别和用途
---

## 用户状态

### Cookie

前端发起登录请求，后端校验通过后，前端会通过`Set-Cookie` 将cookie保存到浏览器端，后续所有的请求都会自动携带上cookie.

### Session

前端发起登录请求，后端校验通过后，会往session中存入当前的用户信息，会在响应头中存入`Set-Cookie`的属性，再把当前session的唯一ID放在属性中，前端会自动在cookie中存入当前的session ID，后续前端请求会自动携带上cookie的信息，后端拿到cookie中的session ID就可以得到当前这条请求对应的session信息.

### JWT

前端发起登录请求，后端校验通过后，会创建一个jwt的字符串，返回给前端，后续前端请求时，需要在请求头添加`Authorization`属性，后端会拿到token进行解密，校验通过后进行放行.
