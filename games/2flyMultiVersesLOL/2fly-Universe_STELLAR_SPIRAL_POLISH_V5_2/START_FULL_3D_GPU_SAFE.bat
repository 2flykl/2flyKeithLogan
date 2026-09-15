@echo off
setlocal
cd /d "%~dp0"
set PORT=8080

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo Node.js was not found. Use START_FULL_3D_RESTORE.bat or install Node.js.
  echo.
  pause
  exit /b 1
)

start "2Fly Local Server" /min cmd /c "node tools\local-server.js %PORT%"
timeout /t 2 /nobreak >nul

set "CHROME1=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
set "CHROME2=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
set "CHROME3=%LocalAppData%\Google\Chrome\Application\chrome.exe"
set "PROFILE=%TEMP%\2fly-universe-webgl-profile"

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

echo Chrome executable was not found in the standard locations.
echo The Universe was opened in your default browser instead.

goto done

:done
exit /b 0
