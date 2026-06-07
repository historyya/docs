---
title: requestIdleCallback
description: requestIdleCallback
sidebar:
  order: 101
---

requestIdleCallback允许开发者在浏览器空闲时运行低优先级的任务，而不会影响关键任务和动画性能。

## 基本用法

```js
const total = 50000;
const arr = [];

function generateArr() {
  for (let i = 0; i < total; i++) {
    arr.push(function () {
      document.body.innerHTML += `<div>${i + 1}</div>`;
    });
  }
}

generateArr();

// 直接执行所有任务，可能会导致页面卡顿
// for (let i = 0; i < total; i++) {
//   arr[i]();
// }

function workLoop(deadline) {
  // 检查当前空闲时间是否大于1毫秒，并且任务数组中还有任务未执行
  if (deadline.timeRemaining() > 0 && arr.length > 0) {
    // 从任务数组中取出一个任务并执行
    const fn = arr.shift();
    fn();
  }

  // 继续请求下一个空闲时间来执行剩余的任务
  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);
```

## 为什么React不用原生requestIdleCallback实现呢

1. 兼容性差：safari不支持
2. 控制精细度：react要根据组件优先级、更新的紧急程度等信息，更精准的安排渲染的工作
3. 执行时机：`requestIdleCallback(callback)`回调函数的执行间隔是50ms，也就是20FPS，1秒内执行20次，间隔较长
4. 差异性：每个浏览器实现该API的方式不同，导致执行时机有差异

## requestIdleCallback替代方案是MessageChannel

选择MessageChannel的原因是首先异步得是个宏任务，因为宏任务中会在下次事件循环中执行，不会阻塞当前页面的更新。

没选择常用的setTimeout是因为MessageChannel能较快执行，在0-1ms内触发，像setTimeout即便设置setTimeout为0还是需要4-5ms。相同时间下，MessageChannel能够完成更多的任务。

若浏览器不支持MessageChannel，还是会降级为setTimeout。

### 基本用法

MessageChannel用于在不同的上下文之间进行通信，例如webworker、iframe。它提供了两个端口，通过这些端口。消息可以在两个独立的线程之间双向传递。

```js
// 创建一个新的 MessageChannel 实例
const channel = new MessageChannel();
const port1 = channel.port1;
const port2 = channel.port2;

// 监听 port1 上的消息事件
port1.onmessage = (event) => {
  // 接收port2发送的消息
  console.log("Received message on port1:", event.data);
  // 发送信息
  port1.postMessage("Hello from port1!");
};

// 监听 port2 上的消息事件
port2.onmessage = (event) => {
  console.log("Received message on port2:", event.data);
};

// 发送消息到 port1
port2.postMessage("Hello from port2!");
```

## 实现react简易版调度器

react调度器给每个任务分配了不同的优先级：

1. ImmediatePriority：立即执行的优先级，级别最高
2. UserBlockingPriority：用户阻塞级别的优先级
3. NormalPriority：正常的优先级
4. LowPriority：低优先级
5. IdlePriority：最低优先级

代码实现：

```js
const ImmediatePriority = 1; // 立即执行的优先级, 级别最高 [点击事件，输入框，]
const UserBlockingPriority = 2; // 用户阻塞级别的优先级, [滚动，拖拽这些]
const NormalPriority = 3; // 正常的优先级 [redner 列表 动画 网络请求]
const LowPriority = 4; // 低优先级  [分析统计]
const IdlePriority = 5; // 最低阶的优先级, 可以被闲置的那种 [console.log]

// 获取当前时间
function getCurrentTime() {
  return performance.now();
}

class SimpleScheduler {
  constructor() {
    this.taskQueue = []; // 任务队列
    this.isPerformingWork = false; // 当前是否在执行任务

    // 使用 MessageChannel 处理任务调度
    const channel = new MessageChannel();
    this.port = channel.port2;
    channel.port1.onmessage = this.performWorkUntilDeadline.bind(this);
  }

  // 调度任务
  /**
   *
   * @param {优先级} priorityLevel
   * @param {回调函数} callback
   */
  scheduleCallback(priorityLevel, callback) {
    const curTime = getCurrentTime();
    let timeout;
    // 根据优先级设置超时时间
    switch (priorityLevel) {
      case ImmediatePriority:
        timeout = -1;
        break;
      case UserBlockingPriority:
        timeout = 250;
        break;
      case LowPriority:
        timeout = 10000;
        break;
      case IdlePriority:
        timeout = 1073741823;
        break;
      case NormalPriority:
      default:
        timeout = 5000;
        break;
    }

    const task = {
      callback,
      priorityLevel,
      expirationTime: curTime + timeout, // 直接根据当前时间加上超时时间
    };

    this.push(this.taskQueue, task); // 将任务加入队列
    this.schedulePerformWorkUntilDeadline();
  }

  // 通过 MessageChannel 调度执行任务
  schedulePerformWorkUntilDeadline() {
    if (!this.isPerformingWork) {
      this.isPerformingWork = true;
      this.port.postMessage(null); // 触发 MessageChannel 调度
    }
  }

  // 执行任务
  performWorkUntilDeadline() {
    this.isPerformingWork = true;
    this.workLoop();
    this.isPerformingWork = false;
  }

  // 任务循环
  workLoop() {
    let curTask = this.peek(this.taskQueue);
    while (curTask) {
      const callback = curTask.callback;
      if (typeof callback === "function") {
        callback(); // 执行任务
      }
      this.pop(this.taskQueue); // 移除已完成任务
      curTask = this.peek(this.taskQueue); // 获取下一个任务
    }
  }

  // 获取队列中的任务
  peek(queue) {
    return queue[0] || null;
  }

  // 向队列中添加任务
  push(queue, task) {
    queue.push(task);
    queue.sort((a, b) => a.expirationTime - b.expirationTime); // 根据优先级排序，优先级高的在前 从小到大
  }

  // 从队列中移除任务
  pop(queue) {
    return queue.shift();
  }
}

// 测试
const scheduler = new SimpleScheduler();

scheduler.scheduleCallback(LowPriority, () => {
  console.log("Task 1: Low Priority");
});

scheduler.scheduleCallback(ImmediatePriority, () => {
  console.log("Task 2: Immediate Priority");
});

scheduler.scheduleCallback(IdlePriority, () => {
  console.log("Task 3: Idle Priority");
});

scheduler.scheduleCallback(UserBlockingPriority, () => {
  console.log("Task 4: User Blocking Priority");
});

scheduler.scheduleCallback(NormalPriority, () => {
  console.log("Task 5: Normal Priority");
});
```
