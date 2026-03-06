---
title: File Upload
description: 文件上传
sidebar:
  order: 50
---

## 使用data url预览图片

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        #preview {
            max-width: 80%;
        }
    </style>
</head>
<body>
    <input type="file">
    <img src="" alt="" id="preview">
</html>
```

```js
const input = document.querySelector("input");
const preview = document.getElementById("preview");

input.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});
```
