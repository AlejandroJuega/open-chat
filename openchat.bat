@echo off
title OpenChat - AI Chat with LM Studio
color 0A

:main_menu
cls
echo.
echo  +============================================+
echo  ^|      OpenChat - AI Chat with LM Studio   ^|
echo  +============================================+
echo.
echo   Select an option:
echo.
echo   [1] Simple Chat (no installation - recommended)
echo   [2] Full Chat (requires Node.js)
echo   [3] Install dependencies
echo   [4] Check installation
echo   [5] Exit
echo.

set /p choice="   Option: "

if "%choice%"=="1" goto simple
if "%choice%"=="2" goto full
if "%choice%"=="3" goto install
if "%choice%"=="4" goto check
if "%choice%"=="5" goto end
goto main_menu

:simple
cls
echo.
echo  +============================================+
echo  ^|         Simple Chat - No Installation     ^|
echo  +============================================+
echo.
echo   - Chat file found
echo.
echo   - Opening in browser...
echo.
start "" "%~dp0simple chat\index.html"

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
pause
goto main_menu

:full
cls
echo.
echo  +============================================+
echo  ^|              Full Chat                    ^|
echo  +============================================+
echo.

python --version >nul 2>&1
if errorlevel 1 (
    echo X Python is not installed
    echo.
    echo   Download from: https://www.python.org/downloads/
    pause
    goto main_menu
)

pip show openchat >nul 2>&1
if errorlevel 1 (
    echo   - Installing OpenChat...
    pip install -e . >nul 2>&1
    if errorlevel 1 (
        echo X Error installing OpenChat
        pause
        goto main_menu
    )
    echo   - OpenChat installed
    echo.
)

echo   - Starting full server...
echo.
python -m openchat run

pause
goto main_menu

:install
cls
echo.
echo  +============================================+
echo  ^|          Installing Dependencies          ^|
echo  +============================================+
echo.

python -m openchat install

pause
goto main_menu

:check
cls
echo.
echo  +============================================+
echo  ^|          Checking Installation            ^|
echo  +============================================+
echo.

python -m openchat check

pause
goto main_menu

:end
cls
echo.
echo   Thanks for using OpenChat!
echo.
exit
