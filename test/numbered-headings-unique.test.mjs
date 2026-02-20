// @ts-check

/* eslint-disable max-statements */

import assert from "node:assert";
import test from "node:test";
import { readFile, writeFile, copyFile, unlink } from "node:fs/promises";
import numberedHeadingsUnique from "../index.cjs";
import { main as cli2 } from "markdownlint-cli2";

const numberedViolations = [
  'numbered-headings-unique-violations.md:5 error numbered-headings-unique Headings ending in a number must be unique in the document [Heading number "001" is not unique in the document.]',
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

test("fix replaces duplicate numbers with incremented values", async () => {
  const testFile = "test/numbered-headings-unique-violations-temp.md";
  
  // Create a temporary test file
  await copyFile("test/numbered-headings-unique-violations.md", testFile);
  
  try {
    // Apply fixes
    const params = {
      ...paramsBase,
      "argv": ["numbered-headings-unique-violations-temp.md"],
      "optionsOverride": {
        ...paramsBase.optionsOverride,
        "fix": true
      }
    };
    await cli2(params);
    
    // Read the fixed content
    const fixed = await readFile(testFile, "utf8");
    const lines = fixed.split(/\r?\n/u);
    
    // Verify the fixes
    assert.equal(lines[4], "## 002", "First duplicate '001' should become '002'");
    assert.equal(lines[10], "## Test 1000", "First duplicate 'Test 999' should become 'Test 1000'");
    assert.equal(lines[30], "### Test 1001", "First duplicate 'Test 42' should become 'Test 1001' (global max for 'Test ' prefix)");
    
    // Verify non-duplicates are unchanged
    assert.equal(lines[2], "## 001", "First occurrence of '001' should remain unchanged");
    assert.equal(lines[8], "## Test 999", "First occurrence of 'Test 999' should remain unchanged");
    assert.equal(lines[22], "### Test 42", "First occurrence of 'Test 42' should remain unchanged");
  } finally {
    // Cleanup
    await unlink(testFile);
  }
});

test("fix handles multiple duplicates by incrementing sequentially", async () => {
  const testFile = "test/multiple-duplicates-temp.md";
  const content = `# Test

## Item 5

## Item 5

## Item 5

## Item 5
`;
  
  try {
    // Create test file
    await writeFile(testFile, content, "utf8");
    
    // Apply fixes
    const params = {
      "argv": [testFile],
      "directory": ".",
      "optionsOverride": {
        customRules,
        "fix": true
      }
    };
    await cli2(params);
    
    // Read the fixed content
    const fixed = await readFile(testFile, "utf8");
    const lines = fixed.split(/\r?\n/u);
    
    // First occurrence unchanged, rest incremented
    assert.equal(lines[2], "## Item 5");
    assert.equal(lines[4], "## Item 6");
    assert.equal(lines[6], "## Item 7");
    assert.equal(lines[8], "## Item 8");
  } finally {
    // Cleanup
    await unlink(testFile);
  }
});

// No config or fix tests for this rule (not applicable)

test("no issues in project files", async () => {
  const params = {
    "argv": [ "*.md" ],
  };
  const result = await cli2(params);
  assert.equal(result, 0);
});
