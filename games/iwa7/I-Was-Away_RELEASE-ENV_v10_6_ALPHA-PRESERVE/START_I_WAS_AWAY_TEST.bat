@echo off
setlocal
cd /d "%~dp0"
title I Was Away - Firefly Fresh Build V1
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0local_server.ps1"
endlocal
