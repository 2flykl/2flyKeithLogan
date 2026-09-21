@echo off
setlocal EnableExtensions
cd /d "%~dp0"
title STREAMS Overhaul Launcher

set "SONG=%~dp0assets\audio\streams_song.mp3"
set "SONGURL=https://static.wixstatic.com/mp3/85e419_7be9c7aa18ad4a6db00fd1af6ee7dbcd.mp3"

echo.
echo ==========================================
echo       STREAMS OVERHAUL - LOCAL BUILD
echo ==========================================
echo.

if not exist "%~dp0assets\audio" mkdir "%~dp0assets\audio" >nul 2>nul

if exist "%SONG%" goto SONG_READY

echo First launch: installing the original STREAMS soundtrack locally...
echo This is the same soundtrack URL used by the original game.
echo.

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$ProgressPreference='SilentlyContinue'; try { Invoke-WebRequest -UseBasicParsing -Uri '%SONGURL%' -OutFile '%SONG%'; if((Get-Item '%SONG%').Length -lt 100000){throw 'Downloaded file is too small'}; exit 0 } catch { Write-Host $_.Exception.Message -ForegroundColor Red; exit 1 }"

if errorlevel 1 goto SONG_FAILED

:SONG_READY
echo Soundtrack: READY - local file installed.
echo Launching STREAMS directly - no Python or local server required.
echo.
start "" "%~dp0index.html"
goto END

:SONG_FAILED
echo.
echo WARNING: The soundtrack could not be downloaded.
echo The game will still load and play, but without music.
echo Check your internet connection, then run this BAT again to install the song.
echo.
start "" "%~dp0index.html"

:END
echo You may close this window after the browser opens.
timeout /t 4 /nobreak >nul
endlocal
