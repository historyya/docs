---
title: useReducer
description: useReducer
sidebar:
  order: 2
---

useReducer 是集中式的管理状态。用在复杂的数据类型上

## 用法

```tsx
import { useReducer } from "react";

const initState = { count: 0 };

type State = typeof initState;
type Action = { type: "increment" | "decrement" };

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "increment":
      return { ...state, count: state.count + 1 };
    case "decrement":
      return { ...state, count: state.count - 1 };
    default:
      return state;
  }
};

const createInitialState = () => {
  return {
    count: 100,
  };
};

function App() {
  // 参数：
  // 1. reducer是一个处理函数，用于更新状态，reducer中包含了两个参数，第一个参数是state，第二个参数是action。reducer会返回一个新的state
  // 2. initialArg是state的初始值
  // 3. init是一个可选函数，用于初始化state，如果写了init函数，初始值则使用init函数的返回值
  const [state, dispatch] = useReducer(reducer, initState, createInitialState);

  const handleIncrement = () => {
    dispatch({ type: "increment" });
  };

  const handleDecrement = () => {
    dispatch({ type: "decrement" });
  };

  return (
    <>
      <h2>Count: {state.count}</h2>
      <button onClick={handleIncrement}>+</button>
      <button onClick={handleDecrement}>-</button>
    </>
  );
}

export default App;
```

```tsx
import { useMemo, useReducer } from "react";

const initState = [
  { id: 1, name: "Apple", price: 10, count: 10, isSale: false },
  { id: 2, name: "Banana", price: 20, count: 20, isSale: true },
  { id: 3, name: "Orange", price: 30, count: 30, isSale: false },
];

type State = typeof initState;
type Action =
  | {
      type: "ADD_COUNT" | "SUB_COUNT" | "DELETE_PRODUCT" | "EDIT_STATUS";
      id: number;
    }
  | {
      type: "UPDATE_NAME";
      id: number;
      newNane: string;
    };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_COUNT":
      return state.map((item) =>
        item.id === action.id ? { ...item, count: item.count + 1 } : item,
      );
    case "SUB_COUNT":
      return state.map((item) =>
        item.id === action.id
          ? { ...item, count: Math.max(0, item.count - 1) }
          : item,
      );
    case "DELETE_PRODUCT":
      return state.filter((item) => item.id !== action.id);
    case "EDIT_STATUS":
      return state.map((item) =>
        item.id === action.id ? { ...item, isSale: !item.isSale } : item,
      );
    case "UPDATE_NAME":
      return state.map((item) =>
        item.id === action.id ? { ...item, name: action.newNane } : item,
      );
    default:
      return state;
  }
};

function App() {
  const [state, dispatch] = useReducer(reducer, initState);

  const totalPrice = useMemo(() => {
    return state.reduce((acc, item) => acc + item.price * item.count, 0);
  }, [state]);

  const handleUpdateName = (id: number, currentName: string) => {
    const newName = window.prompt("Please enter a new name:", currentName);
    if (newName && newName.trim() !== "" && newName !== currentName) {
      dispatch({ type: "UPDATE_NAME", id, newNane: newName.trim() });
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>Product Management</h2>
      <table
        style={{
          width: "100%",
          maxWidth: "800px",
          borderCollapse: "collapse",
          textAlign: "left",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        }}
      >
        <thead style={{ backgroundColor: "#f4f4f4" }}>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Total Price</th>
            <th>Count</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {state.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ padding: "20px", textAlign: "center" }}>
                No products available.
              </td>
            </tr>
          ) : (
            state.map((item) => (
              <tr key={item.id} style={{ borderBottom: "1px solid #ddd" }}>
                <td>{item.id}</td>
                <td>
                  <strong>{item.name}</strong>
                </td>
                <td>${(item.price * item.count).toFixed(2)}</td>
                <td>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <button
                      disabled={item.count <= 0}
                      onClick={() =>
                        dispatch({ type: "SUB_COUNT", id: item.id })
                      }
                    >
                      -
                    </button>
                    <span style={{ minWidth: "20px", textAlign: "center" }}>
                      {item.count}
                    </span>
                    <button
                      onClick={() =>
                        dispatch({ type: "ADD_COUNT", id: item.id })
                      }
                    >
                      +
                    </button>
                  </div>
                </td>
                <td>
                  <button
                    style={{
                      backgroundColor: item.isSale ? "#4caf50" : "#f44336",
                    }}
                    onClick={() =>
                      dispatch({ type: "EDIT_STATUS", id: item.id })
                    }
                  >
                    {item.isSale ? "Sale" : "Not Sale"}
                  </button>
                </td>
                <td>
                  <button
                    style={{ backgroundColor: "#2196f3" }}
                    onClick={() => handleUpdateName(item.id, item.name)}
                  >
                    Edit Name
                  </button>
                  <button
                    style={{ backgroundColor: "#f44336", marginLeft: "8px" }}
                    onClick={() =>
                      dispatch({
                        type: "DELETE_PRODUCT",
                        id: item.id,
                      })
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={6} style={{ textAlign: "right", fontWeight: "bold" }}>
              Total Value: ${totalPrice.toFixed(2)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default App;
```
