# 🤖 OpenChat - AI Chat with LM Studio

Open WebUI-style chat interface for **LM Studio**.

---

## 🚀 How to Use (2 options)

### Option 1: Simple Chat (Recommended) ✅

**No installation, no Python, no Node.js**

```
Open: "simple chat\index.html"
```

That's it! Works directly in the browser.

---

### Option 2: Full Chat

**Requires Python and Node.js, more features**

```bash
# Install
cd "mi-open-chat"
pip install -e .

# Run
openchat run
```

---

## 📁 Structure

```
your directory/
├── openchat.bat           <- Main menu (double click)
├── simple chat/
│   └── index.html        <- Simple chat (open directly)
├── openchat/             <- Python library
│   ├── cli.py
│   ├── installer.py
│   └─ server.py
|   └─ setup.py
├── Open Chat Simple.bat <- Simple chat shortcut
└── README.md
```

---

## ⚙️ LM Studio Setup

1. Open **LM Studio**
2. Load a model
3. Go to **"Local Server"**
4. Click **"Start Server"**
5. Make sure URL is `http://localhost:1234/v1`

---

## 🌟 Features

| Feature | Simple | Full |
|---------|--------|------|
| Chat with streaming | ✅ | ✅ |
| Conversation history | ✅ | ✅ |
| Model selector | ✅ | ✅ |
| Settings | ✅ | ✅ |
| User login | ❌ | ✅ |
| Responsive | ✅ | ✅ |
| Customizable | ✅ | ✅ |

---

## 🎨 Customization

Edit CSS variables in `index.html`:

```css
:root {
    --color-primary: #10a37f;      /* Main color */
    --bg-primary: #212121;          /* Dark background */
    --sidebar-width: 280px;        /* Sidebar width */
}
```

See [CUSTOMIZATION.md](CUSTOMIZATION.md) for more options.

---

## 🔧 Troubleshooting

### "Cannot connect"

1. LM Studio must be open
2. Local server must be started
3. Check URL is `http://localhost:1234/v1`

### "No models appear"

1. Load at least one model in LM Studio
2. Start the local server

---

## 📄 License

MIT License

---

Made with ❤️ for the LM Studio community
