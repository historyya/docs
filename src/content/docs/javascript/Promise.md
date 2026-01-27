---
title: Promise
description: Promise
sidebar:
  order: 1
---

## Async

```js
// async function 永远返回一个promise
async function fetchData() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    // return Promise.resolve(response.json());
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// 使用then()来获取返回值
fetchData().then((data) => {
  console.log(data);
});
```

```js
async function fetchAllData() {
  try {
    const [response1, response2] = await Promise.all([
      fetch("https://jsonplaceholder.typicode.com/posts"),
      fetch("https://jsonplaceholder.typicode.com/users"),
    ]);

    const [posts, users] = await Promise.all([
      response1.json(),
      response2.json(),
    ]);

    return {
      posts,
      users,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

fetchAllData().then((data) => {
  console.log(data);
});
```
