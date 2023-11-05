$clientPath = "C:\atari-monk\code\notes\notes_client\build\index.html"
$readerPath = "C:\atari-monk\code\notes\notes_reader\build\index.html"
$serverPath = "C:\atari-monk\code\notes\notes_server\build\server.js"

if (Test-Path $clientPath -PathType Leaf) {
    Start-Process $clientPath
} else {
    Write-Host "The client file does not exist: $clientPath"
}

if (Test-Path $readerPath -PathType Leaf) {
    Start-Process $readerPath
} else {
    Write-Host "The reader file does not exist: $readerPath"
}

if (Test-Path $serverPath -PathType Leaf) {
    Start-Process node $serverPath
} else {
    Write-Host "The server file does not exist: $serverPath"
}
