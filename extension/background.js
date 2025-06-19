// Background service worker for Browser MCP Extension
let mcpServer = null;
let wsServer = null;
let isConnected = false;
let currentPort = 12306;

// Import the MCP server (this will be bundled)
// For now, we'll create a simplified version

class SimpleMCPServer {
  constructor() {
    this.tools = new Map();
    this.connected = false;
  }

  async start(port = 12306) {
    try {
      // In a real implementation, this would start the WebSocket server
      // For now, we'll simulate it
      this.connected = true;
      currentPort = port;
      console.log(`MCP Server started on port ${port}`);
      return true;
    } catch (error) {
      console.error('Failed to start MCP server:', error);
      return false;
    }
  }

  async stop() {
    this.connected = false;
    console.log('MCP Server stopped');
  }

  isRunning() {
    return this.connected;
  }
}

// Initialize MCP server
mcpServer = new SimpleMCPServer();

// Message handler for popup and content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'GET_STATUS':
      sendResponse({
        connected: isConnected,
        port: currentPort,
        serverRunning: mcpServer?.isRunning() || false
      });
      break;

    case 'CONNECT':
      handleConnect().then(result => sendResponse(result));
      return true; // Keep message channel open for async response

    case 'DISCONNECT':
      handleDisconnect().then(result => sendResponse(result));
      return true;

    case 'EXECUTE_TOOL':
      handleToolExecution(message.payload).then(result => sendResponse(result));
      return true;

    default:
      sendResponse({ error: 'Unknown message type' });
  }
});

async function handleConnect() {
  try {
    if (!mcpServer) {
      mcpServer = new SimpleMCPServer();
    }
    
    const started = await mcpServer.start(currentPort);
    if (started) {
      isConnected = true;
      
      // Get current active tab and inject content script if needed
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab) {
        try {
          await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content.js']
          });
        } catch (error) {
          console.log('Content script already injected or failed to inject:', error);
        }
      }
      
      return { success: true };
    } else {
      return { success: false, error: 'Failed to start server' };
    }
  } catch (error) {
    console.error('Connection error:', error);
    return { success: false, error: error.message };
  }
}

async function handleDisconnect() {
  try {
    if (mcpServer) {
      await mcpServer.stop();
    }
    isConnected = false;
    return { success: true };
  } catch (error) {
    console.error('Disconnection error:', error);
    return { success: false, error: error.message };
  }
}

async function handleToolExecution(payload) {
  try {
    // This would handle MCP tool execution
    // For now, return a placeholder response
    return {
      success: true,
      result: `Tool ${payload.tool} executed with params: ${JSON.stringify(payload.params)}`
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Handle extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Browser MCP Extension installed');
});

// Handle tab updates to maintain connection
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (isConnected && changeInfo.status === 'complete') {
    // Re-inject content script if needed
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['content.js']
    }).catch(() => {
      // Ignore errors (script might already be injected)
    });
  }
});