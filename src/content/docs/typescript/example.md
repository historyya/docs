---
title: 代码实战
description: 代码实战
sidebar:
  order: 10
---

## 代码雨

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>vite-ts</title>
  </head>
  <body>
    <canvas id="canvas"></canvas>
    <script type="module" src="/src/canvas.ts"></script>
  </body>
</html>
```

```css
* {
  padding: 0;
  margin: 0;
  overflow: hidden;
}
```

```ts
import "./style.css";

let canvas = document.querySelector("#canvas") as HTMLCanvasElement;
let ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

const dpr = window.devicePixelRatio || 1;

function resize() {
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;

  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";

  ctx.scale(dpr, dpr);

  initDrops();
}

window.addEventListener("resize", resize);

const fontSize = 14;
let columns: number;
let drops: number[];

function initDrops() {
  columns = Math.floor(window.innerWidth / fontSize);
  drops = Array(columns)
    .fill(0)
    .map(() => Math.random() * window.innerHeight);
}

resize();

const text = "01アイウエオHelloCanvas";

function rain() {
  ctx.fillStyle = "rgba(0,0,0,0.05)";
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

  ctx.fillStyle = "#0F0";
  ctx.font = `${fontSize}px monospace`;

  drops.forEach((y, i) => {
    const char = text[Math.floor(Math.random() * text.length)];
    const x = i * fontSize;

    ctx.fillText(char, x, y);

    if (y > window.innerHeight || Math.random() > 0.99) {
      drops[i] = 0;
    } else {
      drops[i] += fontSize;
    }
  });

  requestAnimationFrame(rain);
}

rain();
```

## TS封装localStorage并支持过期时间

```ts
interface Data<T> {
  value: T;
  [Dictionaries.Expire]: Expire;
}

type Expire = number | Dictionaries.Permanent;

interface Result<T> {
  message: string;
  value: T | null;
}

interface IStorage {
  get: <T>(key: string) => Result<T>;
  set: <T>(key: string, value: T, expire?: Expire) => void;
  delete: (key: string) => void;
  clear: () => void;
}

enum Dictionaries {
  Permanent = "permanent", // 永久
  Expire = "__expire__",
}

export class Storage implements IStorage {
  get<T>(key: string): Result<T> {
    const data = localStorage.getItem(key);
    if (data) {
      const data1: Data<T> = JSON.parse(data);
      if (
        typeof data1[Dictionaries.Expire] === "number" &&
        data1[Dictionaries.Expire] < new Date().getTime()
      ) {
        this.delete(key);
        return {
          message: `${key}已过期`,
          value: null,
        };
      } else {
        return {
          message: "数据获取成功",
          value: data1.value,
        };
      }
    } else {
      return {
        message: "数据不存在",
        value: null,
      };
    }
  }

  set<T>(key: string, value: T, expire: Expire = Dictionaries.Permanent) {
    const data = {
      value, // 存储的值
      [Dictionaries.Expire]: expire, // 过期时间
    };
    localStorage.setItem(key, JSON.stringify(data));
  }

  delete(key: string) {
    localStorage.removeItem(key);
  }

  clear() {
    localStorage.clear();
  }
}
```
