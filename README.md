<a href="https://browsermcp.io">
  <img src="./.github/images/banner.png" alt="Browser MCP banner">
</a>

<h3 align="center">Browser MCP</h3>

<p align="center">
  Automate your browser with AI.
  <br />
  <a href="https://browsermcp.io"><strong>Website</strong></a> 
  •
  <a href="https://docs.browsermcp.io"><strong>Docs</strong></a>
</p>

## About

Browser MCP is an MCP server + Chrome extension that allows you to automate your browser using AI applications like VS Code, Claude, Cursor, and Windsurf.

## Features

- ⚡ Fast: Automation happens locally on your machine, resulting in better performance without network latency.
- 🔒 Private: Since automation happens locally, your browser activity stays on your device and isn't sent to remote servers.
- 👤 Logged In: Uses your existing browser profile, keeping you logged into all your services.
- 🥷🏼 Stealth: Avoids basic bot detection and CAPTCHAs by using your real browser fingerprint.

## Chrome Extension Deployment

This repository has been enhanced to support deployment as a Chrome extension! 🎉

### Quick Start

1. **Build the Extension**:
   ```bash
   npm install
   node build-extension.js
   ```

2. **Install in Chrome**:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `dist/extension` folder

3. **Connect and Use**:
   - Click the Browser MCP extension icon in the toolbar
   - Click "Connect" to start the MCP server
   - Configure your MCP client (like Claude Desktop) to connect to `http://127.0.0.1:12306/mcp`

### Extension Features

- 🔌 **One-Click Connection**: Simple popup interface to start/stop the MCP server
- 🌐 **Full Browser Control**: Complete automation capabilities through MCP tools
- 📸 **Advanced Screenshots**: Capture full pages or specific elements
- 🖱️ **Smart Interactions**: Click, type, and navigate with AI precision
- 📄 **Content Analysis**: Extract and analyze page content intelligently
- 🔍 **Element Discovery**: Automatically find interactive elements
- 🔒 **Privacy-First**: All processing happens locally on your machine

### Architecture

The extension consists of:
- **Background Service Worker**: Manages the MCP server and WebSocket connections
- **Content Scripts**: Handle DOM interactions and page manipulation
- **Popup Interface**: User-friendly controls for connection management
- **Injected Scripts**: Enhanced page interaction capabilities

See [EXTENSION_README.md](./EXTENSION_README.md) for detailed documentation.

## Contributing

This repository now includes both the original MCP server code and a complete Chrome extension implementation. The missing workspace dependencies have been resolved with local implementations.

## Credits

Browser MCP was adapted from the [Playwright MCP server](https://github.com/microsoft/playwright-mcp) in order to automate the user's browser rather than creating new browser instances. This allows using the user's existing browser profile to use logged-in sessions and avoid bot detection mechanisms that commonly block automated browser use.
