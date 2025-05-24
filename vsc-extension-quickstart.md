# Welcome to `psi-header-guardian` VS Code Extension

## What's in this folder?

This folder contains the source code of the `psi-header-guardian` VS Code extension.

### Core files

- `package.json`: Manifest file for the extension. Declares the name, description, commands, activation events, etc.
- `src/extension.ts`: The entry point where the core logic is implemented.
- `src/utils/`: (Suggested) Helper modules for file traversal, matching, header validation etc.
- `CHANGELOG.md`: Logs the evolution of the extension.
- `README.md`: Overview of the extension (you’re reading the summary now).
- `vsc-extension-quickstart.md`: Quick setup and debugging guide (this file).

## Setup & Development

1. Run `npm install` to install dependencies.
2. Press `F5` to launch an Extension Development Host.
3. Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`) and run your command (`Insert License Header`, or similar).
4. Set breakpoints inside `src/extension.ts` for debugging.
5. Extension output appears in the **Debug Console**.

## Goals of the Extension

- Extend `psi-header` by scanning files recursively.
- Check license header presence based on configured template.
- Insert license header if missing (while respecting blacklist and supported extensions).

## Testing

- Tests (optional): under `src/test/`.
- Run the test task or configure `jest`/`mocha` if needed.

## Notes

- This extension is intended for **private/internal use** and not published to the VS Code Marketplace.
