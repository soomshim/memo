import type { MemoBlock, MemoInline } from "./memos";

// 편집기(contentEditable)의 HTML과 메모 본문(MemoBlock[]) 사이를 바꾼다.
// 저장할 때는 HTML을 그대로 두지 않고 블록으로 바꿔서, 상세 화면이 같은 모양으로 그린다.

function escapeHtml(text: string) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function inlineToHtml(content: MemoInline[]) {
  return content
    .map((part) => (typeof part === "string" ? escapeHtml(part) : `<b>${escapeHtml(part.bold)}</b>`))
    .join("");
}

export function blocksToHtml(blocks: MemoBlock[]) {
  return blocks
    .map((block) => {
      switch (block.type) {
        case "heading":
          return `<h2>${escapeHtml(block.text)}</h2>`;
        case "subheading":
          return `<h3>${escapeHtml(block.text)}</h3>`;
        case "paragraph":
          return `<p>${inlineToHtml(block.content)}</p>`;
        case "list":
          return `<ul>${block.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
      }
    })
    .join("");
}

function isBold(element: Element) {
  return element.tagName === "B" || element.tagName === "STRONG";
}

function readInline(node: Node, out: MemoInline[]) {
  node.childNodes.forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      out.push(child.textContent ?? "");
    } else if (child instanceof Element) {
      if (isBold(child)) out.push({ bold: child.textContent ?? "" });
      else readInline(child, out);
    }
  });
}

// 붙어 있는 일반 글자는 합치고 빈 조각은 버린다.
function tidyInline(parts: MemoInline[]) {
  const result: MemoInline[] = [];
  for (const part of parts) {
    const text = typeof part === "string" ? part : part.bold;
    if (!text) continue;
    const last = result[result.length - 1];
    if (typeof part === "string" && typeof last === "string") result[result.length - 1] = last + part;
    else result.push(part);
  }
  return result;
}

const blockTags = new Set(["P", "DIV", "H1", "H2", "H3", "UL", "OL"]);

function hasBlockChild(element: Element) {
  return Array.from(element.children).some((child) => blockTags.has(child.tagName));
}

export function htmlToBlocks(root: HTMLElement): MemoBlock[] {
  const blocks: MemoBlock[] = [];
  let loose: MemoInline[] = [];

  // 문단으로 감싸지지 않은 글자는 모아 두었다가 하나의 문단으로 만든다.
  const flushLoose = () => {
    const content = tidyInline(loose);
    if (content.length > 0) blocks.push({ type: "paragraph", content });
    loose = [];
  };

  const walk = (parent: Node) => parent.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      loose.push(node.textContent ?? "");
      return;
    }
    if (!(node instanceof Element)) return;
    if (isBold(node)) {
      loose.push({ bold: node.textContent ?? "" });
      return;
    }
    if (node.tagName === "BR") {
      flushLoose();
      return;
    }

    flushLoose();
    const text = (node.textContent ?? "").trim();
    switch (node.tagName) {
      case "H1":
      case "H2":
        if (text) blocks.push({ type: "heading", text });
        break;
      case "H3":
        if (text) blocks.push({ type: "subheading", text });
        break;
      case "UL":
      case "OL": {
        const items = Array.from(node.querySelectorAll("li"))
          .map((item) => (item.textContent ?? "").trim())
          .filter(Boolean);
        if (items.length > 0) blocks.push({ type: "list", items });
        break;
      }
      default: {
        // 브라우저가 문단 안에 목록을 넣기도 하므로(<p><ul>…</ul></p>) 그럴 땐 안쪽을 다시 읽는다.
        if (hasBlockChild(node)) {
          walk(node);
          flushLoose();
          break;
        }
        const parts: MemoInline[] = [];
        readInline(node, parts);
        const content = tidyInline(parts);
        if (content.length > 0) blocks.push({ type: "paragraph", content });
      }
    }
  });
  walk(root);
  flushLoose();
  return blocks;
}
