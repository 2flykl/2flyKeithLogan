@echo off
setlocal EnableExtensions
cd /d "%~dp0"
title STREAMS Puzzle Flow RC
set PORT=8788
set "SONG=%~dp0assets\audio\streams_song.mp3"
set "SONGURL=https://static.wixstatic.com/mp3/85e419_7be9c7aa18ad4a6db00fd1af6ee7dbcd.mp3"
if not exist "%~dp0assets\audio" mkdir "%~dp0assets\audio" >nul 2>nul
if not exist "%SONG%" powershell -NoProfile -ExecutionPolicy Bypass -Command "$ProgressPreference='SilentlyContinue'; try { Invoke-WebRequest -UseBasicParsing -Uri '%SONGURL%' -OutFile '%SONG%' } catch {}"
where py >nul 2>nul
if %errorlevel%==0 (
  start "STREAMS Overhaul Server" /min cmd /c "cd /d \"%~dp0\" && py -3 -m http.server %PORT% --bind 127.0.0.1"
) else (
  where python >nul 2>nul
  if %errorlevel%==0 (
    start "STREAMS Overhaul Server" /min cmd /c "cd /d \"%~dp0\" && python -m http.server %PORT% --bind 127.0.0.1"
  ) else (
    start "" "%~dp0index.html?v=puzzle_flow_rc"
    exit /b 0
  )
)
powershell -NoProfile -Command "$u='http://127.0.0.1:%PORT%/?v=puzzle_flow_rc'; for($i=0;$i -lt 30;$i++){try{Invoke-WebRequest -UseBasicParsing $u -TimeoutSec 1|Out-Null; Start-Process $u; exit 0}catch{Start-Sleep -Milliseconds 300}}; exit 1"
if errorlevel 1 start "" "%~dp0index.html?v=puzzle_flow_rc"
endlocal
