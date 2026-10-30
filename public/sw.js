// 홈 화면에 추가한 메모 앱이 브라우저 탭이 아니라 앱 화면으로 열리게 하는 서비스 워커.
// Android Chrome은 fetch 처리기가 있는 서비스 워커가 있어야 설치형 앱으로 추가한다.
// 메모는 Supabase에서 바로 읽으므로 따로 캐시하지 않고, 화면 요청만 네트워크로 그대로 넘긴다.

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode !== "navigate") return;
  event.respondWith(
    fetch(event.request).catch(
      () =>
        new Response("인터넷에 연결되어 있지 않아요.", {
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        }),
    ),
  );
});
