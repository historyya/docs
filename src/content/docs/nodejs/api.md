---
title: api
description: api
sidebar:
  order: 2
---

## Path

path 模块可以处理文件和目录路径。

```js
import path from "node:path";

// 返回路径的最后一部分:file.txt
console.log(path.basename("/home/user/file.txt"));

// 返回路径的目录名: /home/user
console.log(path.dirname("/home/user/file.txt"));

// 返回路径的扩展名: .txt
console.log(path.extname("/home/user/file.txt"));

// 连接路径: /home/user/file.txt
console.log(path.join("/home/user", "file.txt"));

// 解析路径，返回当前目录的绝对路径
console.log(path.resolve(__dirname, "./file.txt"));

// 解析路径，返回对象
console.log(path.parse("/home/user/file.txt"));

// 格式化路径，返回字符串
console.log(
  path.format({
    dir: "/home/user",
    base: "file.txt",
  })
);

// 返回路径分隔符：/
console.log(path.sep());
```

## OS

os 模块可以跟操作系统进行交互。

```js
import os from "node:os";
import { exec } from "node:child_process";

// 返回操作系统平台: win32，linux，darwin
console.log(os.platform());

const platform = os.platform();

// 返回操作系统版本: 10.0.19041
console.log(os.release());

// 返回操作系统类型: Windows_NT，Linux，Darwin
console.log(os.type());

// 返回操作系统版本: Windows 11 Pro
console.log(os.version());

// 返回用户主目录: C:\Users\Administrator
console.log(os.homedir());

// 返回系统CPU架构: x64
console.log(os.arch());

// 返回操系统CPU信息: 12核
console.log(os.cpus().length);

// 返回系统网络接口信息
console.log(os.networkInterfaces());

// 打开浏览器访问指定url
const open = (url) => {
  if (platform === "win32") {
    // exec 执行shell命令
    exec(`start ${url}`);
  } else if (platform === "linux") {
    exec(`xdg-open ${url}`);
  } else if (platform === "darwin") {
    exec(`open ${url}`);
  }
};

open("https://www.baidu.com");
```

## Process

process 模块是 Nodejs 操作当前进程和控制当前进程的 api 。

```js
import process from "node:process";

// 返回系统CPU架构: x64
console.log(process.arch());

// 返回操作系统平台: win32，linux，darwin
console.log(process.platform);

// 返回当前工作目录
console.log(process.cwd());

// 返回命令行参数，返回数组
console.log(process.argv);

// 获取环境变量，返回对象
console.log(process.env);

// 返回当前进程ID
console.log(process.pid);

// 返回当前进程内存使用情况，返回对象
console.log(process.memoryUsage());

// 退出进程
process.exit(0);

// 杀死进程
process.kill(process.pid, "SIGINT");
```

## Child process

```js
import {
  exec,
  execSync,
  spawn,
  spawnSync,
  execFile,
  execFileSync,
  fork,
} from "node:child_process";
import path from "node:path";

// 异步执行shell命令，适合进行较小规模的命令执行
exec("node -v", (err, stdout, stderr) => {
  if (err) {
    console.error(err);
  }
  console.log(stdout.toString());
});

// 同步执行shell命令，推荐使用这个
const nodeVersion = execSync("node -v");
console.log(nodeVersion.toString());

// 实时输出命令执行结果，适合进行较大规模的命令执行
const { stdout } = spawn("netstat", ["-an"]);

stdout.on("data", (data) => {
  console.log(data.toString());
});

stdout.on("close", () => {
  console.log("close");
});

// 执行可执行文件
execFile(path.resolve(__dirname, "child_process.js"), (err, stdout, stderr) => {
  if (err) {
    console.error(err);
  }
  console.log(stdout.toString());
});

// 执行子进程，可以父子进程通信
const child = fork(path.resolve(__dirname, "child_process.js"));

child.on("message", (message) => {
  console.log(message);
});

child.send("hello");
```

### ffmpeg

```js
// 基本格式转换
execSync("ffmpeg -i input.mp4 output.avi", { stdio: "inherit" });

// 提取音频
execSync("ffmpeg -i input.mp4 output.mp3", { stdio: "inherit" });

// 裁剪视频
execSync("ffmpeg -i input.mp4 -ss 00:00:00 -t 00:00:10 output.mp4", {
  stdio: "inherit",
});

// 加水印
execSync(
  "ffmpeg -i input.mp4 -vf drawtext=text='demo':fontsize=20:x=(w-text_w)/2:y=(h-text_h)/2:fontcolor=white:box=1:boxcolor=black@0.5 output.mp4",
  {
    stdio: "inherit",
  }
);

// 删除水印
execSync("ffmpeg -i input.mp4 -vf delogo=x=10:y=10:w=100:h=100 output.mp4", {
  stdio: "inherit",
});
```

### pngquant

```js
// 压缩png图片
exec("pngquant origin.png --quality=80 --output image.png");
```

## Events

Nodejs 事件模型采用了**发布订阅设计模式** 。

```js
import { EventEmitter } from "node:events";

const myEmitter = new EventEmitter();
myEmitter.setMaxListeners(20);

// 订阅事件，默认只能10个
myEmitter.on("event-1", (name) => {
  console.log(`${name} event-1 occurred!`);
});
// 发布事件
myEmitter.emit("event-1", "张三");
```

## Util

```js
import { exec } from "node:child_process";
import util from "node:util";

// 返回一个新的函数
const execPromise = util.promisify(exec);

execPromise("node -v")
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.error(err);
  });

// 实现promisify
const promisify = (fn) => {
  return (...args) => {
    return new Promise((resolve, reject) => {
      fn(...args, (err, ...values) => {
        if (err) {
          reject(err);
        }
        if (values && values.length > 1) {
          let obj = {};
          for (const key in values) {
            obj[key] = values[key];
          }
          resolve(obj);
        } else {
          resolve(values[0]);
        }
      });
    });
  };
};

const fn = (type) => {
  if (type == 1) {
    return Promise.resolve("success");
  } else {
    return Promise.reject("error");
  }
};

// 把Promise函数变成回调函数
const cb = util.callbackify(fn);

cb(1, (err, val) => {
  console.log(err, val);
});
```

## File system

`fs` 模块可以执行读取文件、写入文件、创建目录等操作。

```js
import * as fs from "node:fs";
import * as fs2 from "node:fs/promises";

// 读取文件
// fs.readFile(
//   "./fs.js",
//   {
//     encoding: "utf-8",
//     flag: "r",
//   },
//   (err, data) => {
//     if (err) {
//       console.error(err);
//     }
//     console.log(data);
//   }
// );

// const data = fs.readFileSync("./fs.js");
// console.log(data.toString("utf-8"));

fs2
  .readFile("./fs.js")
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.error(err);
  });

// 可读流，场景：大文件读取
const rs = fs.createReadStream("./fs.js");
rs.on("data", (chunk) => {
  console.log(chunk.toString());
});
rs.on("end", () => {
  console.log("end");
});

// 创建文件夹，支持递归创建
fs.mkdirSync("./test", { recursive: true });

// 删除文件夹
fs.rmSync("./test", { recursive: true });

// 重命名文件
fs.renameSync("./fs.js", "./fs2.js");

// 监听文件变化
fs.watch("./fs.js", (eventType, filename) => {
  console.log(eventType, filename);
});

// 写入文件
fs.writeFileSync("./fs.js", "console.log('hello')", { flag: "a" });

// 追加写入文件
fs.appendFileSync("./fs.js", "console.log('vue')");

// 创建可写流
let ws = fs.createWriteStream("./fs.js");

let arr = ["1", "2", "3"];

arr.forEach((item) => {
  ws.write(item + "\n");
});

ws.end();

ws.on("finish", () => {
  console.log("write finished");
});

// 硬链接
fs.linkSync("./fs.js", "./fs2.js");

// 软链接，需要管理员权限运行
fs.symlinkSync("./fs.js", "./fs3.js");
```

## Crypto

```js
import crypto from "node:crypto";

// 对称加密
let key = crypto.randomBytes(32);
let iv = Buffer.from(crypto.randomBytes(16));

const hash = crypto
  .createCipheriv("aes-256-cbc", key, iv)
  .update("HELLO WORLD", "utf8", "hex")
  .final("hex");

console.log(hash);

// 解密
crypto
  .createDecipheriv("aes-256-cbc", key, iv)
  .update(hash, "hex", "utf8")
  .final("utf8");

console.log(decrypted);

// 非对称加密
const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 4096,
});

const encrypted = crypto.publicEncrypt(publicKey, Buffer.from("Hello World"));

console.log(encrypted.toString("hex"));

const decrypted = crypto.privateDecrypt(privateKey, encrypted);

console.log(decrypted.toString("utf8"));

// 哈希加密
const hash1 = crypto.createHash("sha256").update("Hello World").digest("hex");

console.log(hash1);
```

## Zlib

### gzip

gzip 常用于文件压缩、网络传输和 HTTP 响应的内容编码。

```js
import zlib from "node:zlib";
import fs from "node:fs";
import http from "node:http";

// 压缩文件
// const readStream = fs.createReadStream("./vue.md");
// const writeStream = fs.createWriteStream("./vue.md.gz");

// const gzip = zlib.createGzip();

// readStream.pipe(gzip).pipe(writeStream);

// 解压文件
const readStream = fs.createReadStream("./vue.md.gz");
const writeStream = fs.createWriteStream("./vue.md");

const gunzip = zlib.createGunzip();

readStream.pipe(gunzip).pipe(writeStream);

// gzip 压缩应用
const server = http.createServer((req, res) => {
  const text = "Hello World".repeat(10000);
  res.setHeader("Content-Type", "text/plain;charset=utf-8");
  res.setHeader("Content-Encoding", "gzip");
  let result = zlib.gzipSync(text);
  res.end(result);
});

server.listen(3000, () => {
  console.log("server is running on port 3000");
});
```

### deflate

## HTTP

### Web 服务器

```js
import http from "node:http";
import url from "node:url";

// web 服务器
const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true);
  console.log(pathname, query);

  if (req.method === "POST") {
    if (pathname === "/login") {
      let data = "";
      req.on("data", (chunk) => {
        data += chunk;
      });
      req.on("end", () => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(data));
      });
    } else {
      res.statusCode = 404;
      res.end("NOT FOUND");
    }
  } else if (req.method === "GET") {
    if (pathname === "/get") {
      console.log(query);
      res.statusCode = 200;
      res.end("GET");
    } else {
      res.statusCode = 404;
      res.end("NOT FOUND");
    }
  } else {
    res.end("NOT FOUND");
  }
});

server.listen(3000, () => {
  console.log("server is running on port 3000");
});
```

### 反向代理

### 动静分离

## Net

### TCP 通讯

```js
server.js;
import net from "node:net";

const server = net.createServer((socket) => {
  setInterval(() => {
    socket.write("Hello");
  }, 1000);

  socket.on("data", (data) => {
    console.log(data.toString());
  });
});

server.listen(3000, () => {
  console.log("server is running on port 3000");
});
```

```js
// client.js
import net from "node:net";

const client = net.createConnection({
  host: "localhost",
  port: 3000,
});

client.on("data", (data) => {
  console.log(data.toString());
});

client.write("Hi");
```

### HTTP

```js
// http.js
import net from "node:net";

const server = net.createServer((socket) => {
  socket.write("HTTP/1.1 200 OK\r\n");
  socket.write("Content-Type: text/html\r\n");
  socket.write("\r\n");
  socket.write("<h1>Hello World</h1>");

  socket.on("data", (data) => {
    console.log(data.toString());
  });
});

server.listen(3000, () => {
  console.log("server is running on port 3000");
});
```

#### HTTP缓存

HTTP缓存分为强缓存和协商缓存。这两种缓存都通过HTTP响应头来控制，目的是提高网站性能。

##### 强缓存

强缓存之后则不需要向服务器发送请求，而是从浏览器缓存中读取。

```js
import express from 'express'
import cors from 'cors'

// Expires的判断机制是：当客户端请求资源时，会获取本地时间戳，然后拿本地时间戳与 Expires 设置的时间做对比，如果对比成功，走强缓存，对比失败，则对服务器发起请求。

const app = express()
app.use(cors())

// 静态资源缓存
app.use(express.static('./static', {
    maxAge: 1000 * 60 * 60,
    lastModified: true,
}))

// 动态资源缓存
// Expires 强缓存
app.get('/api', (req, res) => {
    res.setHeader('Expires', new Date('2025-10-10 23:17:00').toUTCString()) //设置过期时间
    res.send("ok")
})

// Cache-Control 强缓存
app.get('/cache', (req, res) => {
    res.setHeader('Cache-Control', 'public, max-age=60') //缓存60秒
    res.send("ok")
})

app.listen(3000, () => {
    console.log('Server started on port 3000')
})
```

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<button id="btn">Send</button>

<script>
    const btn = document.getElementById('btn')
    btn.addEventListener('click', () => {
        fetch('http://localhost:8080/api')
    })
</script>

</body>
</html>
```

##### 协商缓存

```js
import express from 'express'
import cors from 'cors'
import fs from 'node:fs'
import crypto from 'node:crypto'

// 获取文件最后修改时间
const getFileModifyTime = () => {
    return fs.statSync('./index.js').mtime.toISOString()
}

// 根据文件生成hash值
const getFileHash = () => {
    return crypto.createHash('sha256').update(fs.readFileSync('index.js')).digest('hex')
}

const app = express()
app.use(cors())

// Last-Modified：根据文件最后修改时间
// app.get('/api', (req, res) => {
//     res.setHeader('Cache-Control', 'no-cache, max-age=2592000')  //no-cache表示走协商缓存
//     const ifModifiedSince = req.headers['if-modified-since']  //获取浏览器上次修改时间
//     res.setHeader('Last-Modified', getFileModifyTime())
//     if (ifModifiedSince && ifModifiedSince === getFileModifyTime()) {
//         console.log('304')
//         res.statusCode = 304
//         res.end('are you ok')
//         return
//     } else {
//         console.log('200')
//         res.end('ok')
//     }
// })

app.get('/use', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, max-age=2592000')
    const etag = getFileHash()
    const ifNoneMatch = req.headers['if-none-match']
    if (ifNoneMatch === etag) {
        res.sendStatus(304)
        return
    }
    res.setHeader('ETag', etag)
    res.send('ok')
})

app.listen(3000, () => {
    console.log('App listening on port 3000')
})
```
