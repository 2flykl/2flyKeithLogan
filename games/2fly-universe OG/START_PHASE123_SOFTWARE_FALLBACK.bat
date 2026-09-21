@echo off
setlocal
cd /d "%~dp0"
set PORT=8088
where node >nul 2>nul
if errorlevel 1 (echo Node.js is required.& pause & exit /b 1)
start "2Fly Phase123 Local Server" /min cmd /c "node tools\local-server.js %PORT%"
timeout /t 2 /nobreak >nul
set "CHROME=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
if not exist "%CHROME%" set "CHROME=%LocalAppData%\Google\Chrome\Application\chrome.exe"
if exist "%CHROME%" (
  start "" "%CHROME%" --user-data-dir="%TEMP%\2fly-phase123-software-profile" --ignore-gpu-blocklist --enable-webgl --use-angle=swiftshader --new-window "http://127.0.0.1:%PORT%/"
) else (
  start "" "http://127.0.0.1:%PORT%/"
)
exit /b 0
