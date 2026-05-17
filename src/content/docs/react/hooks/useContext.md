---
title: useContext
description: useContext
sidebar:
  order: 24
---

## 用法

```tsx
import { createContext, useContext, useState } from "react";
import { Button } from "./components/ui/button";

interface IThemeContext {
  theme: string;
  setTheme: (theme: string) => void;
}

// 1. 创建一个上下文
const ThemeContext = createContext<IThemeContext>({
  theme: undefined!,
  setTheme: () => {},
});

function App() {
  const [theme, setTheme] = useState("light");

  return (
    <ThemeContext value={{ theme, setTheme }}>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">父组件</h1>
        <Button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
          切换主题
        </Button>
        <ChildComponent />
      </div>
    </ThemeContext>
  );
}

export default App;

function ChildComponent() {
  // 2. 在子组件中使用 useContext 获取上下文值
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">子组件</h2>
      <p>当前主题: {theme}</p>
      <Button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        切换主题
      </Button>
    </div>
  );
}
```
