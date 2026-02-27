---
title: Table Operations
description: Table Operations
sidebar:
  order: 4
---

## 常用数据类型

### 数值类型

| 类型             | 存储大小 | 描述                 | 范围                             |
| :--------------- | :------- | :------------------- | :------------------------------- |
| smallint         | 2字节    | 小范围整数           | -32,768 到 +32,767               |
| integer          | 4字节    | 最常用整数           | -2,147,483,648 到 +2,147,483,647 |
| bigint           | 8字节    | 大范围整数           | -9.22e18 到 +9.22e18             |
| decimal(p,s)     | 可变     | 精确小数（财务数据） | 最高精度131,072位                |
| numeric(p,s)     | 可变     | 精确小数             | 同decimal，推荐使用              |
| real             | 4字节    | 单精度浮点数         | 6位十进制精度                    |
| double precision | 8字节    | 双精度浮点数         | 15位十进制精度                   |
| serial           | 4字节    | 自增整数             | 1 到 2,147,483,647               |
| bigserial        | 8字节    | 自增大整数           | 1 到 9.22e18                     |

#### 使用建议

- 普通ID用`integer`或`bigint`
- 金融用`numeric(10,2)` （10位总数，2位小数）
- 自增主键用`serial`或`bigserial`

### 字符串类型

| 类型       | 别名                 | 特点             | 使用场景             |
| ---------- | -------------------- | ---------------- | -------------------- |
| varchar(n) | character varying(n) | 变长，限制长度   | 用户名、标题         |
| char(n)    | character(n)         | 定长，空格填充   | 固定代码（如状态码） |
| text       | -                    | 推荐使用，无限长 | 描述、内容、备注     |
| bpchar     | -                    | 变长，去尾部空格 | 较少使用             |

#### 最佳实践

大多数情况用`text`，有明确长度限制时用`varchar(n)`

### 日期时间类型

| 类型        | 存储大小 | 格式示例                  | 说明            |
| ----------- | -------- | ------------------------- | --------------- |
| date        | 4字节    | 2026-01-15                | 仅日期          |
| time        | 8字节    | 15:30:50.123              | 仅时间          |
| timestamp   | 8字节    | 2026-01-15 15:30:50       | 常用，日期+时间 |
| timestamptz | 8字节    | 2026-01-15T15:30:50+08:00 | 推荐，带时区    |
| interval    | 16字节   | 3 days 02:00:00           | 时间间隔        |

#### 最佳实践

生产环境强烈推荐使用`timestamptz`

### 其他实用类型

| 类型         | 用途       | 示例                                 |
| ------------ | ---------- | ------------------------------------ |
| boolean      | 布尔值     | true/false                           |
| json / jsonb | JSON数据   | {"name": "张三", "age": 30}          |
| uuid         | 唯一标识符 | a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11 |
| array        | 数组       | {1,2,3}, {"a","b","c"}               |
| inet / cidr  | IP地址     | 192.168.1.1                          |

## 数据表操作

### 创建数据表

```sql
-- 创建用户表
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    age INTEGER,
    email VARCHAR(200) UNIQUE NOT NULL
);
```

```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    price NUMERIC(10,2) NOT NULL CHECK (price > 0),
    stock INTEGER DEFAULT 0 CHECK (stock >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 查看表信息

| 命令     | 说明           | 示例      |
| -------- | -------------- | --------- |
| \dt      | 查看所有表     | \dt       |
| \dt+     | 查看详细表信息 | \dt+      |
| \d 表名  | 查看表结构     | \d users  |
| \d+ 表名 | 查看表详细信息 | \d+ users |

### 数据操作CRUD

#### 插入数据

```sql
-- 插入单条数据
INSERT INTO users (username, full_name, email, age) 
VALUES ('zhangsan', '张三', 'zhangsan@example.com', 25);

-- 插入多条数据
INSERT INTO users (username, full_name, email, age) VALUES
('lisi', '李四', 'lisi@example.com', 28),
('wangwu', '王五', 'wangwu@example.com', 32),
('zhaoliu', '赵六', 'zhaoliu@example.com', 22);
```

#### 查询数据

```sql
-- 查询所有
SELECT * FROM users;

-- 选择特定列
SELECT id, full_name, email FROM users;

-- 条件查询
SELECT * FROM users WHERE age > 25;

-- 模糊查询
SELECT * FROM users WHERE full_name LIKE '张%';
-- ILIKE 不区分大小写
SELECT * FROM users WHERE email ILIKE '%EXample.com';

-- 分页
SELECT * FROM users ORDER BY id LIMIT 10 OFFSET 0;  -- 第1页
SELECT * FROM users ORDER BY id LIMIT 10 OFFSET 10; -- 第2页

-- 聚合函数
SELECT COUNT(*) FROM users;
SELECT AVG(age) as avg_age FROM users;
```

#### 更新数据

```sql
-- 更新单个字段
UPDATE users SET age = 26 WHERE full_name = 'zhangsan';

-- 更新多个字段
UPDATE users SET 
    age = 27,
    full_name = '李四四'
WHERE email = 'lisi@example.com';
```

#### 删除数据

```sql
-- 删除特定记录
DELETE FROM users WHERE username = 'zhangsan';


-- 清空表（谨慎使用！）
TRUNCATE TABLE users;
TRUNCATE TABLE users RESTART IDENTITY;  -- 同时重置自增ID
```
