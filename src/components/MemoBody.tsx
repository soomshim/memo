import type { MemoBlock, MemoInline } from "@/lib/memos";

function Inline({ content }: { content: MemoInline[] }) {
  return content.map((part, index) =>
    typeof part === "string" ? (
      part
    ) : (
      <strong key={index} className="font-bold text-text-primary">
        {part.bold}
      </strong>
    ),
  );
}

export function MemoBody({ blocks }: { blocks: MemoBlock[] }) {
  return (
    <div className="flex flex-col gap-12">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "heading":
            return (
              <h2 key={index} className="text-title-lg text-text-primary">
                {block.text}
              </h2>
            );
          case "subheading":
            return (
              <h3 key={index} className="text-title-md text-text-primary">
                {block.text}
              </h3>
            );
          case "paragraph":
            return (
              <p key={index} className="text-body-md text-text-secondary">
                <Inline content={block.content} />
              </p>
            );
          case "list":
            return (
              <ul key={index} className="flex flex-col gap-4 text-body-md text-text-secondary">
                {block.items.map((item) => (
                  <li key={item} className="flex gap-8">
                    <span aria-hidden className="shrink-0">
                      •
                    </span>
                    <span className="flex-1">{item}</span>
                  </li>
                ))}
              </ul>
            );
        }
      })}
    </div>
  );
}
