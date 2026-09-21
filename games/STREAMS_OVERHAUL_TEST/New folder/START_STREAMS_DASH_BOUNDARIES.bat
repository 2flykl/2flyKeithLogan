@echo off
setlocal EnableExtensions
cd /d "%~dp0"
title STREAMS Dash + True Boundaries
set "SONG=%~dp0assets\audio\streams_song.mp3"
set "SONGURL=https://static.wixstatic.com/mp3/85e419_7be9c7aa18ad4a6db00fd1af6ee7dbcd.mp3"
if not exist "%~dp0assets\audio" mkdir "%~dp0assets\audio" >nul 2>nul
if exist "%SONG%" goto READY
powershell -NoProfile -ExecutionPolicy Bypass -Command "$ProgressPreference='SilentlyContinue'; try { Invoke-WebRequest -UseBasicParsing -Uri '%SONGURL%' -OutFile '%SONG%'; exit 0 } catch { exit 1 }"
:READY
start "" "%~dp0index.html"
timeout /t 3 /nobreak >nul
endlocal
