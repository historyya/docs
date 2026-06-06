---
title: 自定义hook
description: 自定义hook
sidebar:
  order: 29
---

## 自定义hook的规则

1. 自定义hook必须以`use`开头
2. 自定义hook可以调用其他hook

## 用法

案例一：水印

```ts
// src/hooks/useWatermark.ts
import { useEffect, useState } from "react";

// 定义水印的配置项
interface WatermarkOptions {
  content: string; // 水印文本
  width?: number; // 水印宽度
  height?: number; // 水印高度
  fontSize?: number; // 水印字体大小
  fontColor?: string; // 水印字体颜色
  zIndex?: number; // 水印层级
  rotate?: number; // 水印旋转角度
  gapX?: number; // 水印横向间距
  gapY?: number; // 水印纵向间距
}

// 定义默认配置项
const defaultOptions = (): Partial<WatermarkOptions> => {
  // 默认铺满整个页面
  const { width, height } = document.documentElement.getBoundingClientRect();
  return {
    width: width,
    height: height,
    fontSize: 16,
    fontColor: "black",
    zIndex: 9999,
    rotate: -30,
    gapX: 200,
    gapY: 100,
  };
};

export const useWatermark = (options: WatermarkOptions) => {
  const [watermarkOptions, setWatermarkOptions] =
    useState<WatermarkOptions>(options);

  const opts = Object.assign({}, defaultOptions(), watermarkOptions);
  const updateWatermark = (newOptions: Partial<WatermarkOptions>) => {
    setWatermarkOptions((prev) => ({
      ...prev,
      ...newOptions,
    }));
  };

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    canvas.width = opts.gapX!;
    canvas.height = opts.gapY!;
    // 默认
    ctx.translate(opts.gapX! / 2, opts.gapY! / 2);
    ctx.rotate((opts.rotate! * Math.PI) / 180);
    ctx.font = `${opts.fontSize}px sans-serif`;
    ctx.textAlign = "center";
    ctx.fillStyle = opts.fontColor!;
    ctx.globalAlpha = 0.15;
    ctx.fillText(opts.content, 0, 0);
    const watermarkDiv = document.createElement("div");
    watermarkDiv.id = "watermark";
    watermarkDiv.style.position = "fixed";
    watermarkDiv.style.top = "0";
    watermarkDiv.style.left = "0";
    watermarkDiv.style.width = `${opts.width}px`;
    watermarkDiv.style.height = `${opts.height}px`;
    watermarkDiv.style.pointerEvents = "none";
    watermarkDiv.style.zIndex = `${opts.zIndex}`;
    watermarkDiv.style.overflow = "hidden";
    watermarkDiv.style.backgroundImage = `url(${canvas.toDataURL()})`;
    watermarkDiv.style.backgroundSize = `${opts.gapX}px ${opts.gapY}px`;
    document.body.appendChild(watermarkDiv);

    return () => {
      document.body.removeChild(watermarkDiv);
    };
  }, [opts]);

  return [updateWatermark, opts] as const;
};
```

```tsx
import { useWatermark } from "./hooks/useWatermark";

function App() {
  const [updateWatermark, opts] = useWatermark({
    content: "财务专用",
  });

  const handleUpdate = () => {
    updateWatermark({
      content: "公章专用",
    });
  };

  return (
    <>
      <div>{JSON.stringify(opts)}</div>
      <button onClick={handleUpdate}>更新水印</button>
    </>
  );
}

export default App;
```
