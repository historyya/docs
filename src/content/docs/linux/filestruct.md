---
title: 文件系统目录结构
description: 文件系统目录结构
sidebar:
    order: 1
---

## Linux 文件系统目录结构速查表

| 目录     | 英文含义              | 主要用途                                         | 常见示例           |
| -------- | --------------------- | ------------------------------------------------ | ------------------ |
| `/`      | Root                  | 根目录，整个 Linux 文件系统的起点                |                    |
| `/home`  | Home                  | 普通用户的主目录，存放个人文件                   | `/home/tom`        |
| `/root`  | Root Home             | root 管理员用户的主目录                          |                    |
| `/bin`   | Binary                | 基本用户命令和系统运行所需的程序                 | `ls`、`cp`         |
| `/sbin`  | System Binary         | 系统管理命令                                     | `fsck`、`reboot`   |
| `/etc`   | Etcetera              | 系统和应用程序配置文件                           | `/etc/hosts`       |
| `/usr`   | Unix System Resources | 用户空间程序、库文件和共享资源                   | `/usr/bin`         |
| `/lib`   | Libraries             | 系统关键共享库及内核模块                         | 动态链接库         |
| `/var`   | Variable              | 经常变化的数据，例如日志、缓存和应用数据         | `/var/log`         |
| `/tmp`   | Temporary             | 临时文件目录                                     |                    |
| `/mnt`   | Mount                 | 手动挂载文件系统的临时挂载点                     | `/mnt/data`        |
| `/media` | Media                 | 可移动存储设备的挂载点                           | U 盘               |
| `/dev`   | Devices               | 设备文件，提供访问硬件和内核设备接口             | `/dev/sda`         |
| `/proc`  | Processes             | 内核提供的虚拟文件系统，存储进程和系统实时信息   | `/proc/cpuinfo`    |
| `/sys`   | System                | 内核提供的虚拟文件系统，展示设备、驱动和内核信息 | `/sys/class`       |
| `/boot`  | Boot                  | 系统启动相关文件                                 | Linux 内核、GRUB   |
| `/run`   | Runtime               | 系统运行期间产生的临时状态数据                   | PID 文件、Socket   |
| `/opt`   | Optional              | 第三方软件及独立应用程序的安装目录               |                    |
| `/srv`   | Service               | 系统提供的服务所使用的数据                       | 网站文件、FTP 数据 |

## 按照用途分类

![按照用途分类](./assets/11-18_14-45-24.png)
