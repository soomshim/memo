import Link from "next/link";
import type { Memo, MemoLabel } from "@/lib/memos";
import { Icon } from "./Icon";

const tileClass: Record<MemoLabel, string> = {
  blue: "bg-label-blue-soft text-label-blue",
  green: "bg-label-green-soft text-label-green",
  orange: "bg-label-orange-soft text-label-orange",
  pink: "bg-label-pink-soft text-label-pink",
};

export function MemoItem({ memo }: { memo: Memo }) {
  return (
    <Link href={`/memos/${memo.id}`} className="flex items-center gap-16 px-20 py-12">
      <span
        className={`flex size-[44px] shrink-0 items-center justify-center rounded-sm ${tileClass[memo.label]}`}
      >
        <Icon name="note" />
      </span>
      <span className="flex flex-1 flex-col gap-4 overflow-hidden">
        <span className="text-title-md text-text-primary">{memo.title}</span>
        <span className="truncate text-body-sm text-text-secondary">{memo.preview}</span>
      </span>
      <span className="shrink-0 whitespace-nowrap text-caption-sm text-text-muted">
        {memo.date}
      </span>
    </Link>
  );
}
