---
title: User Manager
description: User Manager
sidebar:
  order: 2
---

## 用户管理实战

### 创建用户

```sql
-- 创建用户（自动拥有LOGIN权限）
CREATE USER test WITH PASSWORD 'password123';

-- 创建角色（默认无LOGIN权限）
CREATE ROLE admin_role;

-- 两者可以互相转换
ALTER ROLE test NOLOGIN;  -- 用户变角色
ALTER ROLE admin_role LOGIN;  -- 角色变用户
```

### 查看用户信息

```sql
-- 查看所有用户/角色
\du
\du+  -- 查看详细信息

-- 查看特定用户
SELECT * FROM pg_roles WHERE rolname = 'test';

-- 查看用户权限
SELECT 
    grantee,
    table_schema,
    table_name,
    privilege_type
FROM information_schema.table_privileges 
WHERE grantee = 'test';
```

### 修改用户属性

```sql
-- 修改密码
ALTER USER test WITH PASSWORD 'new_password';

-- 重命名用户
ALTER USER test RENAME TO new_user;
```

### 删除用户

```sql
-- 删除用户（无依赖时）
DROP USER test;

-- 安全删除（检查依赖）
DROP USER IF EXISTS test;

-- 强制删除（转移对象所有权）
-- 先转移test用户的所有对象
REASSIGN OWNED BY test TO postgres;
-- 再删除用户拥有的权限
DROP OWNED BY test;
-- 最后删除用户
DROP USER test;
```

## 认证配置（pg_hba.conf）

### 理解认证方法

| 方法          | 说明         | 安全性        |
| ------------- | ------------ | ------------- |
| trust         | 无需密码     | ❌ 最低       |
| password      | 明文密码     | ⚠️ 低         |
| md5           | MD5加密      | ✅ 中         |
| scram-sha-256 | SHA256加密   | 🛡️ 高（推荐） |
| peer          | 操作系统用户 | ✅ 高（本地） |
| cert          | SSL证书      | 🛡️ 最高       |

### Docker环境配置

```bash frame="none"
# 1. 进入容器
docker exec -it postgresql bash

# 2. 查看当前pg_hba.conf
cat /var/lib/postgresql/data/pg_hba.conf

# 3. 安全配置示例
cat > /tmp/pg_hba.conf << 'EOF'
# TYPE  DATABASE        USER            ADDRESS                 METHOD

# 本地socket连接（需要密码）
local   all             all                                     scram-sha-256

# 本地网络连接
host    all             all             127.0.0.1/32            scram-sha-256
host    all             all             ::1/128                 scram-sha-256

# 应用服务器连接
host    app_db          app_user        192.168.1.0/24          scram-sha-256

# 管理连接（仅限DBA）
host    all             dba_user        10.0.0.0/8              scram-sha-256

# 备份服务器连接
host    replication     backup_user     192.168.2.100/32        scram-sha-256

# 拒绝其他所有连接
host    all             all             0.0.0.0/0               reject
EOF

# 4. 替换配置文件
cp /tmp/pg_hba.conf /var/lib/postgresql/data/

# 5. 重新加载配置（无需重启）
psql -U postgres -c "SELECT pg_reload_conf();"
```

### 配置最佳实践

```bash frame="none"
# 生产环境推荐配置
local   all             postgres                                peer
local   all             all                                     scram-sha-256
host    all             all             127.0.0.1/32            scram-sha-256
hostssl all             all             0.0.0.0/0               scram-sha-256
```

## 权限管理详解

### 权限分类

| 权限类型   | 命令                           | 说明             |
| ---------- | ------------------------------ | ---------------- |
| 数据库权限 | CONNECT, CREATE, TEMPORARY     | 数据库级别操作   |
| Schema权限 | USAGE, CREATE                  | Schema访问和创建 |
| 表权限     | SELECT, INSERT, UPDATE, DELETE | 数据操作         |
| 序列权限   | USAGE, SELECT, UPDATE          | 序列操作         |
| 函数权限   | EXECUTE                        | 执行函数         |
| 类型权限   | USAGE                          | 使用自定义类型   |

### 授予权限

```sql
-- 数据库级别权限
GRANT CONNECT ON DATABASE mydb TO test;
GRANT CREATE ON DATABASE mydb TO developer;
GRANT TEMPORARY ON DATABASE mydb TO app_user;

-- Schema级别权限
GRANT USAGE ON SCHEMA public TO test;
GRANT CREATE ON SCHEMA public TO developer;

-- 表级别权限（精细控制）
-- 只读权限
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly_user;
GRANT SELECT ON users, orders TO report_user;

-- 读写权限
GRANT SELECT, INSERT, UPDATE, DELETE ON users TO app_user;

-- DML权限（无DDL）
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
```

### 批量权限管理

```sql
-- 授予所有表权限
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO app_user;

-- 授予未来表的默认权限
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_user;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT USAGE ON SEQUENCES TO app_user;

-- 为特定用户设置默认权限
ALTER DEFAULT PRIVILEGES FOR ROLE developer
GRANT SELECT ON TABLES TO readonly_user;
```

### 撤销权限

```sql
-- 撤销特定权限
REVOKE INSERT, UPDATE ON users FROM test;
REVOKE CREATE ON DATABASE mydb FROM developer;

-- 撤销所有表权限
REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM test;

-- 撤销默认权限
ALTER DEFAULT PRIVILEGES IN SCHEMA public
REVOKE SELECT, INSERT, UPDATE, DELETE ON TABLES FROM app_user;
```

### 查看权限

```sql
-- 查看用户权限概览
SELECT * FROM information_schema.role_table_grants 
WHERE grantee = 'test';

-- 查看表权限详情
SELECT 
    grantor,
    grantee,
    table_schema,
    table_name,
    privilege_type,
    is_grantable
FROM information_schema.table_privileges 
WHERE table_name = 'users';

-- 查看数据库权限
SELECT 
    datname,
    rolname,
    datacl
FROM pg_database 
JOIN pg_roles ON true
WHERE datname = 'mydb';
```
