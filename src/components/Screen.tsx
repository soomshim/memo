type ScreenProps = {
  children?: React.ReactNode;
  // 위쪽 내비게이션 줄. 없으면 본문이 위에서 64 떨어져 시작한다.
  nav?: React.ReactNode;
  // 아래에 붙는 주 버튼. 본문이 스크롤돼도 화면 아래에 남는다.
  footer: React.ReactNode;
};

export function Screen({ children, nav, footer }: ScreenProps) {
  return (
    <div className="mx-auto flex h-dvh w-full max-w-md flex-col">
      {nav && <nav className="flex items-center justify-between px-16 pt-48 pb-16">{nav}</nav>}
      <main
        // 내용이 길어지면 줄어들지 않고 스크롤되도록 자식은 shrink-0으로 둔다.
        className={`flex flex-1 flex-col gap-16 overflow-y-auto px-16 *:shrink-0 ${nav ? "" : "pt-64"}`}
      >
        {children}
      </main>
      <div className="px-16 pt-16 pb-34">{footer}</div>
    </div>
  );
}
