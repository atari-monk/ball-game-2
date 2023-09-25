$script = 'C:\atari-monk\Code\ball-game-2\client\script'
$server = 'C:\atari-monk\Code\ball-game-2\server\build\'
$port = '3000'
$domain = 'http://127.0.0.1:' 
$client = '/client/build/index.html'
$url1 = $domain + $port + $client
$url2 = $domain + $port + $client
$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"

function start-chrome {
    param(
        [Parameter(Mandatory = $true)]
        [string]$url
    )

    try {
        Start-Process -FilePath "chrome.exe" -ArgumentList $url -ErrorAction Stop
    }
    catch {
        Write-Host "An error occurred while trying to start Chrome with URL: $url"
        return $null
    }
}

function set-folder($folder) {
  try {
    Set-Location -Path $folder -ErrorAction Stop
  }
  catch {
    Write-Host "An error occurred while setting the folder: $folder"
  }
}

function start-server {
  try {
    ndb .\server.js
  }
  catch {
    Write-Host "An error occurred while starting the server."
  }
}

try {
  start-chrome -url $url1
  start-chrome -url $url2
  set-folder ($server)
  start-server
  set-folder ($script)
}
catch {
  Write-Host "An error occurred in the script execution."
}
