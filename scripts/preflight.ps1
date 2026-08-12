$ErrorActionPreference = "Continue"
Write-Host "=== 2flyKeithLogan Antigravity Preflight ==="

function Test-Command($name) {
    $cmd = Get-Command $name -ErrorAction SilentlyContinue
    if ($cmd) { Write-Host "[OK] $name -> $($cmd.Source)" }
    else { Write-Host "[MISSING] $name" }
}

Write-Host "Working directory: $(Get-Location)"
Test-Command git
Test-Command node
Test-Command npm
Test-Command npx
Test-Command python

Write-Host "`n=== Git ==="
git rev-parse --show-toplevel 2>$null
git branch --show-current 2>$null
git status --short 2>$null

Write-Host "`n=== Likely project entry files ==="
Get-ChildItem -Force -Name package.json,index.html,vite.config.*,next.config.*,webpack.config.* -ErrorAction SilentlyContinue

Write-Host "`n=== Game folders (if present) ==="
if (Test-Path ".\games") {
    Get-ChildItem ".\games" -Directory | Select-Object -ExpandProperty Name
} else {
    Write-Host "[INFO] No .\games folder at current path."
}

Write-Host "`nNever commit: OAuth secrets, API keys, cookies, tokens, private .env files."
