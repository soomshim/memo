import type { MetadataRoute } from "next";

// 휴대폰 홈 화면에 추가하면 주소창 없이 앱처럼 열린다.
// 색은 디자인 토큰 surface/page(Light) 값이다.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "메모",
    short_name: "메모",
    description: "메모 앱",
    lang: "ko",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#F2F4F6",
    theme_color: "#F2F4F6",
    icons: [
      { src: "/icons/app-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/app-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/app-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
