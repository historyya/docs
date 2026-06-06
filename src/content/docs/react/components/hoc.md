---
title: 高阶组件
description: Higher Order Component
sidebar:
  order: 54
---

高阶组件可以接受另一个组件作为参数，并返回一个新的组件，新的组件可以复用原组件的逻辑，并添加新的功能。

### 用法一

**注意**

- 高阶组件不会修改传入的组件，而是使用组合的方式，通过将原组件包裹在一个容器组件中来实现功能扩展
- HOC的命名规范一般以`with`开头

```tsx
// 实现一个权限判断的HOC
enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

const withAuthorization =
  (userRole: UserRole) => (Component: React.ComponentType<any>) => {
    const isAuthorized = (userRole: UserRole) => {
      return userRole === UserRole.ADMIN;
    };

    return (props: any) => {
      if (isAuthorized(userRole)) {
        // 将props透传给组件
        return <Component {...props} />;
      } else {
        return <div>You are not authorized to view this page.</div>;
      }
    };
  };

const AdminComponent = withAuthorization(UserRole.ADMIN)(() => {
  return <div>Welcome, Admin!</div>;
});

const UserComponent = withAuthorization(UserRole.USER)(() => {
  return <div>Welcome, User!</div>;
});

function App() {
  return (
    <>
      <h1>Welcome to the App</h1>
      <AdminComponent />
      <UserComponent />
    </>
  );
}

export default App;
```

### 用法二

```tsx
// 实现埋点统计
import React from "react";

type TrackEvent = (eventType: string, data?: unknown) => void;
type InjectedTrackProps = {
  trackEvent: TrackEvent;
};

// 创建一个埋点服务
const trackService = {
  sendEvent: (trackType: string, data: unknown = null) => {
    const eventData = {
      timestamp: new Date().toISOString(), // 事件发生时间
      trackType, // 事件类型
      data, // 事件数据
      userAgent: navigator.userAgent, // 用户代理信息
      url: window.location.href, // 当前页面URL
    };
    console.log("Event Tracked:", eventData);
    navigator.sendBeacon("/track", JSON.stringify(eventData)); // 发送数据
  },
};

// 创建一个高阶组件，用于包装需要埋点的组件
const withTrack = <P extends object>(
  Component: React.ComponentType<P & InjectedTrackProps>,
  trackType: string,
) => {
  return (props: P) => {
    React.useEffect(() => {
      // 组件加载时发送埋点事件
      trackService.sendEvent(`${trackType}_load`);
      return () => {
        // 组件卸载时发送埋点事件
        trackService.sendEvent(`${trackType}_unload`);
      };
    }, []);

    // 处理事件
    const trackEvent = React.useCallback<TrackEvent>((eventType, data) => {
      trackService.sendEvent(`${trackType}_${eventType}`, data);
    }, []);

    const componentProps = { ...props, trackEvent } as P & InjectedTrackProps;

    return <Component {...componentProps} />;
  };
};

const Button = ({ trackEvent }: InjectedTrackProps) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    trackEvent(e.type, {
      name: e.type,
      type: e.type,
      clientX: e.clientX,
      clientY: e.clientY,
    });
  };

  return (
    <button className="" onClick={handleClick}>
      Click Me
    </button>
  );
};

const TrackedButton = withTrack(Button, "button");

function App() {
  return (
    <>
      <h1>Welcome to the App</h1>
      <TrackedButton />
    </>
  );
}

export default App;
```
