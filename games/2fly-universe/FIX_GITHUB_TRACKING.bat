@echo off
setlocal
cd /d "%~dp0"

for /f "delims=" %%I in ('git rev-parse --show-toplevel 2^>nul') do set "REPOROOT=%%I"
if not defined REPOROOT (
  echo.
  echo ERROR: This folder is not inside your Git repository.
  echo Paste this 2fly-universe folder into:
  echo games\2fly-universe\
  echo inside your 2flyKeithLogan repo, then run this file again.
  echo.
  pause
  exit /b 1
)

cd /d "%REPOROOT%"
echo.
echo Repo: %REPOROOT%
echo Fixing Git tracking so runtime files are committed under lowercase path...
echo.

REM Remove any currently tracked spelling of the Universe folder from the Git index only.
REM Your working files remain on disk.
git rm -r --cached --ignore-unmatch "games/2fly-universe" >nul 2>&1
git rm -r --cached --ignore-unmatch "games/2fly-Universe" >nul 2>&1
git rm -r --cached --ignore-unmatch "games/2Fly-Universe" >nul 2>&1

REM Re-add the actual folder using the canonical lowercase spelling.
git add -A -- "games/2fly-universe"

echo.
echo ------------------------------------------------------------
echo EXPECTED RESULT:
echo GitHub Desktop should now show changes under:
echo   games/2fly-universe/runtime/
echo especially:
echo   games/2fly-universe/runtime/main.js
echo   games/2fly-universe/runtime/vendor/three.module.js
echo ------------------------------------------------------------
echo.
git status --short -- "games/2fly-universe"
echo.
echo Now return to GitHub Desktop, commit, and push.
echo.
pause
