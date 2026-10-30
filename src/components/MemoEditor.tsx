"use client";

import { useEffect, useRef, useState } from "react";
import { blocksToHtml, htmlToBlocks } from "@/lib/editorHtml";
import type { MemoBlock } from "@/lib/memos";
import { FormatButton } from "./FormatButton";

type Format = "bold" | "heading" | "subheading" | "list";

type MemoEditorProps = {
  initialBody: MemoBlock[];
  onChange: (body: MemoBlock[]) => void;
};

const noFormats: Record<Format, boolean> = {
  bold: false,
  heading: false,
  subheading: false,
  list: false,
};

// 본문 편집기. 굵게·제목·소제목·목록 서식을 쓰고, 바뀔 때마다 MemoBlock[]로 알려 준다.
export function MemoEditor({ initialBody, onChange }: MemoEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  // 비어 있어도 한 줄 높이를 갖도록 빈 문단을 하나 둔다.
  const [initialHtml] = useState(() => blocksToHtml(initialBody) || "<p><br></p>");
  const [empty, setEmpty] = useState(initialBody.length === 0);
  const [active, setActive] = useState(noFormats);

  // 커서가 있는 글자의 서식을 서식 막대에 보여 준다.
  useEffect(() => {
    document.execCommand("defaultParagraphSeparator", false, "p");
    const update = () => {
      const editor = editorRef.current;
      const selection = document.getSelection();
      if (!editor || !selection?.anchorNode || !editor.contains(selection.anchorNode)) {
        setActive(noFormats);
        return;
      }
      const block = document.queryCommandValue("formatBlock").toLowerCase();
      setActive({
        bold: document.queryCommandState("bold"),
        heading: block === "h2",
        subheading: block === "h3",
        list: document.queryCommandState("insertUnorderedList"),
      });
    };
    document.addEventListener("selectionchange", update);
    return () => document.removeEventListener("selectionchange", update);
  }, []);

  const emitChange = () => {
    const editor = editorRef.current;
    if (!editor) return;
    const body = htmlToBlocks(editor);
    setEmpty(body.length === 0);
    onChange(body);
  };

  // document.execCommand는 표준에서 빠질 예정이지만, 아직 모든 주요 브라우저가 지원하는
  // 가장 간단한 서식 적용 방법이라 여기서 쓴다.
  const apply = (format: Format) => {
    editorRef.current?.focus();
    switch (format) {
      case "bold":
        document.execCommand("bold");
        break;
      case "heading":
        document.execCommand("formatBlock", false, active.heading ? "p" : "h2");
        break;
      case "subheading":
        document.execCommand("formatBlock", false, active.subheading ? "p" : "h3");
        break;
      case "list":
        document.execCommand("insertUnorderedList");
        break;
    }
    emitChange();
  };

  return (
    <div className="flex w-full flex-col overflow-clip rounded-lg border-2 border-transparent bg-surface-card focus-within:border-primary">
      <div className="flex items-center gap-4 px-12 py-8" role="toolbar" aria-label="서식">
        <FormatButton label="B" active={active.bold} onPress={() => apply("bold")} />
        <FormatButton label="제목" active={active.heading} onPress={() => apply("heading")} />
        <FormatButton
          label="소제목"
          active={active.subheading}
          onPress={() => apply("subheading")}
        />
        <FormatButton label="목록" active={active.list} onPress={() => apply("list")} />
      </div>
      <hr className="h-px border-0 bg-border-default" />
      <div className="relative">
        {empty && (
          <p className="pointer-events-none absolute top-16 left-20 text-body-md text-text-muted">
            내용을 입력하세요
          </p>
        )}
        <div
          ref={editorRef}
          contentEditable
          role="textbox"
          aria-multiline
          aria-label="본문"
          onInput={emitChange}
          dangerouslySetInnerHTML={{ __html: initialHtml }}
          // 브라우저가 문단 안에 목록·제목을 넣으면(<p><ul>…</ul></p>) 그 문단을 contents로 풀어 줄 간격을 맞춘다.
          className="flex flex-col gap-8 px-20 py-16 [&_p:has(>:is(ul,ol,h2,h3,p,div))]:contents text-body-md text-text-secondary outline-none [&_b]:font-bold [&_b]:text-text-primary [&_h2]:text-title-lg [&_h2]:text-text-primary [&_h3]:text-title-md [&_h3]:text-text-primary [&_li]:relative [&_li]:pl-16 [&_li]:before:absolute [&_li]:before:-ml-16 [&_li]:before:content-['•'] [&_strong]:font-bold [&_strong]:text-text-primary [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-4"
        />
      </div>
    </div>
  );
}
