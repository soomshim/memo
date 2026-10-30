export type MemoLabel = "blue" | "green" | "orange" | "pink";

export type MemoCategory = "업무" | "개인" | "아이디어";

// 본문 한 줄 안에서 굵게 보여 줄 부분은 { bold } 로 나눈다.
export type MemoInline = string | { bold: string };

export type MemoBlock =
  | { type: "heading"; text: string }
  | { type: "subheading"; text: string }
  | { type: "paragraph"; content: MemoInline[] }
  | { type: "list"; items: string[] };

export type Memo = {
  id: string;
  title: string;
  preview: string;
  date: string;
  createdAt: string;
  editedAt?: string;
  label: MemoLabel;
  category: MemoCategory;
  pinned: boolean;
  body: MemoBlock[];
};

export const categories: MemoCategory[] = ["업무", "개인", "아이디어"];
