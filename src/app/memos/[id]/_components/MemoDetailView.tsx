"use client";

import { Badge } from "@/components/Badge";
import { ButtonPrimary } from "@/components/ButtonPrimary";
import { Card } from "@/components/Card";
import { IconButton } from "@/components/IconButton";
import { MemoBody } from "@/components/MemoBody";
import { Screen } from "@/components/Screen";
import { useMemos } from "@/lib/memoStore";

const backButton = <IconButton icon="chevron-left" label="뒤로가기" href="/" />;

// Supabase에서 메모를 불러온 뒤 그린다. 불러오는 동안에는 뼈대만 보인다.
export function MemoDetailView({ id }: { id: string }) {
  const { memos, error } = useMemos();
  const memo = memos?.find((item) => item.id === id);

  if (!memo) {
    const message = error ? "메모를 불러오지 못했어요." : memos && "메모를 찾을 수 없어요.";
    return (
      <Screen nav={backButton} footer={null}>
        {message && (
          <Card type="content">
            <p className="text-body-md text-text-secondary">{message}</p>
          </Card>
        )}
      </Screen>
    );
  }

  return (
    <Screen
      nav={
        <>
          {backButton}
          <div className="flex">
            <IconButton icon="pin-24" label={memo.pinned ? "고정 풀기" : "고정하기"} />
            <IconButton icon="share" label="공유하기" />
            <IconButton icon="more" label="더보기" />
          </div>
        </>
      }
      footer={<ButtonPrimary href={`/memos/${memo.id}/edit`} label="수정하기" />}
    >
      <Card type="content">
        <div className="flex items-center gap-8">
          <Badge label={memo.category} color={memo.label} />
          <span className="whitespace-nowrap text-caption-sm text-text-muted">
            {memo.createdAt}
          </span>
        </div>
        <h1 className="text-heading-lg text-text-primary">{memo.title}</h1>
        <hr className="h-px border-0 bg-border-default" />
        <MemoBody blocks={memo.body} />
        {memo.editedAt && (
          <p className="text-caption-sm text-text-muted">{memo.editedAt}</p>
        )}
      </Card>
    </Screen>
  );
}
