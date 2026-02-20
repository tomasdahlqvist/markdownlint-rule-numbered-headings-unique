"use strict";

const preNum = /^(?<prefix>.*\D)?(?<num>\d+)$/u;

const addLine = (map, text, lineNumber) => {
  let lines = map.get(text);
  if (lines === undefined) {
    lines = [lineNumber];
    map.set(text, lines);
  } else {
    lines.push(lineNumber);
  }
};

const problemMap = (tokens) => {
  const seen = new Map();
  const last = new Map();

  tokens.forEach((token, idx) => {
    if (token.type === "heading_open") {
      const inline = tokens[idx + 1];
      if (inline && inline.type === "inline") {
        const text = inline.content.trim();
        const match = preNum.exec(text);
        if (match) {
          const prefix = match.groups.prefix || "";
          const number = parseInt(match.groups.num, 10);
          last.set(prefix, Math.max(last.get(prefix) || 0, number));
          addLine(seen, text, token.lineNumber);
        }
      }
    }
  });
  return {seen, last};
}

/** @type import("markdownlint").Rule */
const rule = {
  names: ["numbered-headings-unique"],
  description: "Headings ending in a number must be unique in the document",
  tags: ["headings", "headers", "numbers", "unique"],
  function(params, onError) {
    // Track seen heading numbers: text -> [lineNumbers]
    const {seen, last} = problemMap(params.tokens);
    
    // Report all duplicates (all but the first occurrence)
    for (const [text, lines] of seen.entries()) {
      if (lines.length > 1) {
        const match = preNum.exec(text);
        const prefix = match.groups.prefix || "";
        const oldNum = match.groups.num;
        lines.slice(1).forEach((lineNumber) => {
          const num = last.get(prefix) + 1;
          last.set(prefix, num);
          const fullLine = params.lines[lineNumber - 1];
          const textStartColumn = fullLine.indexOf(text) + 1;
          const numberStartColumn = textStartColumn + (prefix ? prefix.length : 0);
          onError({
            lineNumber,
            detail: `Heading number "${text}" is not unique in the document.`,
            fixInfo: {
              editColumn: numberStartColumn,
              deleteCount: oldNum.length,
              insertText: num.toString().padStart(oldNum.length, "0"),
            },
          });
        });
      }
    }
  }
};

module.exports = [rule];
