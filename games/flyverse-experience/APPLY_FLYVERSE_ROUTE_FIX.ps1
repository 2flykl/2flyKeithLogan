$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$indexPath = Join-Path $repoRoot 'index.html'
$appPath = Join-Path $repoRoot 'js\app.js'
$old = 'games/2fly-universe/index.html'
$new = 'games/flyverse-experience/index.html'

if (-not (Test-Path $indexPath)) { throw "Could not find index.html next to this script. Put this script in the ROOT of the 2flyKeithLogan repo." }
if (-not (Test-Path $appPath)) { throw "Could not find js\app.js. Put this script in the ROOT of the 2flyKeithLogan repo." }

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

$index = [System.IO.File]::ReadAllText($indexPath)
$app = [System.IO.File]::ReadAllText($appPath)

$indexCount = ([regex]::Matches($index, [regex]::Escape($old))).Count
$appCount = ([regex]::Matches($app, [regex]::Escape($old))).Count

$index = $index.Replace($old, $new)
$app = $app.Replace($old, $new)

[System.IO.File]::WriteAllText($indexPath, $index, $utf8NoBom)
[System.IO.File]::WriteAllText($appPath, $app, $utf8NoBom)

Write-Host ''
Write-Host '2Fly Universe route update complete.' -ForegroundColor Green
Write-Host "index.html replacements: $indexCount"
Write-Host "js/app.js replacements: $appCount"
Write-Host ''
Write-Host 'New route:' -ForegroundColor Cyan
Write-Host $new
Write-Host ''

if ($indexCount -eq 0 -and $appCount -eq 0) {
  Write-Warning 'No old route references were found. The files may already be updated.'
}

Write-Host 'Open GitHub Desktop now. index.html and/or js/app.js should appear under Changes.'
Read-Host 'Press Enter to close'
