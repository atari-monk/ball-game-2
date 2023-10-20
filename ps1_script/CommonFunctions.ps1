$Global:RepoPath = "C:\atari-monk\Code\ball-game-2\"

function Build-Lib () {
  npm i
  npm run build
  Set-Location build
  npm pack  
}

function Copy-And-Install-Pack {
  param (
    [string]$packPath,
    [string]$projDir,
    [string]$packName
  )
  Copy-Item $packPath $projDir 
  Set-Location $projDir
  npm i (Get-Item $packName).Name
}