$script = 'C:\atari-monk\Code\ball-game-2\client\script'
$server = 'C:\atari-monk\Code\ball-game-2\server\build\'

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
  set-folder ($server)
  start-server
  set-folder ($script)
}
catch {
  Write-Host "An error occurred in the script execution."
}
