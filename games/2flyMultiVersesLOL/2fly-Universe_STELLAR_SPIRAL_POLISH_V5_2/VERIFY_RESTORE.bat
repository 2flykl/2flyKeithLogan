@echo off
setlocal
cd /d "%~dp0"
echo Checking required full 3D runtime files...
set FAIL=0
for %%F in (
  "index.html"
  "launcher-v23.js"
  "app-v23\universe-shell.js"
  "app-v23\camera.js"
  "app-v23\scene\galaxy.js"
  "app-v23\scene\streams-system.js"
  "app-v23\scene\thru-the-fire-system.js"
  "app-v23\scene\africa-system.js"
  "app-v23\scene\decorated-object.js"
  "app-v23\scene\star-layer.js"
  "assets\three.module.js"
  "assets\galaxies\galaxy_2025_2029.png"
  "data\seed_universe.json"
) do (
  if not exist %%F (
    echo MISSING: %%F
    set FAIL=1
  )
)
if "%FAIL%"=="0" (
  echo.
  echo PASS: Full 3D runtime structure is present.
) else (
  echo.
  echo FAIL: One or more required files are missing.
)
pause
