@echo off
setlocal
cd /d "%~dp0"
call "%~dp0PLAY.cmd" --gpu-safe %*
exit /b %errorlevel%
