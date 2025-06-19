#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, 'dist');
const extensionDir = path.join(distDir, 'extension');

// Ensure directories exist
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

if (!fs.existsSync(extensionDir)) {
  fs.mkdirSync(extensionDir, { recursive: true });
}

console.log('Building Browser MCP Extension...');

try {
  // Copy extension files
  console.log('Copying extension files...');
  execSync(`cp -r extension/* ${extensionDir}/`, { stdio: 'inherit' });

  // Build TypeScript if needed (for now we'll skip this as we have JS files)
  console.log('Extension files copied successfully!');

  // Create a simple package info
  const packageInfo = {
    name: 'browser-mcp-extension',
    version: '0.1.3',
    description: 'Browser MCP Chrome Extension',
    built: new Date().toISOString()
  };

  fs.writeFileSync(
    path.join(extensionDir, 'package-info.json'),
    JSON.stringify(packageInfo, null, 2)
  );

  console.log('✅ Extension built successfully!');
  console.log(`📁 Extension files are in: ${extensionDir}`);
  console.log('');
  console.log('To install:');
  console.log('1. Open Chrome and go to chrome://extensions/');
  console.log('2. Enable "Developer mode"');
  console.log('3. Click "Load unpacked"');
  console.log(`4. Select the folder: ${extensionDir}`);

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}