import Link from "next/link";
import { Icon } from "./Icon";

type ButtonPrimaryProps = {
  label: string;
  icon?: boolean;
} & ({ href: string; onClick?: never } | { href?: never; onClick: () => void });

const className =
  "flex w-full items-center justify-center gap-8 rounded-md bg-primary px-24 py-16 text-button-md text-text-on-primary";

// href가 있으면 다른 화면으로 가는 링크, onClick이 있으면 버튼.
export function ButtonPrimary({ href, onClick, label, icon = false }: ButtonPrimaryProps) {
  const content = (
    <>
      {icon && <Icon name="plus" />}
      <span className="whitespace-nowrap">{label}</span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  );
}
