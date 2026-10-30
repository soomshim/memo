"use client";

import { useMemos } from "@/lib/memoStore";

// Supabase에 저장된 메모 수. 불러오는 동안에는 자리만 잡아 둔다.
export function MemoCount() {
  const { memos } = useMemos();
  if (!memos) return <span className="invisible" aria-hidden>0개</span>;
  return <>{memos.length}개</>;
}
