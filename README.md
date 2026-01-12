# markdownlint-rule-numbered-headings-unique

A custom [markdownlint][markdownlint] rule that checks that headings ending in
a number are unique within the document.

## Overview

This rule is for the [Node.js markdownlint library][markdownlint] and its
associated tools. It enforces that any heading ending in a number (e.g., `## 1`,
`## Test 42`) must be unique across the entire Markdown document.

### Why?

The built-in markdownlint rule [MD024] can require all headings to be globally
unique (which is often too strict) or only check siblings (which can be too
permissive). This rule provides a middle ground: only headings ending in a
number must be unique, which is useful for structured documents like release
notes or test case lists.

**Examples of where this is useful:**

- Release notes
- Test case documents

**Example structure:**

```markdown
## Obsolete versions

### 1.8

#### New features

#### Bugs fixed

### 1.9

#### New features

#### Bugs fixed

## Current versions

### 2.0

#### New features

#### Bugs fixed

### 2.1

#### New features

#### Bugs fixed
```

## Installation

```sh
npm install --save-dev markdownlint-rule-numbered-headings-unique
```

## Usage


### With markdownlint-cli


If installed locally, markdownlint will auto-discover the rule by package name. You can use:

```sh
markdownlint --rules markdownlint-rule-numbered-headings-unique *.md
```


If you want to use a direct path, you can still use:

```sh
markdownlint --rules ./index.cjs *.md
```

### With markdownlint-cli2


If installed locally, markdownlint-cli2 will auto-discover the rule by package name. You can add it to your config file using the package name:

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

If using the [`markdownlint` extension for VS Code][vscode-markdownlint], install this package in your workspace and the rule will be auto-discovered. For advanced usage, see the markdownlint-cli2 examples above or refer to the extension documentation.

## Testing

To run the tests:

```sh
npm test
```

## Contributing

Pull requests and issues are welcome! Please ensure your code passes linting
and tests before submitting.

## License

MIT

[markdownlint]: <https://github.com/DavidAnson/markdownlint>
[vscode-markdownlint]: <https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint>
[MD024]: <https://github.com/DavidAnson/markdownlint/blob/main/doc/md024.md>
