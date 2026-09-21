@echo off
setlocal EnableExtensions
cd /d "%~dp0"
set PORT=8787
where py >nul 2>nul
if %errorlevel%==0 (
  start "STREAMS Server" /min cmd /c "cd /d \"%~dp0\" && py -3 -m http.server %PORT%"
) else (
  where python >nul 2>nul
  if not %errorlevel%==0 (
    echo Python was not found. Use START_STREAMS_OVERHAUL.bat instead.
    pause
    exit /b 1
  )
  start "STREAMS Server" /min cmd /c "cd /d \"%~dp0\" && python -m http.server %PORT%"
)
powershell -NoProfile -Command "$u='http://127.0.0.1:%PORT%/'; for($i=0;$i -lt 20;$i++){try{Invoke-WebRequest -UseBasicParsing $u -TimeoutSec 1|Out-Null; Start-Process $u; exit 0}catch{Start-Sleep -Milliseconds 500}}; exit 1"
if errorlevel 1 echo Server did not become ready. Use START_STREAMS_OVERHAUL.bat instead.
pause
endlocal
