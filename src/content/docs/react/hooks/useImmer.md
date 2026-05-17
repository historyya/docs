---
title: useImmer
description: useImmer
sidebar:
  order: 3
---

:::tip
`useImmer`是一个强大的状态管理工具，特别适合处理复杂的状态结构。它让不可变更新变得简单直观，同时保持了react的性能优势。无论是简单的计数器还是复杂的表单状态，`useImmer`都能提供优雅的解决方案。
:::

## 安装

```bash
npm install immer use-immer
```

## useImmer

### 处理基本类型

```tsx
import { useImmer } from "use-immer";

function App() {
  const [count, setCount] = useImmer(0);

  const increment = () => setCount((draft) => draft + 1);
  const decrement = () => setCount((draft) => draft - 1);

  const reset = () => setCount(0);

  const countColorClass =
    count > 0 ? "text-green-600" : count < 0 ? "text-red-600" : "text-gray-500";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans">
      <div className="bg-white p-10 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] text-center min-w-75">
        <h2 className="m-0 mb-5 text-gray-800 text-2xl font-semibold">
          Counter
        </h2>

        <div
          className={`text-7xl font-bold my-5 transition-colors duration-300 ease-in-out tabular-nums ${countColorClass}`}
        >
          {count}
        </div>

        <div className="flex justify-between gap-3 mt-8">
          <button
            onClick={decrement}
            className="flex-1 p-3 rounded-xl bg-red-100 text-red-600 text-base font-bold cursor-pointer transition-transform hover:scale-105 active:scale-95"
          >
            - Minus
          </button>

          <button
            onClick={reset}
            className="flex-1 p-3 rounded-xl bg-gray-100 text-gray-500 text-base font-bold cursor-pointer transition-colors hover:bg-gray-200 active:scale-95"
          >
            Reset
          </button>

          <button
            onClick={increment}
            className="flex-1 p-3 rounded-xl bg-green-100 text-green-600 text-base font-bold cursor-pointer transition-transform hover:scale-105 active:scale-95"
          >
            + Plus
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
```

### 处理嵌套对象

`useImmer`在处理嵌套对象时，无需手动展开每一层。

```tsx
import { useImmer } from "use-immer";

interface User {
  name: string;
  age: number;
  profile: {
    bio: string;
    preferences: {
      theme: "light" | "dark";
      notifications: boolean;
    };
  };
}

const initialState: User = {
  name: "Bob",
  age: 18,
  profile: {
    bio: "Developer",
    preferences: {
      theme: "light",
      notifications: true,
    },
  },
};

function App() {
  const [user, updateUser] = useImmer<User>(initialState);

  const updateName = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateUser((draft) => {
      draft.name = e.target.value;
    });
  };

  const incrementAge = () => {
    updateUser((draft) => {
      draft.age += 1;
    });
  };

  const updateBio = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateUser((draft) => {
      draft.profile.bio = e.target.value;
    });
  };

  const toggleTheme = () => {
    updateUser((draft) => {
      const prefs = draft.profile.preferences;
      prefs.theme = prefs.theme === "light" ? "dark" : "light";
    });
  };

  const toggleNotifications = () => {
    updateUser((draft) => {
      const prefs = draft.profile.preferences;
      prefs.notifications = !prefs.notifications;
    });
  };

  const resetProfile = () => {
    updateUser(initialState);
  };
  const isDark = user.profile.preferences.theme === "dark";

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="min-h-screen py-10 px-5 font-sans transition-colors duration-300 ease-in-out bg-gray-100 dark:bg-[#1a1a1a] text-gray-800 dark:text-gray-100">
        <div className="max-w-100 mx-auto p-6 rounded-2xl shadow-lg transition-colors duration-300 ease-in-out bg-white dark:bg-[#2d2d2d]">
          <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-600 pb-3 mb-5">
            <h2 className="m-0 text-xl font-bold">Profile Settings</h2>
            <button
              onClick={resetProfile}
              className="px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors active:scale-95"
            >
              Reset
            </button>
          </div>

          <div className="mb-4">
            <label className="block mb-1.5 font-bold text-sm opacity-90">
              Name
            </label>
            <input
              type="text"
              value={user.name}
              onChange={updateName}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#444] text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:focus:ring-blue-400"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1.5 font-bold text-sm opacity-90">
              Age
            </label>
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold tabular-nums">{user.age}</span>
              <button
                onClick={incrementAge}
                className="px-3 py-1 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold transition-colors active:scale-95"
              >
                + 1
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-1.5 font-bold text-sm opacity-90">
              Bio
            </label>
            <textarea
              value={user.profile.bio}
              onChange={updateBio}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#444] text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:focus:ring-blue-400 resize-none"
            />
          </div>

          <h3 className="border-b border-gray-200 dark:border-gray-600 pb-2 mt-8 mb-4 text-lg font-semibold">
            Preferences
          </h3>

          <div className="flex justify-between items-center mb-4 text-sm">
            <span>
              Theme:{" "}
              <strong className="capitalize">
                {user.profile.preferences.theme}
              </strong>
            </span>
            <button
              onClick={toggleTheme}
              className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-900 dark:bg-gray-600 dark:hover:bg-gray-500 text-white font-semibold transition-colors active:scale-95"
            >
              Toggle Theme
            </button>
          </div>

          <div className="flex justify-between items-center mb-4 text-sm">
            <span>
              Notifications:{" "}
              <strong
                className={
                  user.profile.preferences.notifications
                    ? "text-green-600 dark:text-green-400"
                    : "text-gray-500 dark:text-gray-400"
                }
              >
                {user.profile.preferences.notifications ? "ON" : "OFF"}
              </strong>
            </span>
            <button
              onClick={toggleNotifications}
              className={`px-3 py-1.5 rounded-lg text-white font-semibold transition-colors active:scale-95 ${
                user.profile.preferences.notifications
                  ? "bg-gray-500 hover:bg-gray-600"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {user.profile.preferences.notifications ? "Turn Off" : "Turn On"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
```

### 处理数组

```tsx
import { useRef, useState } from "react";
import { useImmer } from "use-immer";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

function App() {
  const [todos, setTodos] = useImmer<Todo[]>([]);
  const [inputValue, setInputValue] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedText = inputValue.trim();
    if (!trimmedText) return;

    setTodos((draft) => {
      draft.push({
        id: Date.now(),
        text: trimmedText,
        completed: false,
      });
    });

    setInputValue("");
    inputRef.current?.focus();
  };

  const toggleTodo = (id: number) => {
    setTodos((draft) => {
      const todo = draft.find((todo) => todo.id === id);
      if (todo) {
        todo.completed = !todo.completed;
      }
    });
  };

  const removeTodo = (id: number) => {
    setTodos((draft) => {
      const index = draft.findIndex((todo) => todo.id === id);
      if (index !== -1) {
        draft.splice(index, 1);
      }
    });
  };

  const completedCount = todos.filter((todo) => todo.completed).length;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-100 via-slate-50 to-slate-200 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Main Card */}
        <div className="overflow-hidden rounded-4xl border border-white/40 bg-white/80 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.08)]">
          {/* Hero Header */}
          <div className="relative overflow-hidden border-b border-slate-100 px-8 pt-10 pb-8">
            <div className="absolute inset-0 bg-linear-to-r from-blue-500/5 via-violet-500/5 to-cyan-500/5" />

            <div className="relative">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold tracking-tight text-slate-800">
                    ✨ Todo List
                  </h1>

                  <p className="mt-3 text-slate-500">
                    Organize your thoughts and stay productive.
                  </p>
                </div>

                <div className="hidden sm:flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 to-violet-500 text-2xl shadow-lg shadow-blue-500/20">
                  📝
                </div>
              </div>

              {/* Stats */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-slate-200 bg-white/70 p-4">
                  <div className="text-sm text-slate-500">Total Tasks</div>

                  <div className="mt-1 text-3xl font-bold text-slate-800">
                    {todos.length}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white/70 p-4">
                  <div className="text-sm text-slate-500">Completed</div>

                  <div className="mt-1 text-3xl font-bold text-green-500">
                    {completedCount}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className="p-6 border-b border-slate-100">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="What needs to be done?"
                autoFocus
                className="
                  h-14
                  flex-1
                  rounded-2xl
                  border
                  border-slate-200
                  bg-slate-50
                  px-5
                  text-slate-700
                  placeholder:text-slate-400
                  outline-none
                  transition-all
                  focus:border-blue-400
                  focus:bg-white
                  focus:ring-4
                  focus:ring-blue-100
                "
              />

              <button
                type="submit"
                className="
                  h-14
                  rounded-2xl
                  bg-linear-to-r
                  from-blue-500
                  to-violet-500
                  px-8
                  font-semibold
                  text-white
                  shadow-lg
                  shadow-blue-500/20
                  transition-all
                  hover:scale-[1.02]
                  hover:shadow-xl
                  active:scale-[0.98]
                "
              >
                Add Task
              </button>
            </form>
          </div>

          {/* Todo List */}
          <div className="max-h-125 overflow-y-auto p-6">
            {todos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-6 text-7xl">🚀</div>

                <h3 className="text-2xl font-bold text-slate-700">
                  No tasks yet
                </h3>

                <p className="mt-2 max-w-sm text-slate-400">
                  Start by adding your first task above and stay organized.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {todos.map((todo) => (
                  <div
                    key={todo.id}
                    className="
                      group
                      flex
                      items-center
                      justify-between
                      gap-4
                      rounded-2xl
                      border
                      border-slate-200
                      bg-white
                      px-5
                      py-4
                      shadow-sm
                      transition-all
                      hover:-translate-y-0.5
                      hover:border-slate-300
                      hover:shadow-lg
                    "
                  >
                    <label className="flex flex-1 cursor-pointer items-center gap-4">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleTodo(todo.id)}
                        className="
                          h-5
                          w-5
                          rounded-md
                          border-slate-300
                          text-blue-500
                          focus:ring-blue-400
                        "
                      />

                      <span
                        className={`text-[15px] transition-all break-all ${
                          todo.completed
                            ? "text-slate-400 line-through"
                            : "text-slate-700"
                        }`}
                      >
                        {todo.text}
                      </span>
                    </label>

                    <button
                      onClick={() => removeTodo(todo.id)}
                      className="
                        opacity-0
                        group-hover:opacity-100
                        rounded-xl
                        bg-red-50
                        px-4
                        py-2
                        text-sm
                        font-medium
                        text-red-500
                        transition-all
                        hover:bg-red-100
                      "
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {todos.length > 0 && (
            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/80 px-6 py-4 text-sm text-slate-500">
              <span>
                Progress:{" "}
                <strong className="text-slate-700">
                  {Math.round((completedCount / todos.length) * 100)}%
                </strong>
              </span>

              <span>
                {completedCount} of {todos.length} completed
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
```

## useImmerReducer

```tsx
import { useImmerReducer } from "use-immer";

type State = {
  count: number;
  history: number[];
  isLoading: boolean;
};

type Action =
  | { type: "RESET" }
  | { type: "INCREMENT" }
  | { type: "DECREMENT" }
  | { type: "ADD_TO_HISTORY" }
  | { type: "SET_LOADING"; payload: boolean };

const initialState: State = {
  count: 0,
  history: [],
  isLoading: false,
};

function reducer(draft: State, action: Action) {
  switch (action.type) {
    case "RESET":
      return initialState;
    case "INCREMENT":
      draft.count += 1;
      break;
    case "DECREMENT":
      draft.count -= 1;
      break;
    case "SET_LOADING":
      draft.isLoading = action.payload;
      break;
    case "ADD_TO_HISTORY":
      draft.history.unshift(draft.count);
      if (draft.history.length > 20) {
        draft.history.pop();
      }
      break;
    default:
      break;
  }
}

function App() {
  const [state, dispatch] = useImmerReducer(reducer, initialState);

  const handleAsyncIncrement = () => {
    dispatch({ type: "SET_LOADING", payload: true });
    setTimeout(() => {
      dispatch({ type: "INCREMENT" });
      dispatch({ type: "ADD_TO_HISTORY" });
      dispatch({ type: "SET_LOADING", payload: false });
    }, 1000);
  };

  const handleIncrement = () => {
    dispatch({ type: "INCREMENT" });
  };

  const handleDecrement = () => {
    dispatch({ type: "DECREMENT" });
  };

  const handleSaveToHistory = () => {
    dispatch({ type: "ADD_TO_HISTORY" });
  };

  const handleReset = () => {
    dispatch({ type: "RESET" });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      {/* Glow */}
      <div className="absolute left-1/2 top-1/2 h-125 w-125 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/20 blur-[120px]" />

      {/* Card */}
      <div className="relative w-full max-w-md overflow-hidden rounded-4xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
        {/* Header */}
        <div className="border-b border-white/10 px-8 pt-8 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Counter
              </h1>

              <p className="mt-1 text-sm text-slate-400">
                Immer reducer state management
              </p>
            </div>

            {state.isLoading && (
              <div className="rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300 backdrop-blur">
                Updating...
              </div>
            )}
          </div>
        </div>

        {/* Counter */}
        <div className="relative px-8 pt-12 pb-10">
          <div className="flex justify-center">
            <div
              className={`
                text-8xl
                font-black
                tracking-tight
                tabular-nums
                transition-all
                duration-300
                ${
                  state.count > 0
                    ? "text-emerald-400"
                    : state.count < 0
                      ? "text-red-400"
                      : "text-white"
                }
              `}
            >
              {state.count}
            </div>
          </div>

          {/* Mini Stats */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-center">
              <div className="text-xs text-slate-500">Logs</div>

              <div className="mt-1 text-lg font-bold text-white">
                {state.history.length}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-center">
              <div className="text-xs text-slate-500">Status</div>

              <div className="mt-1 text-lg font-bold text-violet-300">
                {state.isLoading ? "Busy" : "Ready"}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 px-6 pb-6">
          {/* Main */}
          <div className="flex gap-3">
            <button
              onClick={handleDecrement}
              className="
                flex-1
                rounded-2xl
                border
                border-white/10
                bg-white/5
                px-5
                py-4
                text-lg
                font-semibold
                text-white
                transition-all
                hover:bg-white/10
                active:scale-95
              "
            >
              −1
            </button>

            <button
              onClick={handleIncrement}
              className="
                flex-[1.4]
                rounded-2xl
                bg-linear-to-r
                from-violet-500
                to-fuchsia-500
                px-5
                py-4
                text-lg
                font-semibold
                text-white
                shadow-lg
                shadow-violet-500/20
                transition-all
                hover:scale-[1.02]
                hover:shadow-xl
                active:scale-95
              "
            >
              +1
            </button>
          </div>

          {/* Secondary */}
          <div className="grid grid-cols-3 gap-3">
            <button
              disabled={state.isLoading}
              onClick={handleAsyncIncrement}
              className="
                rounded-xl
                border
                border-white/10
                bg-white/5
                px-3
                py-3
                text-sm
                font-medium
                text-slate-200
                transition-all
                hover:bg-white/10
                disabled:opacity-40
              "
            >
              Async
            </button>

            <button
              onClick={handleSaveToHistory}
              className="
                rounded-xl
                border
                border-white/10
                bg-white/5
                px-3
                py-3
                text-sm
                font-medium
                text-slate-200
                transition-all
                hover:bg-white/10
              "
            >
              Save
            </button>

            <button
              onClick={handleReset}
              className="
                rounded-xl
                border
                border-red-500/20
                bg-red-500/10
                px-3
                py-3
                text-sm
                font-medium
                text-red-300
                transition-all
                hover:bg-red-500/20
              "
            >
              Reset
            </button>
          </div>
        </div>

        {/* History */}
        <div className="border-t border-white/10 px-6 py-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              History
            </h3>

            <span className="text-xs text-slate-600">Latest first</span>
          </div>

          {state.history.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 py-8 text-center text-sm text-slate-500">
              No history records
            </div>
          ) : (
            <div className="flex max-h-40 flex-wrap gap-2 overflow-y-auto pr-1">
              {state.history.map((item, index) => (
                <div
                  key={index}
                  className="
                    rounded-full
                    border
                    border-white/10
                    bg-white/5
                    px-3
                    py-1.5
                    text-sm
                    font-medium
                    text-slate-200
                    backdrop-blur
                  "
                >
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
```

## 与 useState 的对比

| 特性     | useState       | useImmer        |
| -------- | -------------- | --------------- |
| 基本类型 | 简单直接       | 相同体验        |
| 对象更新 | 需要手动展开   | 直接修改        |
| 数组操作 | 需要创建新数组 | 使用原生方法    |
| 嵌套更新 | 复杂且易错     | 简单直观        |
| 性能     | 优化           | 优化(immer优化) |

## 注意事项

1. **不要直接修改 draft 外的对象**：immer 只能追踪在 draft 函数内的修改
2. **返回值处理**：如果更新函数返回一个值，它会替换整个状态
3. **异步操作**：在异步回调中使用 setState 时要注意闭包问题
