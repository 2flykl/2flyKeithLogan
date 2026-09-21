@echo off
setlocal
cd /d "%~dp0"
set PORT=8080

echo.
echo =====================================================
echo   2FLY UNIVERSE - FULL 3D PRE-STRIP RESTORE

echo   Opening http://127.0.0.1:%PORT%/
echo =====================================================
echo.

where py >nul 2>&1
if %errorlevel%==0 goto PY
where python >nul 2>&1
if %errorlevel%==0 goto PYTHON
where node >nul 2>&1
if %errorlevel%==0 goto NODE

echo Python or Node.js is required to run the local test server.
echo Install Python 3 or Node.js, then run this file again.
pause
exit /b 1

:PY
start "2Fly Universe Full 3D" "http://127.0.0.1:%PORT%/"
py -m http.server %PORT% --bind 127.0.0.1
exit /b 0

:PYTHON
start "2Fly Universe Full 3D" "http://127.0.0.1:%PORT%/"
python -m http.server %PORT% --bind 127.0.0.1
exit /b 0

:NODE
start "2Fly Universe Full 3D" "http://127.0.0.1:%PORT%/"
node tools\local-server.js
exit /b 0
