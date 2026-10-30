"use client";

import { useState } from "react";
import { Card, CardHeader } from "@/components/Card";
import { Chip } from "@/components/Chip";
import { MemoItem } from "@/components/MemoItem";
import { useMemos } from "@/lib/memoStore";
import { categories, type MemoCategory } from "@/lib/memos";

export function MemoBoard() {
  const { memos, error } = useMemos();
  const [category, setCategory] = useState<MemoCategory | null>(null);

  const all = memos ?? [];
  const visible = category ? all.filter((memo) => memo.category === category) : all;
  const pinned = visible.filter((memo) => memo.pinned);
  const recent = visible.filter((memo) => !memo.pinned);

  return (
    <>
      <div className="flex w-full gap-8 overflow-x-auto px-4">
        <Chip label="전체" selected={category === null} onClick={() => setCategory(null)} />
        {categories.map((item) => (
          <Chip
            key={item}
            label={item}
            selected={category === item}
            onClick={() => setCategory(item)}
          />
        ))}
      </div>

      {error && (
        <Card type="content">
          <p className="text-body-md text-text-secondary">메모를 불러오지 못했어요.</p>
        </Card>
      )}

      {pinned.length > 0 && (
        <Card>
          <CardHeader title="고정한 메모" pin />
          {pinned.map((memo) => (
            <MemoItem key={memo.id} memo={memo} />
          ))}
        </Card>
      )}

      {recent.length > 0 && (
        <Card>
          <CardHeader title="최근 메모" actionHref="/memos" />
          {recent.map((memo) => (
            <MemoItem key={memo.id} memo={memo} />
          ))}
        </Card>
      )}
    </>
  );
}
