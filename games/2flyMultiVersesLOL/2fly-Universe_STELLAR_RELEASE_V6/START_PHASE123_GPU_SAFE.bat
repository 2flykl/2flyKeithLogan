@echo off
setlocal
cd /d "%~dp0"
set PORT=8088
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is required for this local 3D build.
  echo Install Node.js or use an existing local web server.
  pause
  exit /b 1
)
start "2Fly Phase123 Local Server" /min cmd /c "node tools\local-server.js %PORT%"
timeout /t 2 /nobreak >nul
set "CHROME1=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
set "CHROME2=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
set "CHROME3=%LocalAppData%\Google\Chrome\Application\chrome.exe"
set "PROFILE=%TEMP%\2fly-phase123-webgl-profile"
if exist "%CHROME1%" goto chrome1
if exist "%CHROME2%" goto chrome2
if exist "%CHROME3%" goto chrome3
goto defaultbrowser
:chrome1
start "" "%CHROME1%" --user-data-dir="%PROFILE%" --ignore-gpu-blocklist --enable-webgl --enable-gpu-rasterization --use-angle=d3d11 --new-window "http://127.0.0.1:%PORT%/"
goto done
:chrome2
start "" "%CHROME2%" --user-data-dir="%PROFILE%" --ignore-gpu-blocklist --enable-webgl --enable-gpu-rasterization --use-angle=d3d11 --new-window "http://127.0.0.1:%PORT%/"
goto done
:chrome3
start "" "%CHROME3%" --user-data-dir="%PROFILE%" --ignore-gpu-blocklist --enable-webgl --enable-gpu-rasterization --use-angle=d3d11 --new-window "http://127.0.0.1:%PORT%/"
goto done
:defaultbrowser
start "" "http://127.0.0.1:%PORT%/"
:done
exit /b 0
