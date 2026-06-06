---
title: css module
description: css module
sidebar:
  order: 60
---

## 在Vite中使用css module

搭配css预处理使用

```bash
# 安装其中一个即可
npm install less -D
npm install sass -D
npm install stylus -D
```

```css
// src/components/Button/index.module.scss
.button {
  color: red;
}
```

```tsx
// src/components/Button/index.tsx
import styles from "./index.module.scss";

export default function Button() {
  return <button className={styles.button}>按钮</button>;
}
```

编译结果：

```html
<!-- 通过在类名前添加一个唯一的哈希值，来实现样式隔离 -->
<button class="button_pmkzx_6">按钮</button>
```

### 修改css module规则

```ts
// vite.config.ts
export default defineConfig({
  css: {
    modules: {
      localsConvention: "dashes",
      generateScopedName: "[local]_[hash:base64:5]", // 只保留类名和哈希值：button_pmkzx_6
    },
  },
});
```

### 全局类名

```css
:global(.button) {
  background: blue;
  width: 100px;
  height: 100px;
}
```
