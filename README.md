# Nexlyra Browser

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg) ![License](https://img.shields.io/badge/license-MIT-green.svg) ![Platform](https://img.shields.io/badge/platform-Windows-lightgrey.svg)

**Nexlyra** is a keyboard-centric productivity browser designed to keep you in the flow. Unlike traditional browsers that clutter your screen with tabs and bookmarks, Nexlyra utilizes a "Command Palette" architecture powered by real-time intent detection algorithms.

It intelligently routes your keystrokes to where they need to go—whether that's a direct URL, a Google search, or an AI query to Perplexity/ChatGPT—without you needing to click a toggle.

![Nexlyra Screenshot]
<img width="1366" height="728" alt="image" src="https://github.com/user-attachments/assets/092eb69c-68c8-44b6-b1a3-0ae159870159" />



## 🚀 Key Features

* **🧠 Heuristic Intent Detection:** The omnibox uses custom regex and natural language heuristics to instantly categorize input. It knows the difference between `google.com`, `how to center a div`, and `ask ai write me a poem`.
* **⌨️ Keyboard-First Architecture:** Navigate the entire web without touching your mouse.
    * `Ctrl + L`: Instantly focus the Command Bar from anywhere (even inside web pages).
    * `Ctrl + W`: Close the application via native OS integration.
    * `Shift + Enter`: Force-route queries to the AI Engine.
* **⚡ Dual-Engine Support:** Seamlessly integrated with **Google/Bing** for web indexing and **Perplexity/ChatGPT** for generative answers.
* **🎨 "Deep Dark" UI:** A custom, frameless window design with a floating overlay architecture, featuring pill-shaped inputs and refined typography.
* **🔒 Privacy-Focused:** Built with `contextIsolation` and secure IPC bridges. User preferences are stored locally using JSON persistence; no cloud accounts required.

## 🛠️ Technical Implementation

Nexlyra is built on the **Electron** framework, leveraging several advanced patterns:

* **Native Menus:** Uses the OS-level application menu to intercept global shortcuts (`Ctrl+L`, `Ctrl+W`) before the webview renderer can consume them.
* **IPC Bridge:** Secure, bi-directional communication between the Main Process (Node.js) and Renderer Process (UI) for safe window management.
* **Regex Engine:** A robust, custom-written regex parser handles complex domain structures (e.g., `subdomain.site.vercel.app`) while filtering out standard search queries.

## 📥 Download & Install

You can download the latest Windows installer (`.exe`) from the [Releases Page](https://github.com/anurag-po/nexlyra-browser/releases).

## ⌨️ Shortcuts Reference

| Shortcut | Action |
| :--- | :--- |
| **Ctrl + L** | Focus the Command Bar (Omnibox) |
| **Ctrl + W** | Close Application |
| **Enter** | Intelligent Navigation (Auto-detects URL/Search/AI) |
| **Shift + Enter** | Force "Ask AI" Mode |
| **Ctrl + Enter** | Force "Web Search" Mode |
| **Ctrl + R** | Reload Page |

## 🔧 Developer Setup

If you want to build Nexlyra from source or contribute:

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/your-username/nexlyra-browser.git](https://github.com/anurag-po/nexlyra-browser.git)
    cd nexlyra-browser
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run in Developer Mode**
    ```bash
    npm start
    ```

4.  **Build for Production** (Creates `.exe` in `/dist`)
    ```bash
    npm run dist
    ```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
*Built with ❤️ by Anurag Puthiyaveetil Othayoth*
