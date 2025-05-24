# Psi Header Guardian

**Psi Header Guardian** is a private Visual Studio Code extension that enhances the [`psi-header`](https://marketplace.visualstudio.com/items?itemName=SidneySchenkel.psi-header) extension by enforcing license headers recursively across a project.  
It ensures every relevant file includes the proper license header, making it ideal for projects where compliance and consistency matter.

> ⚠️ This extension is **not available on the VS Code Marketplace**. It must be installed manually via a `.vsix` package from GitHub Releases.

---

## ✨ Features

- 🔍 Recursively scans all files within a configured source folder.
- 🎯 Targets file extensions supported by `psi-header`.
- 🚫 Respects custom ignore list via `.psi-header-guardian-ignore`.
- 📜 Loads the license content from `psi-header` config.
- 🧠 Verifies the presence and correctness of license headers in each file.
- ✍️ Automatically inserts missing headers where needed.

---

## ⚙️ Configuration

### `psi-header` Required Configuration

For `Psi Header Guardian` to function properly, ensure the following settings are present in your `.vscode/settings.json` (or your workspace config):

```json
"psi-header.changes-tracking": {
  "include": ["typescript", "html", "scss", "less", "svg", "shellscript"],
  "exclude": ["markdown", "json", "jsonc", "text"],
  "excludeGlob": ["./**/*/ignoreme.*", "../license.txt"]
},
"psi-header.license-reference": {
  "uri": "../LICENSE",
  "uriIsLocalFile": true
}
```
These settings define which file types to track and the path to the license template.

Psi Header Guardian Configuration
Add these settings to your VS Code settings to configure how Psi Header Guardian operates:

```json
"psi-header-checker.sourceFolder": "src",
"psi-header-checker.blacklistExtensions": [".yaml", ".json"]
```
`psi-header-checker.sourceFolder`: The root directory to recursively scan (relative to the workspace).

`psi-header-checker.blacklistExtensions`: Optional list of file extensions to exclude from the check.

## 💻 Manual Installation (via GitHub)
Since this extension is not published on the Marketplace, you can install it manually as follows:

1. Download the `.vsix` file
[Go to the GitHub Releases page](https://github.com/orav-jozsef/psi-header-checker/releases)
and download the latest `.vsix` file (e.g. ``psi-header-guardian-x.x.x.vsix``).

2. Install it into VS Code
- Open VS Code
- Go to the Command Palette (Ctrl+Shift+P)
- Run the command:
  `Extensions: Install from VSIX...`
- Select the downloaded `.vsix` file

You're done! The extension is now installed and ready to use.

## 🧪 Development Setup
This extension is built using:
- TypeScript
- VS Code Extension API
- [esbuild](https://esbuild.github.io/) for bundling

To run it in development mode:
- Clone the repo
- Run `npm install`
- Press `F5` in VS Code to launch a new Extension Development Host

Run scripts:
```bash
npm run lint         # Check for lint errors
npm run test         # Run tests
npm run build        # Build the extension and package it
npm run release:ci   # Bump version, update changelog and create git tag
```

## 📦 Release and CI/CD
Each release is handled via GitHub Actions:
- Version is bumped automatically using [standard-version](https://github.com/conventional-changelog/standard-version)
- A changelog is generated
- The `.vsix` package is built and uploaded to the corresponding GitHub Release
- Releases include a full changelog and direct `.vsix` download link

## 📄 License
This project is licensed under the MIT License.