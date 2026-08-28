@echo off
title BLACK AND GIFTED Museum RC
cd /d "%~dp0"

echo Starting BLACK AND GIFTED Museum RC on alternate port 8877...
echo.

start "BlackAndGiftedServer" /min py -m http.server 8877 --bind 127.0.0.1

timeout /t 2 /nobreak >nul

start "" "http://127.0.0.1:8877/"

echo Game launched.
timeout /t 2 /nobreak >nul
exit
