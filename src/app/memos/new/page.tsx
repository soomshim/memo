import type { Metadata } from "next";
import { WriteScreen } from "./_components/WriteScreen";

export const metadata: Metadata = {
  title: "새 메모",
};

export default function NewMemo() {
  return <WriteScreen />;
}
