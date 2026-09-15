$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path

function Get-MimeType([string]$path) {
    switch ([IO.Path]::GetExtension($path).ToLowerInvariant()) {
        '.html' { 'text/html; charset=utf-8' }
        '.js'   { 'text/javascript; charset=utf-8' }
        '.css'  { 'text/css; charset=utf-8' }
        '.json' { 'application/json; charset=utf-8' }
        '.mp3'  { 'audio/mpeg' }
        '.wav'  { 'audio/wav' }
        '.png'  { 'image/png' }
        '.jpg'  { 'image/jpeg' }
        '.jpeg' { 'image/jpeg' }
        '.webp' { 'image/webp' }
        '.svg'  { 'image/svg+xml' }
        '.ico'  { 'image/x-icon' }
        default { 'application/octet-stream' }
    }
}

$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, 0)
$listener.Start()
$port = ([System.Net.IPEndPoint]$listener.LocalEndpoint).Port
$url = "http://127.0.0.1:$port/"
Write-Host '==================================================' -ForegroundColor Cyan
Write-Host ' I WAS AWAY - FIREFLY FRESH BUILD V1' -ForegroundColor White
Write-Host '==================================================' -ForegroundColor Cyan
Write-Host ''
Write-Host "Test server: $url" -ForegroundColor Green
Write-Host 'Your browser should open automatically.'
Write-Host 'Keep this window open while you play.'
Write-Host 'Press CTRL+C here when you are finished.' -ForegroundColor Yellow
Write-Host ''
Start-Process $url

try {
    while ($true) {
        $client = $listener.AcceptTcpClient()
        try {
            $stream = $client.GetStream()
            $reader = New-Object System.IO.StreamReader($stream, [Text.Encoding]::ASCII, $false, 4096, $true)
            $requestLine = $reader.ReadLine()
            if ([string]::IsNullOrWhiteSpace($requestLine)) { $client.Close(); continue }

            while ($true) {
                $line = $reader.ReadLine()
                if ($null -eq $line -or $line -eq '') { break }
            }

            $parts = $requestLine.Split(' ')
            $method = $parts[0]
            $rawPath = if ($parts.Count -gt 1) { $parts[1] } else { '/' }
            $rawPath = $rawPath.Split('?')[0]
            $decoded = [Uri]::UnescapeDataString($rawPath)
            if ($decoded -eq '/') { $decoded = '/index.html' }
            $relative = $decoded.TrimStart('/').Replace('/', [IO.Path]::DirectorySeparatorChar)
            $filePath = [IO.Path]::GetFullPath((Join-Path $root $relative))
            $rootFull = [IO.Path]::GetFullPath($root + [IO.Path]::DirectorySeparatorChar)

            if (-not $filePath.StartsWith($rootFull, [StringComparison]::OrdinalIgnoreCase) -or -not (Test-Path -LiteralPath $filePath -PathType Leaf)) {
                $body = [Text.Encoding]::UTF8.GetBytes('404 - File not found')
                $header = "HTTP/1.1 404 Not Found`r`nContent-Type: text/plain; charset=utf-8`r`nContent-Length: $($body.Length)`r`nConnection: close`r`n`r`n"
            } else {
                $body = [IO.File]::ReadAllBytes($filePath)
                $mime = Get-MimeType $filePath
                $header = "HTTP/1.1 200 OK`r`nContent-Type: $mime`r`nContent-Length: $($body.Length)`r`nCache-Control: no-cache, no-store, must-revalidate`r`nAccess-Control-Allow-Origin: *`r`nConnection: close`r`n`r`n"
            }

            $headerBytes = [Text.Encoding]::ASCII.GetBytes($header)
            $stream.Write($headerBytes, 0, $headerBytes.Length)
            if ($method -ne 'HEAD') { $stream.Write($body, 0, $body.Length) }
            $stream.Flush()
        } catch {
        } finally {
            $client.Close()
        }
    }
} finally {
    $listener.Stop()
}
