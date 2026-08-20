@echo off
setlocal
set "EXPECTED=flyverse-experience"
for %%I in ("%CD%") do set "CURRENT=%%~nxI"
echo.
echo ==========================================
echo  2Fly Universe Canonical Folder Check
 echo ==========================================
echo.
echo Current folder: %CD%
echo.
if /I not "%CURRENT%"=="%EXPECTED%" (
  echo FAIL: This folder must be named exactly:
  echo flyverse-experience
  echo.
  echo Final path must be:
  echo C:\Users\2flyk\Documents\GitHub\2flyKeithLogan\games\flyverse-experience\
  pause
  exit /b 1
)
if not exist "index.html" goto missing
if not exist "scripts\flyverse-app.js" goto missing
if not exist "scripts\flyverse-data.js" goto missing
if not exist "scripts\flyverse-engine.js" goto missing
if not exist "scripts\flyverse-ui.js" goto missing
if not exist "styles\flyverse.css" goto missing
if not exist "visuals\galaxy_asset_sheet.png" goto missing
if not exist "visuals\world_asset_sheet.png" goto missing
if not exist "visuals\universe_hud_assets.png" goto missing
if not exist "visuals\neon_cosmic_asset_atlas.png" goto missing

echo PASS: This is the correct 2Fly Universe folder.
echo You can commit/push this folder as-is.
pause
exit /b 0

:missing
echo FAIL: One or more required Universe files are missing.
echo Replace this folder with the complete canonical package.
pause
exit /b 1
