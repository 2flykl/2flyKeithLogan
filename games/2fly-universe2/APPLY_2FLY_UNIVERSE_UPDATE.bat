@echo off
setlocal
cd /d "%~dp0"
echo.
echo =============================================
echo  2Fly Universe - Build Updated Experience
echo =============================================
echo.
call npm run typecheck
if errorlevel 1 goto :fail
call npm run build
if errorlevel 1 goto :fail
echo.
echo BUILD COMPLETE.
echo The updated production files are now in dist\
echo.
pause
exit /b 0
:fail
echo.
echo BUILD FAILED. No deployment was performed.
echo Copy the error text and send it to ChatGPT.
echo.
pause
exit /b 1
