#!/bin/bash

# OpenChat Simple - No Installation Required

echo ""
echo "  +============================================+"
echo "  |     OpenChat Simple - No Installation    |"
echo "  +============================================+"
echo ""

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HTML_FILE="$SCRIPT_DIR/simple chat/index.html"

if [ ! -f "$HTML_FILE" ]; then
    echo "X index.html not found"
    exit 1
fi

echo "  - Chat file found"
echo ""
echo "  - Opening in browser..."
echo ""

open "$HTML_FILE" 2>/dev/null || xdg-open "$HTML_FILE" 2>/dev/null || echo "Open manually: $HTML_FILE"

echo ""
echo "  +============================================+"
echo ""
echo "  LM Studio Setup:"
echo ""
echo "  1. Open LM Studio"
echo "  2. Load a model"
echo "  3. Start the local server"
echo ""
echo "  In the chat:"
echo "  - Go to Settings"
echo "  - Test the connection"
echo "  - Select a model"
echo "  - Start chatting!"
echo ""
echo "  +============================================+"
