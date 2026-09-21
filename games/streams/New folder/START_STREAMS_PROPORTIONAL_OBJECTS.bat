@echo off
setlocal EnableExtensions
cd /d "%~dp0"
title STREAMS Proportional Objects
set "SONG=%~dp0assets\audio\streams_song.mp3"
set "SONGURL=https://static.wixstatic.com/mp3/85e419_7be9c7aa18ad4a6db00fd1af6ee7dbcd.mp3"
echo.
echo =============================================
echo      STREAMS - PROPORTIONAL OBJECTS
 echo =============================================
echo.
if not exist "%~dp0assets\audio" mkdir "%~dp0assets\audio" >nul 2>nul
if exist "%SONG%" goto READY
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$ProgressPreference='SilentlyContinue'; try { Invoke-WebRequest -UseBasicParsing -Uri '%SONGURL%' -OutFile '%SONG%'; if((Get-Item '%SONG%').Length -lt 100000){throw 'Downloaded file is too small'}; exit 0 } catch { exit 1 }"
:READY
start "" "%~dp0index.html"
timeout /t 3 /nobreak >nul
endlocal
