---
title: JWT
description: JWT
sidebar:
  order: 2
---

## Nodejs 实现签名

```ts
import crypto from "crypto";

function sign(info: any, key: string): string {
  const hmac = crypto.createHmac("sha256", key);
  hmac.update(info);
  return hmac.digest("hex");
}

const KEY = "123456";
console.log(sign("张三", KEY)); // 61fc987e0f5f5fb493d3c48fb84369330c5c1a1a6d15480b2288989e065944ba
```

## Nodejs 实现jwt

```ts
import crypto from "crypto";

function jwt(info: any, key: string): string {
  const header = {
    alg: "HS256",
    typ: "JWT",
  };
  const headerStr = Buffer.from(JSON.stringify(header)).toString("base64url");
  const payloadStr = Buffer.from(JSON.stringify(info)).toString("base64url");

  const unsignedToken = `${headerStr}.${payloadStr}`;

  const hmac = crypto.createHmac("sha256", key);
  hmac.update(unsignedToken);
  const signStr = hmac.digest("base64url");

  return `${unsignedToken}.${signStr}`;
}

const KEY = "123456";
const result = jwt({ name: "张三", age: 18 }, KEY);
console.log(result); // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoi5byg5LiJIiwiYWdlIjoxOH0.Tk8BUtOU485nkD4d4whQwWV9KYF4JCy-RO4pC2M0TSQ
```
