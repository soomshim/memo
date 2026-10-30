// 아이콘 파일은 Figma에서 받은 그대로 두고, 모양만 mask로 써서 색은 글자색(currentColor)을 따른다.
const icons = {
  plus: { src: "/icons/plus.svg", size: 20 },
  note: { src: "/icons/note.svg", size: 22 },
  pin: { src: "/icons/pin.svg", size: 16 },
  "chevron-right": { src: "/icons/chevron-right.svg", size: 16 },
  "chevron-left": { src: "/icons/chevron-left.svg", size: 24 },
  "pin-24": { src: "/icons/pin-24.svg", size: 24 },
  share: { src: "/icons/share.svg", size: 24 },
  more: { src: "/icons/more.svg", size: 24 },
} as const;

export type IconName = keyof typeof icons;

export function Icon({ name }: { name: IconName }) {
  const { src, size } = icons[name];
  return (
    <span
      aria-hidden
      className="block shrink-0 bg-current"
      style={{
        width: size,
        height: size,
        maskImage: `url(${src})`,
        maskSize: "100% 100%",
        maskRepeat: "no-repeat",
      }}
    />
  );
}
