@echo off
setlocal
cd /d "%~dp0"
set PORT=8091
start "2Fly Universe Server" /min cmd /c "node tools\local-server.js %PORT%"
timeout /t 2 /nobreak >nul
set URL=http://127.0.0.1:%PORT%/
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
  start "" "%ProgramFiles%\Google\Chrome\Application\chrome.exe" --ignore-gpu-blocklist --enable-gpu-rasterization --enable-zero-copy --new-window "%URL%"
) else if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" (
  start "" "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" --ignore-gpu-blocklist --enable-gpu-rasterization --enable-zero-copy --new-window "%URL%"
) else (
  start "" "%URL%"
)
endlocal
