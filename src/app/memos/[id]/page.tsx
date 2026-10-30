import { Suspense } from "react";
import { IconButton } from "@/components/IconButton";
import { Screen } from "@/components/Screen";
import { MemoDetailView } from "./_components/MemoDetailView";

// params는 Suspense 안에서 읽어야 이동할 때 뼈대(뒤로가기)가 바로 보인다.
export default function Page({ params }: PageProps<"/memos/[id]">) {
  return (
    <Suspense
      fallback={
        <Screen nav={<IconButton icon="chevron-left" label="뒤로가기" href="/" />} footer={null} />
      }
    >
      <MemoDetail params={params} />
    </Suspense>
  );
}

async function MemoDetail({ params }: Pick<PageProps<"/memos/[id]">, "params">) {
  const { id } = await params;
  return <MemoDetailView id={id} />;
}
