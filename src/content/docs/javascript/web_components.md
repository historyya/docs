---
title: Web Component
description: Web Component
sidebar:
  order: 50
---

## 基本使用

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + TS</title>
    <script src="./index.ts" type="module"></script>
  </head>
  <body>
    <wu-jie name="张三"></wu-jie>
    <div>Hello</div>

    <template id="wujie">
      <style>
        div {
          background: red;
        }
      </style>
      <div>Here</div>
    </template>
  </body>
</html>
```

```ts
window.onload = () => {
  class Wujie extends HTMLElement {
    constructor() {
      super();

      // shadowdom 样式隔离
      const dom = this.attachShadow({ mode: "open" });
      const templateEl = document.querySelector(
        "#wujie"
      ) as HTMLTemplateElement;

      dom.appendChild(templateEl.content.cloneNode(true));

      console.log(this.getAttr("name"));
    }

    private getAttr(attr: string) {
      return this.getAttribute(attr);
    }

    // 生命周期
    connectedCallback() {
      console.log("类似于Vue 的mounted");
    }

    disconnectedCallback() {
      console.log("类似于Vue 的destory");
    }

    attributeChangedCallback(name: any, oldValue: any, newValue: any) {
      console.log(name, oldValue, newValue);
      console.log("跟Vue 的watch类型，有属性发生变化自动触发");
    }
  }

  // 类似vue组件，只是用原生js写的
  window.customElements.define("wujie-app", Wujie); // 挂载完成
};
```