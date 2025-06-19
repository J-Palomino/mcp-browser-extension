# Browser MCP Chrome Extension

This directory contains the Chrome extension implementation of the Browser MCP project, which allows AI assistants to automate your browser through the Model Context Protocol (MCP).

## Features

- 🔌 **Easy Connection**: Simple popup interface to connect/disconnect the MCP server
- 🌐 **Browser Automation**: Full browser control through MCP tools
- 🔒 **Local Processing**: All automation happens locally for privacy
- 📸 **Screenshots**: Capture full pages or specific elements
- 🖱️ **Interactions**: Click, type, and navigate web pages
- 📄 **Content Analysis**: Extract and analyze page content
- 🔍 **Element Discovery**: Find interactive elements automatically

## Installation

### Development Mode (Load Unpacked)

1. **Build the Extension**:
   ```bash
   npm install
   npm run build:extension
   ```

2. **Load in Chrome**:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `dist/extension` folder

3. **Connect the Extension**:
   - Click the Browser MCP extension icon in the toolbar
   - Click "Connect" to start the MCP server
   - The extension will show "Connected" status when ready

### Production Build

To create a production build for the Chrome Web Store:

```bash
npm run package:extension
```

This creates a `browser-mcp-extension.zip` file in the `dist` directory ready for upload.

## Usage

### With Claude Desktop

Add this configuration to your Claude Desktop MCP settings:

```json
{
  "mcpServers": {
    "browser-mcp": {
      "type": "streamable-http",
      "url": "http://127.0.0.1:12306/mcp"
    }
  }
}
```

### With Other MCP Clients

The extension exposes an MCP server on `ws://localhost:12306` that any MCP-compatible client can connect to.

## Available Tools

The extension provides these MCP tools:

- **Navigation**: `navigate`, `go_back`, `go_forward`
- **Screenshots**: `screenshot` (full page or element-specific)
- **Interactions**: `click`, `type`, `hover`, `select_option`
- **Content**: `get_content`, `get_interactive_elements`
- **Browser Management**: `get_tabs`, `close_tabs`

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   MCP Client    │◄──►│  WebSocket       │◄──►│ Chrome Extension│
│  (Claude, etc.) │    │  Server          │    │                 │
└─────────────────┘    │  (Port 12306)    │    │ ┌─────────────┐ │
                       └──────────────────┘    │ │ Background  │ │
                                               │ │ Script      │ │
                                               │ └─────────────┘ │
                                               │ ┌─────────────┐ │
                                               │ │ Content     │ │
                                               │ │ Scripts     │ │
                                               │ └─────────────┘ │
                                               └─────────────────┘
```

## Development

### Project Structure

```
extension/
├── manifest.json          # Extension manifest
├── background.js          # Service worker
├── content.js            # Content script for DOM interaction
├── popup.html            # Extension popup UI
├── popup.js              # Popup logic
└── icons/                # Extension icons
```

### Building

- `npm run build:extension` - Build extension files
- `npm run package:extension` - Create distribution zip
- `npm run watch` - Watch mode for development

### Testing

1. Load the extension in development mode
2. Open the popup and click "Connect"
3. Test with an MCP client like Claude Desktop
4. Check the browser console for debug information

## Troubleshooting

### Extension Won't Connect
- Check that no other process is using port 12306
- Verify the extension has necessary permissions
- Look for errors in the extension's background script console

### MCP Client Can't Connect
- Ensure the extension shows "Connected" status
- Verify the WebSocket server is running on port 12306
- Check firewall settings for localhost connections

### Tools Not Working
- Refresh the page and try again
- Check that the content script is properly injected
- Verify the target elements exist on the page

## Security

The extension requires broad permissions to function:
- `activeTab`: Access current tab content
- `tabs`: Manage browser tabs
- `scripting`: Inject content scripts
- `webRequest`: Monitor network requests
- `storage`: Save extension settings

All processing happens locally - no data is sent to external servers.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.