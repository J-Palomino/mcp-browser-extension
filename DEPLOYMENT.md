# Chrome Extension Deployment Guide

This guide covers deploying the Browser MCP project as a Chrome extension.

## 🚀 Quick Deployment

### Prerequisites
- Node.js 18+ installed
- Chrome browser
- Basic familiarity with Chrome extensions

### Build and Install

1. **Clone and Build**:
   ```bash
   git clone <repository-url>
   cd mcp-browser-extension
   npm install
   node build-extension.js
   ```

2. **Load in Chrome**:
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select `dist/extension` folder

3. **Test Connection**:
   - Click the extension icon
   - Click "Connect"
   - Verify "Connected" status

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] All dependencies resolved
- [ ] Extension builds without errors
- [ ] Manifest.json is valid
- [ ] Icons are properly sized (16x16, 32x32, 48x48, 128x128)
- [ ] All required permissions are declared

### Testing
- [ ] Extension loads in developer mode
- [ ] Popup interface works correctly
- [ ] Background script starts MCP server
- [ ] Content scripts inject properly
- [ ] WebSocket connection establishes
- [ ] MCP tools respond correctly

### Production Ready
- [ ] Version number updated
- [ ] Description is accurate
- [ ] Screenshots prepared for store listing
- [ ] Privacy policy created (if required)
- [ ] Extension packaged as .zip file

## 🏪 Chrome Web Store Submission

### Prepare for Store

1. **Update Manifest**:
   ```json
   {
     "name": "Browser MCP - AI Browser Automation",
     "description": "Automate your browser with AI using Model Context Protocol",
     "version": "1.0.0"
   }
   ```

2. **Create Store Assets**:
   - Icon: 128x128 PNG
   - Screenshots: 1280x800 or 640x400
   - Promotional images (optional)

3. **Package Extension**:
   ```bash
   cd dist/extension
   zip -r browser-mcp-extension.zip .
   ```

### Store Listing Requirements

- **Name**: Browser MCP - AI Browser Automation
- **Category**: Productivity
- **Description**: Detailed description of features and benefits
- **Privacy Policy**: Required for extensions with broad permissions
- **Screenshots**: Show the extension in action

### Permissions Justification

The extension requires these permissions:
- `activeTab`: Access current tab for automation
- `tabs`: Manage browser tabs
- `scripting`: Inject content scripts for DOM interaction
- `webRequest`: Monitor network requests (for debugging tools)
- `storage`: Save extension settings
- `background`: Run background service worker

## 🔧 Configuration

### MCP Client Setup

#### Claude Desktop
Add to `~/.claude_desktop_config.json`:
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

#### Other MCP Clients
Connect to WebSocket endpoint: `ws://localhost:12306`

## 🐛 Troubleshooting

### Common Issues

**Extension Won't Load**
- Check manifest.json syntax
- Verify all files are present
- Check Chrome developer console for errors

**Can't Connect to MCP Server**
- Ensure port 12306 is available
- Check firewall settings
- Verify extension has necessary permissions

**Tools Not Working**
- Refresh the target page
- Check content script injection
- Verify WebSocket connection

### Debug Mode

1. Enable Chrome extension developer mode
2. Click "Inspect views: background page"
3. Check console for errors
4. Use Network tab to monitor WebSocket connections

## 📊 Monitoring and Analytics

### Extension Analytics
- Track installation/uninstallation rates
- Monitor error reports
- Collect usage statistics (with user consent)

### Performance Monitoring
- WebSocket connection stability
- Tool execution times
- Memory usage patterns

## 🔄 Updates and Maintenance

### Version Management
- Follow semantic versioning (MAJOR.MINOR.PATCH)
- Update manifest version for each release
- Maintain changelog

### Automatic Updates
Chrome automatically updates extensions from the Web Store.
For developer mode installations, users must manually update.

## 🛡️ Security Considerations

### Data Privacy
- All processing happens locally
- No data sent to external servers
- User browsing data stays on device

### Permission Scope
- Request minimal necessary permissions
- Explain permission usage to users
- Regular security audits

### Content Security Policy
The extension follows Chrome's CSP requirements:
- No inline scripts in HTML
- All scripts loaded from extension files
- No eval() or similar dynamic code execution

## 📈 Distribution Options

### Chrome Web Store (Recommended)
- Automatic updates
- User trust and discovery
- Review process ensures quality

### Direct Distribution
- Enterprise deployment
- Beta testing
- Custom installations

### Developer Mode
- Development and testing
- Local installations
- No automatic updates

## 🎯 Success Metrics

### User Engagement
- Daily active users
- Session duration
- Tool usage frequency

### Technical Performance
- Connection success rate
- Tool execution success rate
- Error frequency

### User Satisfaction
- Store ratings and reviews
- Support ticket volume
- Feature requests

---

## Next Steps

1. Complete testing checklist
2. Prepare store assets
3. Submit to Chrome Web Store
4. Monitor deployment metrics
5. Iterate based on user feedback