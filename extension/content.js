// Content script for Browser MCP Extension
(function() {
  'use strict';

  // Prevent multiple injections
  if (window.browserMCPInjected) {
    return;
  }
  window.browserMCPInjected = true;

  console.log('Browser MCP content script loaded');

  // Communication with background script
  const sendToBackground = (message) => {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(message, resolve);
    });
  };

  // DOM interaction functions
  const domHelpers = {
    // Take screenshot of element or full page
    screenshot: async (selector = null) => {
      try {
        if (selector) {
          const element = document.querySelector(selector);
          if (!element) {
            throw new Error(`Element not found: ${selector}`);
          }
          // Scroll element into view
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        // Request screenshot from background script
        const result = await sendToBackground({
          type: 'TAKE_SCREENSHOT',
          selector: selector
        });
        
        return result;
      } catch (error) {
        console.error('Screenshot error:', error);
        throw error;
      }
    },

    // Click on element
    click: async (selector) => {
      try {
        const element = document.querySelector(selector);
        if (!element) {
          throw new Error(`Element not found: ${selector}`);
        }
        
        // Scroll into view and click
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        await new Promise(resolve => setTimeout(resolve, 300));
        
        element.click();
        return { success: true };
      } catch (error) {
        console.error('Click error:', error);
        throw error;
      }
    },

    // Type text into element
    type: async (selector, text) => {
      try {
        const element = document.querySelector(selector);
        if (!element) {
          throw new Error(`Element not found: ${selector}`);
        }
        
        element.focus();
        element.value = text;
        
        // Trigger input events
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        
        return { success: true };
      } catch (error) {
        console.error('Type error:', error);
        throw error;
      }
    },

    // Get page content
    getContent: (selector = null) => {
      try {
        if (selector) {
          const element = document.querySelector(selector);
          if (!element) {
            throw new Error(`Element not found: ${selector}`);
          }
          return {
            text: element.textContent || element.innerText,
            html: element.innerHTML
          };
        } else {
          return {
            text: document.body.textContent || document.body.innerText,
            html: document.body.innerHTML,
            title: document.title,
            url: window.location.href
          };
        }
      } catch (error) {
        console.error('Get content error:', error);
        throw error;
      }
    },

    // Get interactive elements
    getInteractiveElements: () => {
      const selectors = [
        'button',
        'input[type="button"]',
        'input[type="submit"]',
        'a[href]',
        'input[type="text"]',
        'input[type="email"]',
        'input[type="password"]',
        'textarea',
        'select',
        '[onclick]',
        '[role="button"]'
      ];
      
      const elements = [];
      selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach((el, index) => {
          const rect = el.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            elements.push({
              selector: `${selector}:nth-of-type(${index + 1})`,
              text: el.textContent?.trim() || el.value || el.placeholder || '',
              type: el.tagName.toLowerCase(),
              visible: rect.top >= 0 && rect.left >= 0 && 
                      rect.bottom <= window.innerHeight && 
                      rect.right <= window.innerWidth
            });
          }
        });
      });
      
      return elements;
    }
  };

  // Listen for messages from background script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
      case 'DOM_SCREENSHOT':
        domHelpers.screenshot(message.selector)
          .then(result => sendResponse(result))
          .catch(error => sendResponse({ error: error.message }));
        return true;

      case 'DOM_CLICK':
        domHelpers.click(message.selector)
          .then(result => sendResponse(result))
          .catch(error => sendResponse({ error: error.message }));
        return true;

      case 'DOM_TYPE':
        domHelpers.type(message.selector, message.text)
          .then(result => sendResponse(result))
          .catch(error => sendResponse({ error: error.message }));
        return true;

      case 'DOM_GET_CONTENT':
        try {
          const result = domHelpers.getContent(message.selector);
          sendResponse(result);
        } catch (error) {
          sendResponse({ error: error.message });
        }
        break;

      case 'DOM_GET_INTERACTIVE':
        try {
          const result = domHelpers.getInteractiveElements();
          sendResponse(result);
        } catch (error) {
          sendResponse({ error: error.message });
        }
        break;

      default:
        sendResponse({ error: 'Unknown message type' });
    }
  });

  // Notify background script that content script is ready
  sendToBackground({ type: 'CONTENT_SCRIPT_READY' });

})();