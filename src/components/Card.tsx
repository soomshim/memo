import Link from "next/link";
import { Icon } from "./Icon";

type CardProps = {
  children: React.ReactNode;
  // list: 머리글과 메모 목록처럼 줄을 쌓는다. content: 메모 본문처럼 여백과 간격을 둔다.
  type?: "list" | "content";
};

export function Card({ children, type = "list" }: CardProps) {
  return (
    <section
      className={`flex w-full flex-col overflow-clip rounded-xl bg-surface-card ${
        type === "list" ? "py-8" : "gap-12 px-20 py-24"
      }`}
    >
      {children}
    </section>
  );
}

type CardHeaderProps = {
  title: string;
  pin?: boolean;
  actionHref?: string;
};

export function CardHeader({ title, pin = false, actionHref }: CardHeaderProps) {
  return (
    <div className="flex h-[40px] items-center gap-4 pt-12 pb-4 pl-20 pr-16">
      {pin && (
        <span className="text-primary">
          <Icon name="pin" />
        </span>
      )}
      <h2 className="flex-1 text-label-md text-text-primary">{title}</h2>
      {actionHref && (
        <Link
          href={actionHref}
          className="flex shrink-0 items-center gap-4 whitespace-nowrap text-caption-md text-text-muted"
        >
          전체 보기
          <Icon name="chevron-right" />
        </Link>
      )}
    </div>
  );
}
