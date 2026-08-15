const headingMatch = /^(#{1,3})\s+(.+)$/;

const bulletMatch = /^[-*•]\s+(.+)$/;

const numberedMatch = /^\d+[.)]\s+(.+)$/;

export const parseInlineFormatting = (text) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return {
        type: "bold",
        text: part.slice(2, -2),
        key: `bold-${index}`,
      };
    }

    return {
      type: "text",
      text: part,
      key: `text-${index}`,
    };
  });
};

export const parseChatBlocks = (content) => {
  if (!content?.trim()) {
    return [];
  }

  const lines = content.trim().split("\n");
  const blocks = [];
  let currentList = null;

  const flushList = () => {
    if (currentList) {
      blocks.push(currentList);
      currentList = null;
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      continue;
    }

    const heading = trimmed.match(headingMatch);

    if (heading) {
      flushList();
      blocks.push({
        type: "heading",
        level: heading[1].length,
        text: heading[2],
      });
      continue;
    }

    const bullet = trimmed.match(bulletMatch);

    if (bullet) {
      if (!currentList || currentList.type !== "bullet") {
        flushList();
        currentList = { type: "bullet", items: [] };
      }

      currentList.items.push(bullet[1]);
      continue;
    }

    const numbered = trimmed.match(numberedMatch);

    if (numbered) {
      if (!currentList || currentList.type !== "numbered") {
        flushList();
        currentList = { type: "numbered", items: [] };
      }

      currentList.items.push(numbered[1]);
      continue;
    }

    flushList();
    blocks.push({
      type: "paragraph",
      text: trimmed,
    });
  }

  flushList();
  return blocks;
};
