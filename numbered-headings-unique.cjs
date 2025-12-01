"use strict";

/** @type import("markdownlint").Rule */
module.exports = {
  "names": ["numbered-headings-unique"],
  "description": "Headings ending in a number must be unique in the document",
  "tags": ["headings", "headers", "numbers", "unique"],
  function(params, onError) {

    // Track seen heading numbers: text -> [lineNumbers]
    const seenNumbers = new Map();
    params.tokens.forEach((token, idx) => {
      if (token.type === "heading_open") {
        const inline = params.tokens[idx + 1];
        if (inline && inline.type === "inline") {
          const text = inline.content.trim();
          if (/\d+$/u.test(text)) {
            let lines = seenNumbers.get(text);
            if (lines === undefined) {
              lines = [token.lineNumber];
              seenNumbers.set(text, lines);
            } else {
              lines.push(token.lineNumber);
            }
          }
        }
      }
    });

    // Report all duplicates (all but the first occurrence)
    for (const [text, lines] of seenNumbers.entries()) {
      if (lines.length > 1) {
        lines.slice(1).forEach((lineNumber) => {
          onError({
            lineNumber,
            detail: `Heading number "${text}" is not unique in the document.`,
          });
        });
      }
    }
  }
};
