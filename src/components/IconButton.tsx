import Link from "next/link";
import { Icon, type IconName } from "./Icon";

type IconButtonProps = {
  icon: IconName;
  label: string;
  href?: string;
};

// 40×40 누르는 영역 가운데에 아이콘을 둔다. href가 있으면 링크, 없으면 버튼.
export function IconButton({ icon, label, href }: IconButtonProps) {
  const className =
    "flex size-[40px] shrink-0 items-center justify-center rounded-sm text-text-primary";

  if (href) {
    return (
      <Link href={href} aria-label={label} className={className}>
        <Icon name={icon} />
      </Link>
    );
  }
  return (
    <button type="button" aria-label={label} className={className}>
      <Icon name={icon} />
    </button>
  );
}
