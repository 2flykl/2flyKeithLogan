@echo off
setlocal
cd /d "%~dp0"
set "IWA_NODE="
for /f "delims=" %%N in ('where node.exe 2^>nul') do if not defined IWA_NODE set "IWA_NODE=%%N"
if not defined IWA_NODE if exist "%ProgramFiles%\nodejs\node.exe" set "IWA_NODE=%ProgramFiles%\nodejs\node.exe"
if not defined IWA_NODE if exist "%~dp0node.exe" set "IWA_NODE=%~dp0node.exe"
if not defined IWA_NODE (
 echo Node.js was not found. Install Node.js 20 or newer, then reopen this launcher.
 pause
 exit /b 1
)
"%IWA_NODE%" "%~dp0tools\launch.mjs" %*
if errorlevel 1 (
 echo.
 echo The game could not start. Details are in launcher.log in this folder.
 pause
 exit /b 1
)
