document.addEventListener('DOMContentLoaded', async () => {
  const statusEl = document.getElementById('status');
  const connectBtn = document.getElementById('connectBtn');
  const disconnectBtn = document.getElementById('disconnectBtn');
  const portEl = document.getElementById('port');
  const serverStatusEl = document.getElementById('serverStatus');

  // Get current status
  const updateStatus = async () => {
    try {
      const response = await chrome.runtime.sendMessage({ type: 'GET_STATUS' });
      const isConnected = response.connected;
      const port = response.port || 12306;
      const serverRunning = response.serverRunning;

      statusEl.textContent = isConnected ? 'Connected' : 'Disconnected';
      statusEl.className = `status ${isConnected ? 'connected' : 'disconnected'}`;
      
      connectBtn.style.display = isConnected ? 'none' : 'block';
      disconnectBtn.style.display = isConnected ? 'block' : 'none';
      
      portEl.textContent = port;
      serverStatusEl.textContent = serverRunning ? 'Running' : 'Stopped';
    } catch (error) {
      console.error('Failed to get status:', error);
    }
  };

  // Connect button handler
  connectBtn.addEventListener('click', async () => {
    try {
      await chrome.runtime.sendMessage({ type: 'CONNECT' });
      await updateStatus();
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  });

  // Disconnect button handler
  disconnectBtn.addEventListener('click', async () => {
    try {
      await chrome.runtime.sendMessage({ type: 'DISCONNECT' });
      await updateStatus();
    } catch (error) {
      console.error('Failed to disconnect:', error);
    }
  });

  // Initial status update
  await updateStatus();

  // Update status every 2 seconds
  setInterval(updateStatus, 2000);
});