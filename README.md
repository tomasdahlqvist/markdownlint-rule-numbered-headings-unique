# markdownlint-rule-numbered-headings-unique

A custom [markdownlint][markdownlint] rule that checks that headings ending in a number are unique within the document.

It is best used with [MD024] set to "siblings-only".
It will work with any setting, but with global uniqueness in MD024 both rules will trigger if a heading ends in a number.

## Overview

This rule is for the [Node.js markdownlint library][markdownlint] and its associated tools.
It enforces that any heading ending in a number (e.g., `## 1`, `## Test 42`) must be unique across the entire Markdown document.
Headings after the ones above need to be, for example, `## 2` and `### Test 101`.

### Auto-fix / Quick Fix

This rule supports auto-fixing duplicate numbered headings:

- In VS Code, you can use the **Quick Fix** feature (lightbulb or right-click) to automatically update duplicate numbered headings to the next available number.
- On the command line, you can use markdownlint's `--fix` option to apply the same fix automatically.

The auto-fix will change any duplicate number to a value higher than any existing in the document.
For example, if `## 2` is duplicated, the fix will update the duplicate to `## 3` (or the next available number).

The changelog in this document is an example where only one heading of each version is allowed.

### Why?

The built-in markdownlint rule [MD024] can require all headings to be globally unique (which is often too strict) or only check siblings (which can be too permissive).
This rule provides a middle ground: only headings ending in a number must be unique, which is useful for structured documents like release notes or test case lists.

**Examples of where this is useful:**

- Release notes. There should not be two headings with the same version number.
- Test case documents. Each test case should have a unique number.
  They are not necessarily increasing in the document and new numbers should not re-use old numbers.
  The auto-fix/Quick Fix will allocate numbers higher than the existing.

## Installation

```sh
npm install --save-dev markdownlint-rule-numbered-headings-unique
```

## Usage

### With markdownlint-cli

If installed locally, markdownlint will auto-discover the rule by package name.
You can use:

```sh
markdownlint --rules markdownlint-rule-numbered-headings-unique *.md
```

If you want to use a direct path, you can still use:

```sh
markdownlint --rules ./index.cjs *.md
```

### With markdownlint-cli2

If installed locally, markdownlint-cli2 will auto-discover the rule by package name.
You can add it to your config file using the package name:

```jsonc
{
    "customRules": [
        "markdownlint-rule-numbered-headings-unique"
    ]
}
```

Or to `.markdownlint-cli2.yaml`:

```yaml
customRules:
    - markdownlint-rule-numbered-headings-unique
```

To use a direct path, you can still reference index.cjs if needed:

```jsonc
{
    "customRules": [
        "./index.cjs"
    ]
}
```

### With VS Code

If using the [`markdownlint` extension for VS Code][vscode-markdownlint], install this package in your workspace and the rule will be auto-discovered.
For advanced usage, see the markdownlint-cli2 examples above or refer to the extension documentation.

## Testing

To run the tests:

```sh
npm test
```

## Contributing

Pull requests and issues are welcome!
Please ensure your code passes linting and tests before submitting.

## Changelog

### 1.2.0

#### New Features

The numbered headings keeps the number of digits in a heading by padding with leading zeros.

### 1.1.0

#### New Features

Quick fix added that changes any duplicates to one above the current max number in the document.
When fixing all errors the duplicates get increasing numbers.

### 1.0.9

#### New Features

First automatically published version.

## License

MIT

[markdownlint]: <https://github.com/DavidAnson/markdownlint>
[vscode-markdownlint]: <https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint>
[MD024]: <https://github.com/DavidAnson/markdownlint/blob/main/doc/md024.md>
