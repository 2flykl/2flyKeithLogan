@echo off
setlocal
cd /d "%~dp0"
set PORT=8096
start "2Fly Universe V6 Server" /min cmd /c "node tools\local-server.js %PORT%"
timeout /t 2 /nobreak >nul
start "" chrome --new-window --ignore-gpu-blocklist --enable-webgl --enable-gpu-rasterization "http://127.0.0.1:%PORT%"
endlocal
