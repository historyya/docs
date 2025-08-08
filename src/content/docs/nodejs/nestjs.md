---
title: NestJS
description: NestJS
sidebar:
  order: 6
---

## 创建项目

```bash
$ volta install @nestjs/cli

$ nest new project-name
```

## 常用命令

```bash
$ nest --help

# 生成user/user.controller
$ nest g co user

# 生成user/user.module
$ nest g mo user

# 生成user/user.service
$ nest g s user

# 一键生成CRUD模块
$ nest g res user

# 生成logger中间件
$ nest g mi logger

# 生成user管道
$ nest g pi user

# 生成role守卫
$ nest g gu role

# 生成自定义装饰器
$ nest g d role
```

## Modules

### Global modules

```ts
// config.module.ts
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  providers: [
    {
      provide: 'APP_CONFIG',
      useValue: {
        baseUrl: '/api',
      },
    },
  ],
  exports: [
    {
      provide: 'APP_CONFIG',
      useValue: {
        baseUrl: '/api',
      },
    },
  ],
})
export class ConfigModule {}
```

### Shared modules

```ts
// user.module.ts
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],  // 导出模块
})
export class UserModule {}
```

## Middleware

```ts
// logger.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // 可以添加白名单之类的操作
    // res.send('我被拦截了');

    console.log('LoggerMiddleware...');
    next();
  }
}
```

## File upload

```ts
// upload.module.ts
import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: join(__dirname, '../uploads'),
        filename: (req, file, cb) => {
          const fileName = `${new Date().getTime() + extname(file.originalname)}`;
          return cb(null, fileName);
        },
      }),
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
```

```ts
// upload.controller.ts
import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  image(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return true;
  }
}
```

```ts
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.useStaticAssets(join(__dirname, 'uploads'), {
        prefix: '/uploads',
    }); // 静态资源访问
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

## 下载文件和文件流

```ts
// file.controller.ts
import { Controller, Get, Res } from '@nestjs/common';
import { FileService } from './file.service';
import { Response } from 'express';
import { join } from 'node:path';
import { zip } from 'compressing';

@Controller('file')
export class FileController {
    constructor(private readonly fileService: FileService) {}

    @Get('download')
    download(@Res() res: Response) {
        const url = join(__dirname, '../uploads/default.png');
        res.download(url);
    }

    @Get('stream')
    getFile(@Res() res: Response) {
        const url = join(__dirname, '../uploads/default.png');
        const zipStream = new zip.Stream();
        zipStream.addEntry(url);

        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', 'attachment; filename="default.zip"');
        zipStream.pipe(res);
    }
}
```

## 全局响应拦截

```ts
// response.ts
import {Injectable, CallHandler, NestInterceptor } from '@nestjs/common';
import {  Observable } from 'rxjs';
import {map} from 'rxjs/operators'

interface Data<T>{
    data: T
}

@Injectable()
export class Response<T> implements NestInterceptor {
  intercept(context, next: CallHandler):Observable<Data<T>> {
    return next.handle().pipe(
      map((data) => {
        return {
          code: 0,
          message: 'success'
          data,
        };
      }),
    );
  }
}
```

```ts
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Response } from './common/response';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.useGlobalInterceptors(new Response()); // 全局响应拦截器
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

## 全局异常过滤

```ts
// filter.ts
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    response.status(status).json({
      code: -1,
      message: 'error',
      data: exception.message,
      time: new Date(),
      path: request.url,
    });
  }
}
```

```ts
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Response } from './common/response';
import { HttpFilter } from './common/filter';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.useGlobalFilters(new HttpFilter()); // 全局异常过滤器
    app.useGlobalInterceptors(new Response()); // 全局响应拦截器
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

## Pipes

管道可以做两件事

1. 转换，可以将前端传入的数据转成我们需要的数据
2. 验证，类似于前端的rulers配置验证规则

### 转换

```ts
import {
  ParseIntPipe,
} from '@nestjs/common';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        console.log(id, typeof id);
        return this.userService.findOne(+id);
    }
}
```

### 验证

```ts
// user.pipe.ts
import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class UserPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    console.log(value);
    console.log(metadata);
    const obj = plainToInstance(metadata.metatype, value);
    const errors = await validate(obj);
    if (errors.length) {
      throw new HttpException(errors, HttpStatus.BAD_REQUEST);
    }
    return value;
  }
}
```

```ts
// user.controller.ts
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {
    }

    @Post()
    create(@Body(UserPipe) createUserDto: CreateUserDto) {
        console.log(createUserDto);
        return this.userService.create(createUserDto);
    }
}
```

#### 使用全局管道验证

```ts
import { ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalFilters(new HttpFilter()); // 全局异常过滤器
  app.useGlobalInterceptors(new Response()); // 全局响应拦截器
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
```

## Guards

```ts
// role.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const role = this.reflector.get<string[]>('role', context.getHandler());
    const req = context.switchToHttp().getRequest<Request>();
    console.log('RoleGuard...', req.query.role);
    if (role.includes(req.query.role as string)) {
      return true;
    } else {
      return false;
    }
  }
}
```

```ts
// user.controller.ts
@Controller('user')
@UseGuards(RoleGuard)
export class UserController {
    @Get()
    @SetMetadata('role', ['admin']) // 有admin权限才能访问
    findAll(@Query() query) {
        console.log(query);
        return this.userService.findAll();
    }
}
```

## Custom decorators

## 控制反转和依赖注入

```ts
class A {
  name: string;
  constructor(name: string) {
    // this.name = '张三';
    this.name = name;
  }
}

class B {
  a: any;
  constructor() {
    // this.a = new A().name;  // 报错
  }
}

class C {
  a: any;
  constructor() {
    // this.a = new A().name;  // 报错
  }
}
```

```ts
class A {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

class B {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

class Container {
  module: any;
  constructor() {
    this.module = {};
  }

  provide(key: string, mo: any) {
    this.module[key] = mo;
  }

  get(key: string) {
    return this.module[key];
  }
}

const c = new Container();
c.provide('a', new A('张三'));
c.provide('b', new B('李四'));

console.log(c.get('a'));
console.log(c.get('b'));

clss D {
    a: any
    b:any 
    constructor(co:Container){
        this.a = co.get('a')
        this.b = co.get('b')
    }
}
```

## 装饰器

```bash
$ tsc --init
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "experimentalDecorators": true
  }
}
```

### 类装饰器

```ts
// index.ts
const doc: ClassDecorator = (target: any) => {
    console.log(target);
    target.prototype.name = '张三';
};

@doc
class A {
    constructor() {}
}

const a: any = new A();
console.log(a.name);
```

### 属性装饰器

```ts
const doc: PropertyDecorator = (target: any, key: string | symbol) => {
  console.log(target, key);
};

class A {
  @doc
  public name: string;
  constructor() {
    this.name = '默认';
  }
}
```

### 方法装饰器

```ts
const doc: MethodDecorator = (
  target: any,
  key: string | symbol,
  descriptor: any,
) => {
  console.log(target, key, descriptor);
};

class A {
  public name: string;
  constructor() {
    this.name = '默认';
  }

  @doc
  getName() {}
}
```

### 参数装饰器

```ts
const doc: ParameterDecorator = (
  target: any,
  key: string | symbol,
  index: any,
) => {
  console.log(target, key, index);
};

class A {
  public name: string;
  constructor() {
    this.name = '默认';
  }

  getName(name: string, @doc age: number) {}
}
```

### 实现Get装饰器

```ts
import axios from 'axios';

const Get = (url: string) => {
  return (target: any, key: any, descriptor: PropertyDecorator) => {
    const fnc = descriptor.value;
    axios
      .get(url)
      .then((res) => {
        fnc(res, {
          code: 200,
          success: true,
        });
      })
      .catch((err) => {
        fnc(err, {
          code: 500,
          success: false,
        });
      });
  };
};

class Controller {
  constructor() {}

  @Get('https://jsonplaceholder.typicode.com/users')
  getAll(res: any) {
    console.log(res);
  }
}
```