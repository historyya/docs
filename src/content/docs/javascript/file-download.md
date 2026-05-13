---
title: File Download
description: File Download
sidebar:
  order: 51
---

## 直接打开下载地址

缺点：无法命名文件名，只适用于 get 请求，并且直接返回 blob 的接口

```js
windows.open('http://localhost:3000/download/', '_blank)
```

## 利用 a 标签的 download 属性

```tsx
import { createFileRoute } from "@tanstack/react-router";
import axios, { type AxiosProgressEvent } from "axios";
import { AlertCircle, CheckCircle2, Download, Loader2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "#/components/ui/button";

export const Route = createFileRoute("/download/")({
  component: RouteComponent,
});

const downloadUrl = "http://localhost:3000/download/";
const fallbackFileName = "download.bin";

type DownloadState = "idle" | "downloading" | "completed" | "error";

function formatBytes(n: number) {
  if (n < 1024) {
    return `${n} B`;
  }
  if (n < 1024 * 1024) {
    return `${(n / 1024).toFixed(1)} KB`;
  }
  if (n < 1024 * 1024 * 1024) {
    return `${(n / 1024 / 1024).toFixed(2)} MB`;
  }
  return `${(n / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

function parseFileNameFromHeader(header?: string): string | null {
  if (!header) {
    return null;
  }
  // RFC 5987: filename*=UTF-8''xxx
  const star = /filename\*\s*=\s*[^']*''([^;]+)/i.exec(header);
  if (star?.[1]) {
    try {
      return decodeURIComponent(star[1]);
    } catch {
      return star[1];
    }
  }
  // 普通: filename="xxx" 或 filename=xxx
  const plain = /filename\s*=\s*"?([^";]+)"?/i.exec(header);
  return plain?.[1] ?? null;
}

function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  // 延后回收，确保浏览器已经开始消费这个 URL
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

function RouteComponent() {
  const [state, setState] = useState<DownloadState>("idle");
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(0);
  const [total, setTotal] = useState(0);
  const [fileName, setFileName] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const handleDownload = async () => {
    setError("");
    setLoaded(0);
    setTotal(0);
    setFileName("");
    setState("downloading");

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await axios.get<Blob>(downloadUrl, {
        responseType: "blob",
        signal: controller.signal,
        onDownloadProgress: (e: AxiosProgressEvent) => {
          setLoaded(e.loaded);
          if (e.total) {
            setTotal(e.total);
          }
        },
      });

      const headerName = parseFileNameFromHeader(
        res.headers["content-disposition"] as string | undefined,
      );
      const name = headerName ?? fallbackFileName;
      setFileName(name);
      triggerBlobDownload(res.data, name);
      setState("completed");
    } catch (err) {
      if (axios.isCancel(err) || (err as Error)?.name === "CanceledError") {
        setState("idle");
        return;
      }
      console.error("下载失败", err);
      setError(
        err instanceof Error && err.message ? err.message : "下载失败，请重试",
      );
      setState("error");
    }
  };

  const handleCancel = () => {
    abortRef.current?.abort();
  };

  const isDownloading = state === "downloading";
  const isCompleted = state === "completed";
  const isErrored = state === "error";
  const progress = total > 0 ? Math.min(100, (loaded / total) * 100) : 0;

  return (
    <main className="min-h-dvh bg-muted/30 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-5">
        <header className="flex flex-col gap-2">
          <p className="text-sm font-medium text-muted-foreground">文件下载</p>
          <h1 className="text-2xl font-semibold tracking-normal text-foreground">
            下载文件
          </h1>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground break-all">
            来源：{downloadUrl}
          </p>
        </header>

        <section className="overflow-hidden rounded-xl border bg-background shadow-sm">
          <div className="flex flex-col gap-4 p-4 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-lg border bg-muted/30">
                  <Download className="size-5 text-muted-foreground" />
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {fileName || "等待开始下载"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {total > 0
                      ? `${formatBytes(loaded)} / ${formatBytes(total)}`
                      : loaded > 0
                        ? `已接收 ${formatBytes(loaded)}`
                        : "点击按钮开始下载"}
                  </p>
                </div>
              </div>
              <span className="text-sm font-medium text-foreground">
                {total > 0 ? `${progress.toFixed(1)}%` : ""}
              </span>
            </div>

            {isDownloading || isCompleted || isErrored ? (
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className={[
                    "h-full transition-all",
                    isErrored
                      ? "bg-destructive"
                      : isCompleted
                        ? "bg-emerald-500"
                        : "bg-primary",
                  ].join(" ")}
                  style={{
                    width: `${isCompleted ? 100 : total > 0 ? progress : 30}%`,
                  }}
                />
              </div>
            ) : null}
          </div>

          <div className="flex flex-col gap-3 border-t bg-background px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="min-h-5">
              {error ? (
                <p className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="size-4" />
                  {error}
                </p>
              ) : isCompleted ? (
                <p className="flex items-center gap-2 text-sm text-emerald-700">
                  <CheckCircle2 className="size-4" />
                  下载完成
                </p>
              ) : isDownloading ? (
                <p className="flex items-center gap-2 text-sm text-primary">
                  <Loader2 className="size-4 animate-spin" />
                  正在下载…
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  点击右侧按钮以开始下载。
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {isDownloading ? (
                <Button
                  onClick={handleCancel}
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  <X className="size-4" />
                  取消
                </Button>
              ) : null}
              <Button
                disabled={isDownloading}
                onClick={() => void handleDownload()}
                type="button"
                className="w-full sm:w-auto"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    下载中
                  </>
                ) : isErrored ? (
                  <>
                    <Download className="size-4" />
                    重试
                  </>
                ) : isCompleted ? (
                  <>
                    <Download className="size-4" />
                    再次下载
                  </>
                ) : (
                  <>
                    <Download className="size-4" />
                    开始下载
                  </>
                )}
              </Button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
```

## file-saver.js

```bash
npm install file-saver --save
```

```tsx
import { createFileRoute } from "@tanstack/react-router";
import axios, { type AxiosProgressEvent } from "axios";
import { AlertCircle, CheckCircle2, Download, Loader2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "#/components/ui/button";
import { saveAs } from "file-saver";

export const Route = createFileRoute("/download/")({
  component: RouteComponent,
});

const downloadUrl = "http://localhost:3000/download/";
const fallbackFileName = "download.bin";

type DownloadState = "idle" | "downloading" | "completed" | "error";

function formatBytes(n: number) {
  if (n < 1024) {
    return `${n} B`;
  }
  if (n < 1024 * 1024) {
    return `${(n / 1024).toFixed(1)} KB`;
  }
  if (n < 1024 * 1024 * 1024) {
    return `${(n / 1024 / 1024).toFixed(2)} MB`;
  }
  return `${(n / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

function parseFileNameFromHeader(header?: string): string | null {
  if (!header) {
    return null;
  }
  // RFC 5987: filename*=UTF-8''xxx
  const star = /filename\*\s*=\s*[^']*''([^;]+)/i.exec(header);
  if (star?.[1]) {
    try {
      return decodeURIComponent(star[1]);
    } catch {
      return star[1];
    }
  }
  // 普通: filename="xxx" 或 filename=xxx
  const plain = /filename\s*=\s*"?([^";]+)"?/i.exec(header);
  return plain?.[1] ?? null;
}

function RouteComponent() {
  const [state, setState] = useState<DownloadState>("idle");
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(0);
  const [total, setTotal] = useState(0);
  const [fileName, setFileName] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const handleDownload = async () => {
    setError("");
    setLoaded(0);
    setTotal(0);
    setFileName("");
    setState("downloading");

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await axios.get<Blob>(downloadUrl, {
        responseType: "blob",
        signal: controller.signal,
        onDownloadProgress: (e: AxiosProgressEvent) => {
          setLoaded(e.loaded);
          if (e.total) {
            setTotal(e.total);
          }
        },
      });

      const headerName = parseFileNameFromHeader(
        res.headers["content-disposition"] as string | undefined,
      );
      const name = headerName ?? fallbackFileName;
      setFileName(name);
      saveAs(res.data, name);
      setState("completed");
    } catch (err) {
      if (axios.isCancel(err) || (err as Error)?.name === "CanceledError") {
        setState("idle");
        return;
      }
      console.error("下载失败", err);
      setError(
        err instanceof Error && err.message ? err.message : "下载失败，请重试",
      );
      setState("error");
    }
  };

  const handleCancel = () => {
    abortRef.current?.abort();
  };

  const isDownloading = state === "downloading";
  const isCompleted = state === "completed";
  const isErrored = state === "error";
  const progress = total > 0 ? Math.min(100, (loaded / total) * 100) : 0;

  return (
    <main className="min-h-dvh bg-muted/30 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-5">
        <header className="flex flex-col gap-2">
          <p className="text-sm font-medium text-muted-foreground">文件下载</p>
          <h1 className="text-2xl font-semibold tracking-normal text-foreground">
            下载文件
          </h1>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground break-all">
            来源：{downloadUrl}
          </p>
        </header>

        <section className="overflow-hidden rounded-xl border bg-background shadow-sm">
          <div className="flex flex-col gap-4 p-4 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-lg border bg-muted/30">
                  <Download className="size-5 text-muted-foreground" />
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {fileName || "等待开始下载"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {total > 0
                      ? `${formatBytes(loaded)} / ${formatBytes(total)}`
                      : loaded > 0
                        ? `已接收 ${formatBytes(loaded)}`
                        : "点击按钮开始下载"}
                  </p>
                </div>
              </div>
              <span className="text-sm font-medium text-foreground">
                {total > 0 ? `${progress.toFixed(1)}%` : ""}
              </span>
            </div>

            {isDownloading || isCompleted || isErrored ? (
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className={[
                    "h-full transition-all",
                    isErrored
                      ? "bg-destructive"
                      : isCompleted
                        ? "bg-emerald-500"
                        : "bg-primary",
                  ].join(" ")}
                  style={{
                    width: `${isCompleted ? 100 : total > 0 ? progress : 30}%`,
                  }}
                />
              </div>
            ) : null}
          </div>

          <div className="flex flex-col gap-3 border-t bg-background px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="min-h-5">
              {error ? (
                <p className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="size-4" />
                  {error}
                </p>
              ) : isCompleted ? (
                <p className="flex items-center gap-2 text-sm text-emerald-700">
                  <CheckCircle2 className="size-4" />
                  下载完成
                </p>
              ) : isDownloading ? (
                <p className="flex items-center gap-2 text-sm text-primary">
                  <Loader2 className="size-4 animate-spin" />
                  正在下载…
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  点击右侧按钮以开始下载。
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {isDownloading ? (
                <Button
                  onClick={handleCancel}
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  <X className="size-4" />
                  取消
                </Button>
              ) : null}
              <Button
                disabled={isDownloading}
                onClick={() => void handleDownload()}
                type="button"
                className="w-full sm:w-auto"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    下载中
                  </>
                ) : isErrored ? (
                  <>
                    <Download className="size-4" />
                    重试
                  </>
                ) : isCompleted ? (
                  <>
                    <Download className="size-4" />
                    再次下载
                  </>
                ) : (
                  <>
                    <Download className="size-4" />
                    开始下载
                  </>
                )}
              </Button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
```
