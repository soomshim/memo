"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ButtonPrimary } from "@/components/ButtonPrimary";
import { Chip } from "@/components/Chip";
import { IconButton } from "@/components/IconButton";
import { LabelDot } from "@/components/LabelDot";
import { MemoEditor } from "@/components/MemoEditor";
import { Screen } from "@/components/Screen";
import { readDraft, saveMemo, writeDraft, type Draft } from "@/lib/memoStore";
import { categories, type MemoLabel } from "@/lib/memos";

const labels: MemoLabel[] = ["blue", "green", "orange", "pink"];

const emptyDraft: Draft = { title: "", category: "개인", label: "blue", body: [] };

function hasContent(draft: Draft) {
  return draft.title.trim() !== "" || draft.body.length > 0;
}

// 브라우저에서만 그린다(작성 중이던 임시 글을 저장소에서 읽어 오기 때문).
export function WriteForm() {
  const router = useRouter();
  const titleRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState<Draft>(() => readDraft() ?? emptyDraft);
  const [status, setStatus] = useState<"idle" | "saving" | "failed">("idle");

  // 고칠 때마다 임시 글로 저장해 두어, 뒤로 갔다 와도 이어서 쓸 수 있다.
  const update = (patch: Partial<Draft>) => {
    const next = { ...draft, ...patch };
    setDraft(next);
    writeDraft(hasContent(next) ? next : null);
  };

  // Supabase에 저장이 끝나야 임시 글을 지우고 홈으로 간다. 실패하면 임시 글은 남겨 둔다.
  const save = async () => {
    if (status === "saving") return;
    if (draft.title.trim() === "") {
      titleRef.current?.focus();
      return;
    }
    setStatus("saving");
    try {
      await saveMemo({ ...draft, title: draft.title.trim() });
    } catch {
      setStatus("failed");
      return;
    }
    writeDraft(null);
    router.replace("/");
  };

  return (
    <Screen
      nav={
        <>
          <IconButton icon="chevron-left" label="뒤로가기" href="/" />
          {status === "failed" ? (
            <p role="alert" className="whitespace-nowrap text-caption-sm text-label-pink">
              저장하지 못했어요
            </p>
          ) : (
            hasContent(draft) && (
              <p className="whitespace-nowrap text-caption-sm text-text-muted">자동 저장됨</p>
            )
          )}
        </>
      }
      footer={<ButtonPrimary label={status === "saving" ? "저장 중" : "저장하기"} onClick={save} />}
    >
      <div className="flex flex-col gap-12">
        <label className="flex flex-col gap-4 rounded-lg bg-surface-card px-20 py-16 focus-within:ring-2 focus-within:ring-primary focus-within:ring-inset">
          <span className="text-caption-sm text-text-muted">제목</span>
          <input
            ref={titleRef}
            value={draft.title}
            onChange={(event) => update({ title: event.target.value })}
            placeholder="제목을 입력하세요"
            className="w-full bg-transparent text-title-md text-text-primary outline-none placeholder:text-text-muted"
          />
        </label>

        <div className="flex flex-col gap-12 px-8 py-4">
          <div className="flex items-center gap-8" role="group" aria-label="분류">
            <span className="shrink-0 text-caption-sm text-text-muted">분류</span>
            {categories.map((category) => (
              <Chip
                key={category}
                label={category}
                selected={draft.category === category}
                onClick={() => update({ category })}
              />
            ))}
          </div>
          <div className="flex items-center gap-8" role="group" aria-label="색">
            <span className="shrink-0 text-caption-sm text-text-muted">색</span>
            {labels.map((label) => (
              <LabelDot
                key={label}
                color={label}
                selected={draft.label === label}
                onClick={() => update({ label })}
              />
            ))}
          </div>
        </div>

        <MemoEditor initialBody={draft.body} onChange={(body) => update({ body })} />
      </div>
    </Screen>
  );
}
