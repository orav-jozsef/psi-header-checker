# Psi Header Guardian

**Psi Header Guardian** is a private VS Code extension designed to complement the [`psi-header`](https://marketplace.visualstudio.com/items?itemName=SidneySchenkel.psi-header) extension by adding recursive license header enforcement.

## ✨ Features

- Recursively scans all files in a configured directory.
- Matches file extensions supported by `psi-header`.
- Skips files listed in a custom ignore list (`.psi-header-guardian-ignore`).
- Loads the license content defined in the `psi-header` config.
- Checks if each file contains the correct license header.
- Automatically inserts the header if missing.

## ⚙️ Configuration

The extension reads:

- The `psi-header` config (`.vscode/settings.json` or workspace config).
- A custom file blacklist (optional): `.psi-header-guardian-ignore`.

## 🧪 Development

- Built with TypeScript.
- Based on the VS Code Extension API.
- Use `F5` in VS Code to launch a dev session.

## 📦 Status

- **Private extension**, not intended for Marketplace.
- Under initial development.

## 📄 License

This project is licensed under MIT.  
(Note: License headers inserted are based on your custom `psi-header` settings.)
