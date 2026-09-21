@echo off
setlocal
cd /d "%~dp0"
echo Starting 2FLY Universe - Living Constellation...
echo Keep this window open. Close it to stop the local server.
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\launch-universe.ps1"
if errorlevel 1 pause
