param([switch]$NoBrowser, [int]$Port=8088)
$ErrorActionPreference='Stop'
$universeRoot=[IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$universeListener=$null
foreach($candidate in $Port..($Port+20)) {
 try {$universeListener=[Net.Sockets.TcpListener]::new([Net.IPAddress]::Loopback,$candidate);$universeListener.Start();$Port=$candidate;break} catch { $universeListener=$null }
}
if(-not $universeListener){throw 'No available local port. Close an older universe server and retry.'}
$url="http://127.0.0.1:$Port/"
Write-Host "2FLY Universe: $url"
Write-Host 'Close this window to stop. No browser GPU settings are changed.'
if(-not $NoBrowser){Start-Process $url}
$mime=@{'.html'='text/html; charset=utf-8';'.js'='text/javascript; charset=utf-8';'.json'='application/json; charset=utf-8';'.css'='text/css; charset=utf-8';'.png'='image/png';'.jpg'='image/jpeg';'.svg'='image/svg+xml';'.mp3'='audio/mpeg';'.wav'='audio/wav'}
try {
 while($true){
  $client=$universeListener.AcceptTcpClient();$client.ReceiveTimeout=3000;$client.SendTimeout=10000
  try {
   $stream=$client.GetStream();$reader=[IO.StreamReader]::new($stream,[Text.Encoding]::ASCII,$false,1024,$true)
   $first=$reader.ReadLine();if(-not $first){continue}
   while($reader.ReadLine()){}
   $requestParts=$first.Split(' ');$rel=[Uri]::UnescapeDataString(($requestParts[1] -split '\?')[0]);if($rel -eq '/'){$rel='/index.html'}
   $file=[IO.Path]::GetFullPath((Join-Path $universeRoot $rel.TrimStart('/').Replace('/','\')))
   $status='200 OK';$type=$mime[[IO.Path]::GetExtension($file).ToLowerInvariant()];if(-not $type){$type='application/octet-stream'}
   if(-not $file.StartsWith($universeRoot+[IO.Path]::DirectorySeparatorChar,[StringComparison]::OrdinalIgnoreCase)){$status='403 Forbidden';$bytes=[Text.Encoding]::UTF8.GetBytes('Forbidden')}
   elseif(-not [IO.File]::Exists($file)){$status='404 Not Found';$bytes=[Text.Encoding]::UTF8.GetBytes('Not found')}
   else {$bytes=[IO.File]::ReadAllBytes($file)}
   $header=[Text.Encoding]::ASCII.GetBytes("HTTP/1.1 $status`r`nContent-Type: $type`r`nContent-Length: $($bytes.Length)`r`nCache-Control: no-cache`r`nConnection: close`r`n`r`n")
   $stream.Write($header,0,$header.Length);if($requestParts[0] -ne 'HEAD'){$stream.Write($bytes,0,$bytes.Length)};$stream.Flush()
  } catch {Write-Verbose $_} finally {$client.Close()}
 }
} finally {$universeListener.Stop()}
