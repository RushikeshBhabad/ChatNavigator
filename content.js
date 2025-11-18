// ChatGPT Prompt Navigator - Content Script
class PromptNavigator {
  constructor() {
    this.prompts = [];
    this.sidebarVisible = true;
    this.observer = null;
    this.init();
  }

  init() {
    // Wait for page to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    this.createSidebar();
    this.extractPrompts();
    this.startObserver();
    this.attachEventListeners();
  }

  createSidebar() {
    // Create sidebar container
    const sidebar = document.createElement('div');
    sidebar.id = 'prompt-navigator-sidebar';
    sidebar.innerHTML = `
      <div class="pn-header">
        <h3>📌 Prompt Navigator</h3>
        <button class="pn-toggle-btn" id="pn-close-btn">Hide</button>
      </div>
      <div class="pn-stats">
        <span>Total Prompts: <span class="pn-count" id="pn-count">0</span></span>
        <button class="pn-refresh-btn" id="pn-refresh-btn">🔄 Refresh</button>
      </div>
      <div class="pn-list" id="pn-list">
        <div class="pn-empty">
          <div class="pn-empty-icon">💬</div>
          <div>No prompts detected yet.<br>Start chatting with ChatGPT!</div>
        </div>
      </div>
    `;
    document.body.appendChild(sidebar);

    // Create floating toggle button (shown when sidebar is hidden)
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'pn-floating-toggle';
    toggleBtn.className = 'hidden';
    toggleBtn.textContent = 'Show Prompts';
    document.body.appendChild(toggleBtn);
  }

  extractPrompts() {
    this.prompts = [];
    
    // ChatGPT's conversation structure
    // Look for user message containers
    const messages = document.querySelectorAll('[data-message-author-role="user"]');
    
    messages.forEach((msg, index) => {
      // Get the text content
      const textElement = msg.querySelector('.whitespace-pre-wrap, [class*="markdown"], .text-base');
      if (!textElement) return;
      
      const text = textElement.textContent.trim();
      if (!text) return;

      // Assign unique ID if not present
      if (!msg.id) {
        msg.id = `pn-prompt-${index}`;
      }

      this.prompts.push({
        id: msg.id,
        text: text,
        index: index + 1,
        element: msg,
        timestamp: new Date().toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      });
    });

    this.updateSidebar();
  }

  updateSidebar() {
    const listContainer = document.getElementById('pn-list');
    const countElement = document.getElementById('pn-count');
    
    if (!listContainer || !countElement) return;

    // Update count
    countElement.textContent = this.prompts.length;

    // Clear list
    listContainer.innerHTML = '';

    if (this.prompts.length === 0) {
      listContainer.innerHTML = `
        <div class="pn-empty">
          <div class="pn-empty-icon">💬</div>
          <div>No prompts detected yet.<br>Start chatting with ChatGPT!</div>
        </div>
      `;
      return;
    }

    // Reverse to show latest first
    const reversedPrompts = [...this.prompts].reverse();

    reversedPrompts.forEach(prompt => {
      const item = document.createElement('div');
      item.className = 'pn-item';
      item.dataset.promptId = prompt.id;
      
      // Truncate long text
      const displayText = prompt.text.length > 120 
        ? prompt.text.substring(0, 120) + '...' 
        : prompt.text;
      
      item.innerHTML = `
        <div class="pn-item-number">#${prompt.index}</div>
        <div class="pn-item-text">${this.escapeHtml(displayText)}</div>
        <div class="pn-item-time">${prompt.timestamp}</div>
      `;

      item.addEventListener('click', () => this.scrollToPrompt(prompt));
      
      listContainer.appendChild(item);
    });
  }

  scrollToPrompt(prompt) {
    // Remove active class from all items
    document.querySelectorAll('.pn-item').forEach(item => {
      item.classList.remove('active');
    });

    // Add active class to clicked item
    const clickedItem = document.querySelector(`[data-prompt-id="${prompt.id}"]`);
    if (clickedItem) {
      clickedItem.classList.add('active');
    }

    // Scroll to the prompt
    if (prompt.element) {
      // First, scroll to the element
      prompt.element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });

      // Add highlight effect
      prompt.element.style.transition = 'background-color 0.5s';
      const originalBg = prompt.element.style.backgroundColor;
      prompt.element.style.backgroundColor = 'rgba(59, 130, 246, 0.2)';
      
      setTimeout(() => {
        prompt.element.style.backgroundColor = originalBg;
      }, 2000);
    }
  }

  startObserver() {
    // Watch for new messages being added
    const targetNode = document.querySelector('main') || document.body;
    
    const config = { 
      childList: true, 
      subtree: true 
    };

    this.observer = new MutationObserver((mutations) => {
      // Debounce to avoid excessive updates
      clearTimeout(this.updateTimeout);
      this.updateTimeout = setTimeout(() => {
        this.extractPrompts();
      }, 500);
    });

    this.observer.observe(targetNode, config);
  }

  attachEventListeners() {
    // Close button
    const closeBtn = document.getElementById('pn-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.toggleSidebar());
    }

    // Floating toggle button
    const floatingToggle = document.getElementById('pn-floating-toggle');
    if (floatingToggle) {
      floatingToggle.addEventListener('click', () => this.toggleSidebar());
    }

    // Refresh button
    const refreshBtn = document.getElementById('pn-refresh-btn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        this.extractPrompts();
        this.showNotification('Prompts refreshed!');
      });
    }
  }

  toggleSidebar() {
    const sidebar = document.getElementById('prompt-navigator-sidebar');
    const floatingToggle = document.getElementById('pn-floating-toggle');
    
    if (!sidebar || !floatingToggle) return;

    this.sidebarVisible = !this.sidebarVisible;

    if (this.sidebarVisible) {
      sidebar.classList.remove('hidden');
      floatingToggle.classList.add('hidden');
    } else {
      sidebar.classList.add('hidden');
      floatingToggle.classList.remove('hidden');
    }
  }

  showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 340px;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      z-index: 1000000;
      font-size: 14px;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Add animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Initialize the extension
const navigator = new PromptNavigator();