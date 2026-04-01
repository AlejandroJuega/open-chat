@echo off
title OpenChat Simple - No Installation Required
color 0A

echo.
echo  +============================================+
echo  ^|     OpenChat Simple - No Installation    ^|
echo  +============================================+
echo.

cd /d "%~dp0"

set "HTML_FILE=%~dp0simple chat\index.html"

if not exist "%HTML_FILE%" (
    echo X index.html not found
    echo.
    pause
    exit /b 1
)

echo   - Chat file found
echo.
echo   - Opening in browser...
echo.

start "" "%HTML_FILE%"

echo.
echo  +============================================+
echo.
echo   LM Studio Setup:
echo.
echo   1. Open LM Studio
echo   2. Load a model
echo   3. Start the local server
echo.
echo   In the chat:
echo   - Go to Settings
echo   - Test the connection
echo   - Select a model
echo   - Start chatting!
echo.
echo  +============================================+
echo.
echo   Press any key to exit...
pause >nul
