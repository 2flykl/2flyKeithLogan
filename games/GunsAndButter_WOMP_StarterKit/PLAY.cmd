@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
 echo Install Node.js LTS, then run PLAY.cmd again.
 echo Alternatively serve this folder using any static HTTP server.
 pause
 exit /b 1
)
start "" http://localhost:4173
echo Keep this window open while playing. Close it to stop the server.
node tools\serve.mjs
pause
