---
title: Virtual DOM
description: Virtual DOM
sidebar:
  order: 100
---

Virtual DOM就是用JavaScript对象去描述一个DOM结构，Virtual DOM不是直接操作浏览器的真实DOM，而是首先对UI的更新在Virtual DOM中进行，再更高效的同步到真实DOM中。

## 优点

1. 性能优化：直接操作真实DOM是比较昂贵的，尤其是涉及到大量节点更新时。虚拟DOM通过减少不必要的DOM操作，主要体现在diff算法的复用操作。
2. 跨平台性：虚拟DOM是一个与平台无关的概念，它可以映射到不同的渲染目标，比如浏览器的DOM或者移动端的原生UI。

## 实现简易版虚拟DOM

1. 实现`React.createElement`
   - 用于生成虚拟DOM树，返回一个包含type(元素类型)和props(属性和子元素)的对象
   - children可以是文本或其他虚拟DOM对象
   - React.createTextElement用于处理文本节点，将字符串封装成虚拟DOM对象
   - React.render将虚拟DOM转化成实际DOM元素，使用递归的方式渲染所有子元素，最后将生成的DOM节点插入到指定的容器中

2. React Fiber
   - Fiber是React16引入的一种新的协调引擎，用于解决和优化React应对复杂UI渲染时的性能问题
   - [React源码解析英文版](https://pomb.us/build-your-own-react/)

3. Fiber的作用
   - 将同步递归无法中断的更新重构为异步的可中断更新
   - 它实现了4个具体目标：
     - 可中断的渲染：Fiber允许将大的渲染任务拆分成多个小的工作单元，使得React可以在空闲时间执行这些小任务。当浏览器需要处理更高优先级的任务时(如用户输入、动画等)，可以暂停渲染，先处理这些任务，然后再恢复未完成的渲染任务
     - 优先级调度：在Fiber架构下，React可以根据不同任务的优先级决定何时更新哪些部分。React会优先更新用户可感知的部分(如动画、用户输入)，而低优先级的任务(如数据加载后的界面更新)可以延后执行
     - 双缓存树：Fiber架构中有两棵树：current fiber tree(当前正在渲染的树)和work in progress fiber tree(正在处理的树/渲染的下一次UI状态)。React使用这两棵树来保存更新前后的状态，从而更高效的进行比较和更新
     - 任务切片：在浏览器的空闲时间内(利用requestIdleCallback的思想)，React可以将渲染任务拆分成多个小片段，逐步完成Fiber树的构建，避免一次性完成所有渲染任务导致阻塞
   - 双缓存
     - 举例：当进行canvas绘制动画时，每一帧绘制前都会调用ctx.clearRect清除上一帧的画面，如果当前帧画面计算量比较大，会导致清除上一帧画面到绘制当前帧画面之间有较长间隙，就会出现白屏。为了解决这个问题，可以在内存中绘制当前帧动画，绘制完毕后之间用当前帧替换上一帧画面，由于省去了两帧替换间的计算时间，不会出现从白屏到出现画面的闪烁情况
4. 任务切片
   - 浏览器一帧做些什么
     1. 处理事件的回调(click、input)
     2. 处理计时器、Ajax的回调
     3. 开始帧
     4. 执行requestAnimationFrame动画的回调
     5. 计算机页面布局计算 合并到主线程
     6. 绘制
     7. 如果此时还有空闲时间，执行requestIdleCallback
5. diff算法

### 代码实现

```js
// jsx->babel->react.createElement

// vdom
const React = {
  createElement: (type, props, ...children) => {
    return {
      type,
      props: {
        ...props,
        children: children.map((child) =>
          typeof child === "object" ? child : React.createTextElement(child),
        ),
      },
    };
  },
  createTextElement: (text) => {
    return {
      type: "TEXT_ELEMENT",
      props: {
        nodeValue: text,
        children: [],
      },
    };
  },
};

// const vdom = React.createTextElement(
//   "div",
//   { id: "container" },
//   React.createTextElement("h1", null, "Hello, world!"),
// );

// console.log(vdom);

// Fiber
let nextUnitOfWork = null; // 下一个工作单元
let currentRoot = null; // 当前fiber树的根
let wipRoot = null; // 正在工作的fiber树
let deletions = null; // 存储需要删除的fiber节点

// fiber 渲染入口
function render(element, container) {
  // 初始化fiber结构
  wipRoot = {
    dom: container, // 渲染目标的DOM容器
    props: {
      children: [element], // 要渲染的元素
    },
    alternate: currentRoot,
  };
  deletions = [];
  nextUnitOfWork = wipRoot;
}

// 创建fiber节点
function createFiber(element, parent) {
  return {
    type: element.type,
    props: element.props,
    parent: parent,
    dom: null, // 对应的DOM节点，初始为null
    child: null, // 指向第一个子fiber节点的引用
    sibling: null, // 指向下一个兄弟fiber节点的引用
    alternate: null, // 指向旧fiber节点的引用，用于比较和更新
    effectTag: null, // 标记fiber节点的操作类型（PLACEMENT、UPDATE、DELETION）
  };
}

// 创建DOM节点
function createDom(fiber) {
  const dom =
    fiber.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type);

  updateDom(dom, {}, fiber.props);

  return dom;
}

// 更新DOM节点属性
function updateDom(dom, prevProps, nextProps) {
  // 移除旧属性
  Object.keys(prevProps)
    .filter((name) => name !== "children")
    .forEach((name) => {
      dom[name] = "";
    });

  // 添加新属性
  Object.keys(nextProps)
    .filter((name) => name !== "children")
    .filter((name) => prevProps[name] !== nextProps[name])
    .forEach((name) => {
      dom[name] = nextProps[name];
    });
}

// 工作循环，利用浏览器空闲时间执行任务
function workLoop(deadline) {
  // shouldYield表示是否应该让出控制权，允许浏览器处理其他任务
  let shouldYield = false;

  while (nextUnitOfWork && !shouldYield) {
    // 执行当前工作单元，返回下一个工作单元
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    // 如果浏览器空闲时间不足，shouldYield为true，暂停工作循环
    shouldYield = deadline.timeRemaining() < 1;
  }

  if (!nextUnitOfWork && wipRoot) {
    // 所有工作单元完成后，提交更改到DOM
    commitRoot();
  }

  requestIdleCallback(workLoop);
}

// 启动工作循环
requestIdleCallback(workLoop);

// 执行工作单元，构建fiber树
function performUnitOfWork(fiber) {
  // 如果当前fiber节点没有对应的DOM节点，创建一个新的DOM节点
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  // 将当前fiber节点的子元素转换为fiber节点，并建立父子关系
  const elements = fiber.props.children;
  reconcileChildren(fiber, elements);

  // 返回下一个工作单元：优先返回子节点，如果没有子节点则返回兄弟节点，如果没有兄弟节点则返回父节点的兄弟节点
  if (fiber.child) {
    return fiber.child;
  }

  let nextFiber = fiber;

  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
}

// diff算法核心，比较新旧fiber树，标记需要更新、添加或删除的节点
function reconcileChildren(wipFiber, elements) {
  let index = 0;
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child;
  let prevSibling = null;

  while (index < elements.length || oldFiber != null) {
    const element = elements[index];
    let newFiber = null;

    // 判断新旧fiber节点是否类型相同，如果相同则复用旧节点并更新属性，否则创建新节点或标记旧节点为删除
    const sameType = oldFiber && element && element.type === oldFiber.type;

    // 如果新旧节点类型相同，复用旧节点的DOM并更新属性
    if (sameType) {
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: "UPDATE",
      };
    }

    // 如果新旧节点类型不同且新节点存在，创建一个新的fiber节点并标记为添加
    if (element && !sameType) {
      newFiber = createFiber(element, wipFiber);
      newFiber.effectTag = "PLACEMENT";
    }

    // 如果新旧节点类型不同且旧节点存在，标记旧节点为删除
    if (oldFiber && !sameType) {
      oldFiber.effectTag = "DELETION";
      deletions.push(oldFiber);
    }

    // 移动到下一个旧节点
    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    // 将新fiber节点连接到fiber树中，建立父子关系和兄弟关系
    if (index === 0) {
      // 如果是第一个子节点，直接连接到父节点的child属性
      wipFiber.child = newFiber;
    } else if (element) {
      // 如果不是第一个子节点，连接到前一个兄弟节点的sibling属性
      prevSibling.sibling = newFiber;
    }

    // 更新prevSibling为当前新fiber节点，继续处理下一个元素
    prevSibling = newFiber;
    index++;
  }
}

// 提交更改到DOM，根据fiber节点的effectTag执行相应的操作（添加、更新、删除）
function commitRoot() {
  // 先处理需要删除的节点，确保它们在更新和添加节点之前被移除
  deletions.forEach(commitWork);
  commitWork(wipRoot.child);
  currentRoot = wipRoot;
  wipRoot = null;
}

// 根据fiber节点的effectTag执行相应的DOM操作
function commitWork(fiber) {
  if (!fiber) return;

  const domParent = fiber.parent.dom;

  if (fiber.effectTag === "PLACEMENT" && fiber.dom != null) {
    domParent.appendChild(fiber.dom);
  } else if (fiber.effectTag === "UPDATE" && fiber.dom != null) {
    updateDom(fiber.dom, fiber.alternate.props, fiber.props);
  } else if (fiber.effectTag === "DELETION") {
    domParent.removeChild(fiber.dom);
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

// 测试代码，创建两个不同的虚拟DOM树并渲染到页面上，验证Fiber架构的更新机制
render(
  React.createElement(
    "div",
    { id: "container" },
    React.createElement("h1", null, "Hello, world"),
  ),
  document.getElementById("root"),
);
render(
  React.createElement(
    "div",
    { id: "container" },
    React.createElement("p", null, "Hello, Fiber"),
  ),
  document.getElementById("root"),
);
```
