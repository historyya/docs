---
title: Next.js CSR vs SSR vs SSG
description: Next.js CSR vs SSR vs SSG
sidebar:
  order: 1
---

## CSR

Client-Side Rendering

## SSR

Server-Side Rendering

## SSG

Static-Side Rendering (use generateStaticParams())

## ISR

Incremental Static Regeneration

```tsx
"use server";

export const createPost = async (formData: FormData) => {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  await prisma.post.create({
    data: {
      title,
      content,
      slug: title.toLowerCase().replace(/ /g, "-"),
    },
  });

  // look here
  revalidatePath("/blog");
};
```

## PPR

Partial Prerendering
