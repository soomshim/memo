import type { MemoLabel } from "@/lib/memos";

const badgeClass: Record<MemoLabel, string> = {
  blue: "bg-label-blue-soft text-label-blue",
  green: "bg-label-green-soft text-label-green",
  orange: "bg-label-orange-soft text-label-orange",
  pink: "bg-label-pink-soft text-label-pink",
};

export function Badge({ label, color }: { label: string; color: MemoLabel }) {
  return (
    <span
      className={`shrink-0 whitespace-nowrap rounded-full px-8 py-4 text-caption-sm ${badgeClass[color]}`}
    >
      {label}
    </span>
  );
}
