type ChipProps = {
  label: string;
  selected?: boolean;
  onClick?: () => void;
};

export function Chip({ label, selected = false, onClick }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`flex h-[36px] shrink-0 items-center whitespace-nowrap rounded-full px-16 text-label-md ${
        selected
          ? "bg-primary text-text-on-primary"
          : "bg-surface-card text-text-secondary"
      }`}
    >
      {label}
    </button>
  );
}
