---
title: Elasticsearch
description: Elasticsearch
sidebar:
  order: 52
---

## 安装

```bash
# 重置密码
bin/elasticsearch-reset-password -u elastic

vim config/elasticsearch.yml
# TODO:禁用SSL

# 访问:http://localhost:9200/
```

### Kibana

#### 安装

```bash

# 访问:http://localhost:5601/
```

## 基本使用

```js
import { Client } from "@elastic/elasticsearch";
import fs from "node:fs";

const data = JSON.parse(fs.readFileSync("data.json", "utf-8"));

const client = new Client({
  node: "http://localhost:9200",
  auth: {
    username: "elastic",
    password: "123456",
  },
});

// 创建索引
// 注意：es创建索引时不能重复
const exists = await client.indices.exists({ index: "userInfo_index" });
if (!exists) {
  await client.indices.create({
    index: "userInfo_index",
    mappings: {
      properties: {
        id: { type: "text" },
        name: { type: "text", fields: { keyword: { type: "keyword" } } },
        email: { type: "text" },
        phone: { type: "text" },
        address: { type: "text" },
        city: { type: "text" },
        state: { type: "text" },
        createdAt: { type: "date" },
      },
    },
  });
  // 插入数据
  const operations = [];
  data.forEach((item) => {
    operations.push({
      index: {
        _index: "userInfo_index",
        _id: item.id,
      },
    });
    operations.push(item);
  });
  // 批量插入es
  await client.bulk({
    index: "userInfo_index",
    operations: operations,
  });
  console.log("insert data success");
}

// 1.创建索引和数据
const res = await client.index({
  index: "my_index",
  id: "my_document_id",
  document: {
    foo: "foo",
    bar: "bar",
  },
});

// 2.查询数据
const resp = await client.get({
  index: "my_index",
  id: "my_document_id",
});

console.log(resp);

// 3.查询全部数据
const searchResp = await client.search({
  index: "userInfo_index",
  body: {
    query: {
      match_all: {},
    },
    size: 100,
  },
});

console.log(searchResp.hits.hits, searchResp.hits.total);

// 模糊查询
const fuzzySearchResp = await client.search({
  index: "userInfo_index",
  body: {
    query: {
      match: {
        name: "张三", // 匹配张 或 三
      },
    },
  },
});

console.log(fuzzySearchResp.hits.hits, fuzzySearchResp.hits.total);

// 精确查询
const exactSearchResp = await client.search({
  index: "userInfo_index",
  body: {
    query: {
      term: {
        "name.keyword": "张三",
      },
    },
  },
});

console.log(exactSearchResp.hits.hits, exactSearchResp.hits.total);

// 组合查询
const boolSearchResp = await client.search({
  index: "userInfo_index",
  body: {
    query: {
      bool: {
        // must: 必须包含，must_not: 不包含，should: 可以匹配也可以不匹配，filter: 过滤
        must: {
          match: {
            name: "张三",
          },
        },
        filter: {
          range: {
            createdAt: {
              gte: "2025-01-01",
              lte: "2025-01-02",
            },
          },
        },
      },
    },
  },
});

console.log(boolSearchResp.hits.hits, boolSearchResp.hits.total);

// 聚合查询
const aggSearchResp = await client.search({
  index: "userInfo_index",
  aggs: {
    name_agg: {
      terms: {
        field: "name.keyword",
      },
    },
  },
});

console.log(aggSearchResp.aggregations.name_agg.buckets);

// 4.更新数据
const updateResp = await client.update({
  index: "my_index",
  id: "my_document_id",
  doc: {
    foo: "bar",
    new_field: "new value",
  },
});

console.log(updateResp);

// 5.删除数据
const deleteResp = await client.delete({
  index: "my_index",
  id: "my_document_id",
});

// 6.删除索引
await client.indices.delete({ index: "my_index" });
```
