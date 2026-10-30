import { Suspense } from "react";
import { ButtonPrimary } from "@/components/ButtonPrimary";
import { Screen } from "@/components/Screen";
import { MemoBoard } from "./_components/MemoBoard";
import { MemoCount } from "./_components/MemoCount";
import { TodayLabel } from "./_components/TodayLabel";

export default function Home() {
  return (
    <Screen footer={<ButtonPrimary href="/memos/new" label="새 메모 쓰기" icon />}>
      <header className="flex flex-col gap-8 px-8">
        <p className="text-caption-md text-text-muted">
          <Suspense fallback={" "}>
            <TodayLabel />
          </Suspense>
        </p>
        <h1 className="text-heading-xl text-text-primary">
          <span className="block">오늘까지 메모를</span>
          <span className="block">
            <span className="text-primary">
              <MemoCount />
            </span>{" "}
            남겼어요
          </span>
        </h1>
      </header>
      <MemoBoard />
    </Screen>
  );
}
