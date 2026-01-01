// @ts-check

import assert from "node:assert";
import test from "node:test";
import numberedHeadingsUnique from "../index.cjs";
import { main as cli2 } from "markdownlint-cli2";

const numberedViolations = [
  'numbered-headings-unique-violations.md:5 error numbered-headings-unique Headings ending in a number must be unique in the document [Heading number "1" is not unique in the document.]',
  'numbered-headings-unique-violations.md:11 error numbered-headings-unique Headings ending in a number must be unique in the document [Heading number "Test 999" is not unique in the document.]',
  'numbered-headings-unique-violations.md:31 error numbered-headings-unique Headings ending in a number must be unique in the document [Heading number "Test 42" is not unique in the document.]',
];
const customRules = numberedHeadingsUnique;
const paramsBase = {
  "argv": [ "numbered-headings-unique-violations.md" ],
  "directory": "test",
  "optionsOverride": {
    customRules,
    config: { "MD024": false }
  }
};

test("numbered headings unique violations", async () => {
  const messages = [];
  const params = {
    ...paramsBase,
    "logError": (message) => messages.push(message)
  };
  const result = await cli2(params);
  assert.equal(result, 1);
  assert.deepEqual(messages, numberedViolations);
});

// No config or fix tests for this rule (not applicable)

test("no issues in project files", async () => {
  const params = {
    "argv": [ "*.md" ],
  };
  const result = await cli2(params);
  assert.equal(result, 0);
});
