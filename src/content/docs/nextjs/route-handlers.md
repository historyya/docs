---
title: Route Handlers
description: Route Handlers
sidebar:
  order: 3
---

## 路由处理

目录结构

```txt
app/
├── api
│   ├── user
│   │   ├── route.ts
│   │   └── [id]
│   │       └── route.ts
│   └── login
│       └── route.ts
```

```ts
// src/app/api/user/route.ts
import { NextRequest, NextResponse } from "next/server";

// POST /api/user
export async function POST(request: NextRequest) {
  // 接收formData数据
  // const body = await request.formData();

  // 接收text数据
  // const body = await request.text();

  // 接收arrayBuffer数据
  // const body = await request.arrayBuffer();

  // 接收blob数据
  // const body = await request.blob();

  // 接收json数据
  const body = await request.json();
  console.log(body);

  return NextResponse.json(
    {
      status: 200,
      message: "success",
      data: body,
    },
    { status: 200 },
  );
}

// GET /api/user?id=123
export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams;
  console.log(query.get("id"));

  return NextResponse.json({
    status: 200,
    message: "success",
    data: query,
  });
}

export async function PUT(request: NextRequest) {}

export async function DELETE(request: NextRequest) {}
```

```ts
// src/app/api/user/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  console.log(id);

  return NextResponse.json({
    status: 200,
    message: "success",
    data: id,
  });
}
```

## cookies

```ts
// src/app/api/login/route.ts
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// 处理登录请求成功后设置cookie
export async function POST(request: NextRequest) {
  const body = await request.json();
  if (body.username === "admin" && body.password === "password") {
    // 获取cookie值
    const cookieStore = await cookies();
    cookieStore.set("token", "your_token_value", {
      httpOnly: true, // 只允许在服务器端访问
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 1, // 1小时过期
    });

    return NextResponse.json(
      {
        code: 1,
        message: "success",
      },
      {
        status: 200,
      },
    );
  }

  return NextResponse.json(
    {
      code: 0,
      message: "failed",
    },
    {
      status: 401,
    },
  );
}

// 检查登录状态
export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  if (token && token.value === "your_token_value") {
    return NextResponse.json(
      {
        code: 1,
        message: "success",
      },
      { status: 200 },
    );
  }

  return NextResponse.json(
    {
      code: 0,
      message: "failed",
    },
    {
      status: 401,
    },
  );
}
```

前端

```tsx
// src/app/login/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code === 1) {
          router.push("/dashboard");
        } else {
          alert("登录失败");
        }
      });
  };

  return (
    <div>
      <h2>Login Page</h2>
      <div className="mt-10 flex flex-col items-center justify-center gap-4">
        <Input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-[250px]"
          placeholder="请输入用户名"
        />
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-[250px]"
          placeholder="请输入密码"
        />
        <Button onClick={handleLogin}>登录</Button>
      </div>
    </div>
  );
}
```

```tsx
// src/app/dashboard/page.tsx
"use client";

import { redirect } from "next/navigation";
import { useEffect } from "react";

const checkLogin = async () => {
  const response = await fetch("/api/login");
  const data = await response.json();
  if (data.code === 1) {
    return true;
  } else {
    redirect("/login");
  }
};

export default function Page() {
  useEffect(() => {
    checkLogin();
  }, []);

  return (
    <div>
      <h2>Dashboard Page</h2>
    </div>
  );
}
```
