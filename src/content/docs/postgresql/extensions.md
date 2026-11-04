---
title: Extensions
description: extensions
sidebar:
    order: 6
---

## 扩展管理

```bash
-- 查看有哪些扩展
\dx
```

```sql
SELECT *
FROM pg_extension;
```

```sql
-- 安装扩展
CREATE EXTENSION "uuid-ossp";

-- 安装扩展指定schema
CREATE EXTENSION pgcrypto
WITH SCHEMA public;
```

```sql
-- 删除扩展
DROP EXTENSION pgcrypto;
```

## 全文搜索

```sql
-- 创建表，自动生成 tsvector
CREATE TABLE articles (
    id BIGSERIAL PRIMARY KEY,
    title TEXT,
    content TEXT,
    search_vector TSVECTOR
    GENERATED ALWAYS AS
    (
        to_tsvector(
            'simple',
            coalesce(title,'') || ' ' ||
            coalesce(content,'')
        )
    )
    STORED
);

-- 创建 GIN 索引
CREATE INDEX idx_articles_search
ON articles
USING GIN(search_vector);

-- 插入数据，会自动生成search_vector
INSERT INTO articles(title, content)
VALUES
(
'PostgreSQL全文搜索',
'PostgreSQL支持中文全文搜索'
);

-- 查看
SELECT search_vector
FROM articles;

-- 查询
SELECT to_tsvector(
'simple',
'PostgreSQL database'
);
-- 或
SELECT title,content
FROM articles
WHERE search_vector
@@
to_tsquery(
'simple',
'postgresql'
);
```

### 添加中文分词扩展

```bash
# run the container
docker run --name pgzhparser -d -e POSTGRES_PASSWORD=somepassword zhparser/zhparser:bookworm-16

# login the postgres database as user postgres
docker exec -it pgzhparser psql postgres postgres

```

```sql
-- create the extension
CREATE EXTENSION IF NOT EXISTS zhparser;
-- make test configuration using parser
CREATE TEXT SEARCH CONFIGURATION chinese (PARSER = zhparser);
-- add token mapping
ALTER TEXT SEARCH CONFIGURATION chinese ADD MAPPING FOR n,v,a,i,e,l WITH simple;
-- ts_parse
SELECT * FROM ts_parse('zhparser', 'hello world! 2010年保障房建设在全国范围内获全面启动，从中央到地方纷纷加大 了保障房的建设和投入力度 。2011年，保障房进入了更大规模的建设阶段。住房城乡建设部党组书记、部长姜伟新去年底在全国住房城乡建设工作会议上表示，要继续推进保障性安居工程建设。');
-- test to_tsvector
SELECT to_tsvector('chinese','“今年保障房新开工数量虽然有所下调，但实际的年度在建规模以及竣工规模会超以往年份，相对应的对资金的需求也会创历>史纪录。”陈国强说。在他看来，与2011年相比，2012年的保障房建设在资金配套上的压力将更为严峻。');
-- test to_tsquery
SELECT to_tsquery('chinese', '保障房资金压力');
```

## 地理位置

```sql
-- 查看是否可用PostGIS
SELECT *
FROM pg_available_extensions
WHERE name LIKE 'postgis%';

-- 进入数据库，创建 PostGIS 扩展
CREATE EXTENSION postgis;

-- 查看版本
SELECT PostGIS_Version();
```

## 向量数据库

安装 pgvector

```yaml
services:
    postgres:
        image: pgvector/pgvector:pg18
        container_name: postgres
        environment:
            POSTGRES_PASSWORD: password
            POSTGRES_DB: app
        ports:
            - "5432:5432"
```

进入数据库

```bash
docker exec -it postgres psql -U postgres
```

创建扩展

```bash
CREATE EXTENSION IF NOT EXISTS vector;
```

查看

```bash
\dx
```
