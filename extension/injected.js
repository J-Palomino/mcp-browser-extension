// Injected script for deeper DOM access and page interaction
(function() {
  'use strict';

  // Enhanced DOM utilities that run in the page context
  window.browserMCPUtils = {
    // Get comprehensive page information
    getPageInfo: () => {
      return {
        title: document.title,
        url: window.location.href,
        domain: window.location.hostname,
        readyState: document.readyState,
        scrollPosition: {
          x: window.scrollX,
          y: window.scrollY
        },
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        documentSize: {
          width: document.documentElement.scrollWidth,
          height: document.documentElement.scrollHeight
        }
      };
    },

    // Enhanced element selection with better targeting
    findElements: (selector, options = {}) => {
      try {
        const elements = document.querySelectorAll(selector);
        const results = [];
        
        elements.forEach((el, index) => {
          const rect = el.getBoundingClientRect();
          const isVisible = rect.width > 0 && rect.height > 0 && 
                           rect.top < window.innerHeight && 
                           rect.bottom > 0 &&
                           rect.left < window.innerWidth && 
                           rect.right > 0;
          
          if (!options.visibleOnly || isVisible) {
            results.push({
              index,
              selector: `${selector}:nth-of-type(${index + 1})`,
              tagName: el.tagName.toLowerCase(),
              text: el.textContent?.trim().substring(0, 100) || '',
              value: el.value || '',
              placeholder: el.placeholder || '',
              id: el.id || '',
              className: el.className || '',
              rect: {
                x: rect.x,
                y: rect.y,
                width: rect.width,
                height: rect.height
              },
              visible: isVisible,
              clickable: el.onclick !== null || 
                        el.tagName.toLowerCase() === 'button' ||
                        el.tagName.toLowerCase() === 'a' ||
                        el.type === 'button' ||
                        el.type === 'submit'
            });
          }
        });
        
        return results;
      } catch (error) {
        console.error('Error finding elements:', error);
        return [];
      }
    },

    // Smart element interaction
    smartClick: (selector) => {
      try {
        const element = document.querySelector(selector);
        if (!element) {
          throw new Error(`Element not found: ${selector}`);
        }

        // Scroll into view
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'center'
        });

        // Wait a bit for scroll to complete
        setTimeout(() => {
          // Try different click methods
          if (element.click) {
            element.click();
          } else {
            // Fallback to dispatching click event
            const event = new MouseEvent('click', {
              bubbles: true,
              cancelable: true,
              view: window
            });
            element.dispatchEvent(event);
          }
        }, 300);

        return { success: true };
      } catch (error) {
        console.error('Smart click error:', error);
        throw error;
      }
    },

    // Enhanced text input
    smartType: (selector, text, options = {}) => {
      try {
        const element = document.querySelector(selector);
        if (!element) {
          throw new Error(`Element not found: ${selector}`);
        }

        // Focus the element
        element.focus();

        // Clear existing content if requested
        if (options.clear !== false) {
          element.value = '';
        }

        // Type character by character for more realistic input
        if (options.realistic) {
          let index = 0;
          const typeChar = () => {
            if (index < text.length) {
              element.value += text[index];
              element.dispatchEvent(new Event('input', { bubbles: true }));
              index++;
              setTimeout(typeChar, 50 + Math.random() * 100);
            } else {
              element.dispatchEvent(new Event('change', { bubbles: true }));
            }
          };
          typeChar();
        } else {
          // Fast input
          element.value = text;
          element.dispatchEvent(new Event('input', { bubbles: true }));
          element.dispatchEvent(new Event('change', { bubbles: true }));
        }

        return { success: true };
      } catch (error) {
        console.error('Smart type error:', error);
        throw error;
      }
    },

    // Wait for elements to appear
    waitForElement: (selector, timeout = 5000) => {
      return new Promise((resolve, reject) => {
        const element = document.querySelector(selector);
        if (element) {
          resolve(element);
          return;
        }

        const observer = new MutationObserver((mutations) => {
          const element = document.querySelector(selector);
          if (element) {
            observer.disconnect();
            resolve(element);
          }
        });

        observer.observe(document.body, {
          childList: true,
          subtree: true
        });

        setTimeout(() => {
          observer.disconnect();
          reject(new Error(`Element not found within ${timeout}ms: ${selector}`));
        }, timeout);
      });
    },

    // Extract structured data from the page
    extractData: (config) => {
      const result = {};
      
      for (const [key, selector] of Object.entries(config)) {
        try {
          if (typeof selector === 'string') {
            const element = document.querySelector(selector);
            result[key] = element ? element.textContent?.trim() : null;
          } else if (selector.multiple) {
            const elements = document.querySelectorAll(selector.selector);
            result[key] = Array.from(elements).map(el => 
              selector.attribute ? el.getAttribute(selector.attribute) : el.textContent?.trim()
            );
          }
        } catch (error) {
          result[key] = null;
        }
      }
      
      return result;
    }
  };

  // Notify that utilities are ready
  window.dispatchEvent(new CustomEvent('browserMCPReady'));

})();