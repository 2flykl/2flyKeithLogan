@echo off
setlocal
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0APPLY_FLYVERSE_ROUTE_FIX.ps1"
endlocal
