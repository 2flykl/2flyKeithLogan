@echo off
setlocal
cd /d "%~dp0"
echo.
echo =============================================
echo  2Fly Universe - Phase 3 Clean Build
echo =============================================
echo.
if exist dist rmdir /s /q dist
call npm run typecheck
if errorlevel 1 goto :fail
call npm test
if errorlevel 1 goto :fail
call npm run build
if errorlevel 1 goto :fail
echo.
echo PHASE 3 BUILD COMPLETE.
echo Fresh output is in dist\
echo.
pause
exit /b 0
:fail
echo.
echo BUILD FAILED.
echo If this is a missing Rollup/Vite native module, run:
echo   rmdir /s /q node_modules
echo   npm install
echo   CLEAN_AND_BUILD_PHASE3.bat
pause
exit /b 1
