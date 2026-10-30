import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR } from "next/font/google";
import { ServiceWorker } from "./_components/ServiceWorker";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "메모",
  description: "메모 앱",
  // iPhone 홈 화면에 추가했을 때의 이름과 앱처럼 여는 설정
  appleWebApp: { capable: true, title: "메모", statusBarStyle: "default" },
  // Next.js는 mobile-web-app-capable만 넣어 주므로, 예전 iOS가 읽는 이름도 함께 넣는다.
  other: { "apple-mobile-web-app-capable": "yes" },
};

// 상단 상태 표시줄 색을 surface/page에 맞춘다.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F2F4F6" },
    { media: "(prefers-color-scheme: dark)", color: "#101014" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${notoSansKr.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
        <ServiceWorker />
      </body>
    </html>
  );
}
