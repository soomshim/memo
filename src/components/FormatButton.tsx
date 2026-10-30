type FormatButtonProps = {
  label: string;
  active?: boolean;
  onPress: () => void;
};

// 서식 버튼. 커서가 있는 글자의 서식이면 active로 보인다.
export function FormatButton({ label, active = false, onPress }: FormatButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      // 누르는 순간 편집기의 글자 선택이 풀리지 않게 한다.
      onMouseDown={(event) => event.preventDefault()}
      onClick={onPress}
      className={`flex h-[36px] shrink-0 items-center justify-center whitespace-nowrap rounded-sm px-12 text-label-md ${
        active ? "bg-label-blue-soft text-primary" : "text-text-secondary"
      }`}
    >
      {label}
    </button>
  );
}
