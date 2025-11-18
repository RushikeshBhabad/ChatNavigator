# 📌 ChatGPT Prompt Navigator

> A Chrome extension that adds a beautiful sidebar to ChatGPT for instant navigation through your conversation history.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Chrome](https://img.shields.io/badge/chrome-extension-orange.svg)

---

## 🌟 Why This Extension?

Ever had a long ChatGPT conversation with 100+ messages and struggled to find that one specific prompt you asked earlier? **This extension solves that problem!**

### The Problem:
- ❌ Long conversations = endless scrolling
- ❌ No built-in "jump to message" feature in ChatGPT
- ❌ Hard to remember what you asked earlier
- ❌ Time wasted searching for previous responses

### The Solution:
- ✅ **Automatic prompt collection** - Captures every message you send
- ✅ **Sidebar navigation** - Clean, organized list of all your prompts
- ✅ **One-click jump** - Instantly scroll to any prompt + response
- ✅ **Real-time updates** - New prompts appear automatically
- ✅ **Beautiful UI** - Modern, gradient design that doesn't get in your way

---

## 🎥 Demo

```
┌─────────────────────────────────────────┐
│  ChatGPT Conversation                   │  📌 Prompt Navigator
│                                         │  ┌─────────────────────┐
│  User: Explain OSI Model               │  │ #15 "Fix my Python" │
│  AI: The OSI Model consists of...     │  │ #14 "Explain async" │
│                                         │  │ #13 "Write a regex" │
│  User: Give me Python code             │  │ #12 "Debug this..."  │◄─ Click!
│  AI: Here's the code...                │  │ #11 "Create API..."  │
│                                         │  └─────────────────────┘
│  [Scrolls automatically on click! 🚀]  │
└─────────────────────────────────────────┘
```

---

## 🚀 Installation

### Option 1: Manual Installation (Developer Mode)

1. **Download the extension files:**
   ```bash
   git clone https://github.com/yourusername/chatgpt-navigator.git
   cd chatgpt-navigator
   ```

2. **Create icon files** (or use placeholders for testing):
   - Create 3 PNG images: `icon16.png`, `icon48.png`, `icon128.png`
   - Or download free icons from [Flaticon](https://www.flaticon.com)

3. **Load in Chrome:**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable **Developer mode** (toggle in top-right corner)
   - Click **"Load unpacked"**
   - Select the `chatgpt-navigator` folder
   - ✅ Extension installed!

4. **Test it:**
   - Go to [ChatGPT](https://chat.openai.com)
   - Start chatting
   - See the sidebar appear on the right! 🎉

### Option 2: From Chrome Web Store
*(Coming soon - awaiting Chrome Web Store approval)*

---

## 📦 Project Structure

```
chatgpt-navigator/
├── manifest.json          # Extension configuration
├── content.js            # Core logic (DOM parsing, navigation)
├── sidebar.css           # Sidebar styling
├── icon16.png           # Extension icon (16×16)
├── icon48.png           # Extension icon (48×48)
├── icon128.png          # Extension icon (128×128)
└── README.md            # This file
```

---

## 🎯 Features

### Core Features
- 🔍 **Auto-Detection** - Automatically captures every prompt you send
- 📊 **Real-Time Updates** - New messages appear instantly in sidebar
- 🖱️ **One-Click Navigation** - Click any prompt to jump to it
- ✨ **Smooth Scrolling** - Animated scroll with highlight effect
- 🎨 **Modern UI** - Beautiful gradient design with hover animations
- 📱 **Responsive** - Works on all screen sizes

### User Interface
- 📌 **Collapsible Sidebar** - Hide/show with toggle button
- 🔢 **Numbered Prompts** - Easy reference (#1, #2, #3...)
- ⏰ **Timestamps** - Shows when each prompt was sent
- 📝 **Text Preview** - Long prompts are automatically truncated
- 🔄 **Refresh Button** - Manually update prompt list
- 📊 **Prompt Counter** - Shows total number of prompts

### Technical Features
- ⚡ **Performance Optimized** - Uses MutationObserver for efficient DOM watching
- 🎯 **Precise Targeting** - Works with ChatGPT's exact DOM structure
- 🔒 **Privacy First** - No data sent to external servers
- 🌐 **Multi-Domain Support** - Works on both chat.openai.com and chatgpt.com

---

## 🛠️ How It Works

### Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Content Script                       │
│                    (content.js)                         │
│                                                         │
│  1. DOM Parser                                         │
│     └─► Finds [data-message-author-role="user"]       │
│                                                         │
│  2. MutationObserver                                   │
│     └─► Watches for new messages in real-time         │
│                                                         │
│  3. Sidebar Renderer                                   │
│     └─► Creates & updates prompt list UI              │
│                                                         │
│  4. Navigation Handler                                 │
│     └─► Scrolls to clicked prompt with animation      │
└─────────────────────────────────────────────────────────┘
```

### Step-by-Step Process

1. **Page Load:**
   - Extension injects `content.js` and `sidebar.css`
   - Creates sidebar HTML structure
   - Initializes MutationObserver

2. **Prompt Detection:**
   - Scans DOM for user messages: `[data-message-author-role="user"]`
   - Extracts text content
   - Assigns unique IDs to each message

3. **Sidebar Update:**
   - Renders prompts in reverse order (newest first)
   - Shows prompt number, preview text, and timestamp
   - Updates counter badge

4. **User Interaction:**
   - User clicks a prompt in sidebar
   - `scrollIntoView()` smoothly scrolls to message
   - Temporary highlight effect applied
   - Active state added to clicked item

5. **Real-Time Monitoring:**
   - MutationObserver watches for DOM changes
   - Detects new messages automatically
   - Updates sidebar without page refresh

---

## 🎨 Customization Guide

### Change Sidebar Width

**File:** `sidebar.css` (Line 3)
```css
#prompt-navigator-sidebar {
  width: 320px;  /* Change to 400px for wider sidebar */
}
```

### Change Color Theme

**File:** `sidebar.css`

Replace blue theme colors:
```css
/* Find and replace these colors: */
#3b82f6  →  Your primary color
#2563eb  →  Your darker shade
#1e293b  →  Your background color
```

**Example - Green Theme:**
```css
background: linear-gradient(135deg, #10b981 0%, #059669 100%);
```

### Change Font

**File:** `sidebar.css` (Line 8)
```css
font-family: 'Your Font', -apple-system, BlinkMacSystemFont, sans-serif;
```

### Adjust Scroll Speed

**File:** `content.js` (Line 150)
```javascript
prompt.element.scrollIntoView({ 
  behavior: 'smooth',  // Change to 'auto' for instant scroll
  block: 'center'      // Options: 'start', 'center', 'end'
});
```

---

## 🔧 Troubleshooting

### Sidebar Not Appearing

**Problem:** Extension loaded but no sidebar visible

**Solutions:**
1. Check if you're on the correct domain:
   - ✅ `https://chat.openai.com/*`
   - ✅ `https://chatgpt.com/*`
2. Open DevTools (`F12`) → Check Console for errors
3. Try refreshing the page (`Ctrl+R`)
4. Disable other ChatGPT extensions temporarily

---

### Prompts Not Detected

**Problem:** Sidebar shows "No prompts detected"

**Solutions:**
1. Send a message in ChatGPT first
2. Click the "🔄 Refresh" button in sidebar
3. Check if ChatGPT's DOM structure changed (they update it sometimes)
4. Open DevTools Console and type:
   ```javascript
   document.querySelectorAll('[data-message-author-role="user"]')
   ```
   If this returns 0, ChatGPT changed their structure

---

### Extension Not Loading

**Problem:** Extension doesn't appear in `chrome://extensions/`

**Solutions:**
1. Verify all files are in the same folder
2. Check `manifest.json` syntax (use [JSONLint](https://jsonlint.com))
3. Make sure icon files exist (even blank PNGs work for testing)
4. Try clicking "Reload" button in extensions page

---

### Clicking Prompt Doesn't Scroll

**Problem:** Click works but page doesn't scroll

**Solutions:**
1. Check browser console for JavaScript errors
2. Verify the message element still exists on page
3. Try the "🔄 Refresh" button
4. Check if another extension is interfering

---

### Performance Issues

**Problem:** Page feels slow or laggy

**Solutions:**
1. Reduce update frequency in `content.js`:
   ```javascript
   // Line 139 - increase timeout from 500ms to 1000ms
   setTimeout(() => { this.extractPrompts(); }, 1000);
   ```
2. Limit number of displayed prompts:
   ```javascript
   // In updateSidebar() function, add:
   const reversedPrompts = [...this.prompts].reverse().slice(0, 50);
   ```

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### Report Bugs
- Open an issue with detailed description
- Include screenshot if possible
- Mention Chrome version and OS

### Suggest Features
- Check existing issues first
- Describe the feature clearly
- Explain the use case

### Submit Pull Requests
1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly
5. Submit PR with clear description

---

## 📝 Development Roadmap

### Version 1.1 (Planned)
- [ ] 🔍 Search/filter prompts
- [ ] 📁 Export prompts to TXT/JSON
- [ ] ⌨️ Keyboard shortcuts (Ctrl+1, Ctrl+2...)
- [ ] 🎨 Theme customization panel

### Version 1.2 (Future)
- [ ] 🏷️ Tag/categorize prompts
- [ ] 💾 Persistent storage across sessions
- [ ] 📊 Conversation statistics
- [ ] 🌙 Light/dark mode toggle

### Version 2.0 (Long-term)
- [ ] 🔄 Sync across devices
- [ ] 📈 Analytics dashboard
- [ ] 🤖 AI-powered prompt suggestions
- [ ] 🌍 Multi-language support

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

---

## 👨‍💻 Author

Created with ❤️ by [Your Name]

- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- ChatGPT team for the amazing AI interface
- Chrome Extensions documentation
- All contributors and users

---

## 📞 Support

- 🐛 **Found a bug?** Open an [issue](https://github.com/yourusername/chatgpt-navigator/issues)
- 💡 **Have a suggestion?** Start a [discussion](https://github.com/yourusername/chatgpt-navigator/discussions)
- ⭐ **Like the extension?** Give us a star on GitHub!

---

## 📊 Statistics

- 🚀 Active Users: 0 (just launched!)
- ⭐ GitHub Stars: 0
- 🐛 Open Issues: 0
- 📝 Total Prompts Navigated: ∞

---

<div align="center">

**Made with ☕ and 💻**

[⬆ Back to Top](#-chatgpt-prompt-navigator)

</div>
