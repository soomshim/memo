"use client";

import { useEffect } from "react";

// 배포된 앱에서만 서비스 워커(public/sw.js)를 등록한다. 개발 중에는 화면 갱신을 방해하지 않게 건너뛴다.
export function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" }).catch(() => {
      // 등록에 실패해도 메모 앱은 그대로 쓸 수 있다.
    });
  }, []);
  return null;
}
