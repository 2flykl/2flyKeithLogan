@echo off
setlocal
cd /d "%~dp0"
set PORT=8090
start "2Fly Universe Local Server" cmd /k "node tools\local-server.js %PORT%"
timeout /t 2 /nobreak >nul
set CHROME=%ProgramFiles%\Google\Chrome\Application\chrome.exe
if not exist "%CHROME%" set CHROME=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe
if exist "%CHROME%" (
  start "" "%CHROME%" --ignore-gpu-blocklist --enable-gpu-rasterization --enable-zero-copy http://127.0.0.1:%PORT%
) else (
  start "" http://127.0.0.1:%PORT%
)
endlocal
