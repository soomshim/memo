import { connection } from "next/server";

const formatter = new Intl.DateTimeFormat("ko-KR", {
  month: "long",
  day: "numeric",
  weekday: "long",
  timeZone: "Asia/Seoul",
});

// 오늘 날짜는 요청할 때마다 달라지므로 미리 그려 두지 않고 요청 시점에 그린다.
export async function TodayLabel() {
  await connection();
  return <>{formatter.format(new Date())}</>;
}
