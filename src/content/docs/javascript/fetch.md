---
title: fetch
description: fetch
sidebar:
  order: 1
---

## 用法

```js
async function fetchData() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

fetchData();

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
