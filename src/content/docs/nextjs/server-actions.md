---
title: Server Actions
description: Server Actions
sidebar:
  order: 10
---

## forms

### 工作原理

```tsx
// src/app/register/page.tsx
export default function Page() {
  const handleRegister = async (formData: FormData) => {
    "use server";
    const account = formData.get("account") as string;
    const password = formData.get("password") as string;
    const form = Object.fromEntries(formData);
    console.log(form);
  };

  return (
    <div>
      <h2 className="text-2xl text-center">User Register</h2>
      <div className="flex flex-col gap-2 w-75 mx-auto mt-8">
        <form action={handleRegister} className="flex flex-col gap-2">
          <input
            className="border border-gray-300 rounded-md p-2"
            type="text"
            name="account"
            placeholder="帐号"
          />
          <input
            className="border border-gray-300 rounded-md p-2"
            type="password"
            name="password"
            placeholder="密码"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-md"
          >
            注册
          </button>
        </form>
      </div>
    </div>
  );
}
```

### 表单验证

```ts
// src/app/register/actions.ts
"use server";

import { z } from "zod";

const formSchema = z.object({
  account: z.string().min(5, "帐号不能为空"),
  password: z
    .string()
    .min(6, "密码必须在6-20个字符之间")
    .max(20, "密码必须在6-20个字符之间"),
});

export default async function registerUser(
  initialState: any,
  formData: FormData,
) {
  const validatedFields = formSchema.safeParse(Object.fromEntries(formData));

  if (!validatedFields.success) {
    const tree = z.treeifyError(validatedFields.error);

    const errors: Record<string, string[]> = {};

    Object.entries(tree.properties ?? {}).forEach(([key, value]) => {
      errors[key] = value.errors;
    });

    return {
      message: "表单校验失败",
      errors: errors,
    };
  }

  return { message: "注册成功", errors: {} };
}
```

```tsx
// src/app/register/page.tsx
"use client";

import { useActionState } from "react";
import registerUser from "./actions";

const initialState = {
  message: "",
  errors: {},
};

export default function Page() {
  const [state, formAction, pending] = useActionState(
    registerUser,
    initialState,
  );

  return (
    <div>
      <h2 className="text-2xl text-center">User Register</h2>
      <div className="flex flex-col gap-2 w-75 mx-auto mt-8">
        <form action={formAction} className="flex flex-col gap-2">
          <input
            className="border border-gray-300 rounded-md p-2"
            type="text"
            name="account"
            placeholder="帐号"
            required
          />
          {state?.errors?.account && (
            <p className="text-red-500 text-sm">{state.errors.account[0]}</p>
          )}

          <input
            className="border border-gray-300 rounded-md p-2"
            type="password"
            name="password"
            placeholder="密码"
            required
          />
          {state?.errors?.password && (
            <p className="text-red-500 text-sm">{state.errors.password[0]}</p>
          )}

          <p className="text-center">{state?.message}</p>

          <button
            disabled={pending}
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-md"
          >
            {pending ? "提交中..." : "注册"}
          </button>
        </form>
      </div>
    </div>
  );
}
```
