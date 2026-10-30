import { useSyncExternalStore } from "react";
import type { Memo, MemoBlock, MemoCategory, MemoLabel } from "./memos";
import { supabase } from "./supabase";

// 메모는 Supabase의 memos 표에 저장하고, 작성 중인 임시 글만 이 브라우저(localStorage)에 둔다.
const DRAFT_KEY = "memo-app:draft";

// memos 표의 한 줄
type MemoRow = {
  id: string;
  title: string;
  body: MemoBlock[];
  category: MemoCategory;
  label: MemoLabel;
  pinned: boolean;
  created_at: string; // ISO 시각
  edited_at: string | null;
};

export type Draft = {
  title: string;
  category: MemoCategory;
  label: MemoLabel;
  body: MemoBlock[];
};

function readItem(key: string) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeItem(key: string, value: string | null) {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  } catch {
    // 저장소를 쓸 수 없는 환경(사생활 보호 모드 등)에서는 조용히 넘어간다.
  }
}

const timeFormatter = new Intl.DateTimeFormat("ko-KR", {
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});
const dayFormatter = new Intl.DateTimeFormat("ko-KR", { month: "long", day: "numeric" });
const hourFormatter = new Intl.DateTimeFormat("ko-KR", { hour: "numeric", minute: "2-digit" });

function relativeDay(date: Date) {
  const startOf = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const days = Math.round((startOf(new Date()) - startOf(date)) / 86_400_000);
  if (days === 0) return "오늘";
  if (days === 1) return "어제";
  return dayFormatter.format(date);
}

function blockText(block: MemoBlock) {
  switch (block.type) {
    case "heading":
    case "subheading":
      return block.text;
    case "paragraph":
      return block.content.map((part) => (typeof part === "string" ? part : part.bold)).join("");
    case "list":
      return block.items.join(", ");
  }
}

// 목록에 보일 미리보기: 본문 문단·목록을 먼저, 없으면 제목류 글을 쓴다.
function previewOf(body: MemoBlock[]) {
  const main = body.find((block) => block.type === "paragraph" || block.type === "list");
  return main ? blockText(main) : (body[0] ? blockText(body[0]) : "");
}

function toMemo(row: MemoRow): Memo {
  const created = new Date(row.created_at);
  const edited = row.edited_at ? new Date(row.edited_at) : null;
  return {
    id: row.id,
    title: row.title,
    preview: previewOf(row.body),
    date: relativeDay(created),
    createdAt: timeFormatter.format(created),
    editedAt: edited
      ? `${relativeDay(edited)} ${hourFormatter.format(edited)} 수정`
      : undefined,
    label: row.label,
    category: row.category,
    pinned: row.pinned,
    body: row.body,
  };
}

// 불러오는 중이면 memos가 null이다.
export type MemoState = { memos: Memo[] | null; error: boolean };

const loadingState: MemoState = { memos: null, error: false };
let state: MemoState = loadingState;
const listeners = new Set<() => void>();

function setState(next: MemoState) {
  state = next;
  listeners.forEach((listener) => listener());
}

// 최신 메모가 앞에 온다. 고정한 메모는 화면에서 따로 모은다.
async function fetchMemos() {
  const { data, error } = await supabase
    .from("memos")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    setState({ memos: state.memos, error: true });
    return;
  }
  setState({ memos: (data as MemoRow[]).map(toMemo), error: false });
}

// 화면이 메모를 보기 시작할 때마다 새로 불러와, 다른 기기에서 쓴 메모도 보이게 한다.
function subscribe(listener: () => void) {
  if (listeners.size === 0) void fetchMemos();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return state;
}

function getServerSnapshot() {
  return loadingState;
}

export function useMemos() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// 저장에 성공하면 새 메모의 id를, 실패하면 오류를 던진다.
export async function saveMemo(draft: Draft) {
  const { data, error } = await supabase
    .from("memos")
    .insert({
      title: draft.title,
      category: draft.category,
      label: draft.label,
      body: draft.body,
    })
    .select()
    .single();
  if (error) throw error;
  const memo = toMemo(data as MemoRow);
  setState({ memos: [memo, ...(state.memos ?? [])], error: false });
  return memo.id;
}

export function readDraft(): Draft | null {
  const raw = readItem(DRAFT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Draft;
  } catch {
    return null;
  }
}

export function writeDraft(draft: Draft | null) {
  writeItem(DRAFT_KEY, draft ? JSON.stringify(draft) : null);
}

const noop = () => () => {};

// 서버에서 그릴 때는 false, 브라우저에서는 true. 저장소를 읽는 부분을 가를 때 쓴다.
export function useIsClient() {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}
