import {
  parseChatBlocks,
  parseInlineFormatting,
} from "../../utils/formatChatResponse.js";

const InlineText = ({ text }) => (
  <>
    {parseInlineFormatting(text).map((part) =>
      part.type === "bold" ? (
        <strong key={part.key} className="font-semibold text-white">
          {part.text}
        </strong>
      ) : (
        <span key={part.key}>{part.text}</span>
      ),
    )}
  </>
);

const StructuredResponse = ({ content }) => {
  const blocks = parseChatBlocks(content);

  if (blocks.length === 0) {
    return <p className="text-sm leading-relaxed text-muted">No response.</p>;
  }

  return (
    <div className="space-y-3">
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          const headingClass =
            block.level === 1
              ? "text-base font-semibold text-white"
              : block.level === 2
                ? "text-sm font-semibold text-white"
                : "text-sm font-medium text-white";

          return (
            <p key={index} className={headingClass}>
              <InlineText text={block.text} />
            </p>
          );
        }

        if (block.type === "paragraph") {
          return (
            <p
              key={index}
              className="text-sm leading-relaxed text-muted"
            >
              <InlineText text={block.text} />
            </p>
          );
        }

        const ListTag = block.type === "numbered" ? "ol" : "ul";
        const listClass =
          block.type === "numbered"
            ? "list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-muted"
            : "list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted";

        return (
          <ListTag key={index} className={listClass}>
            {block.items.map((item, itemIndex) => (
              <li key={itemIndex}>
                <InlineText text={item} />
              </li>
            ))}
          </ListTag>
        );
      })}
    </div>
  );
};

export default StructuredResponse;
