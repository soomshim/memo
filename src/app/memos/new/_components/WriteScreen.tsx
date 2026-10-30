"use client";

import { IconButton } from "@/components/IconButton";
import { Screen } from "@/components/Screen";
import { useIsClient } from "@/lib/memoStore";
import { WriteForm } from "./WriteForm";

export function WriteScreen() {
  const isClient = useIsClient();
  if (!isClient) {
    return (
      <Screen nav={<IconButton icon="chevron-left" label="뒤로가기" href="/" />} footer={null} />
    );
  }
  return <WriteForm />;
}
