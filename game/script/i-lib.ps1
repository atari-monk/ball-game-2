#run from npm run
#build phase
npm i
npm run build
Set-Location build
npm pack
#paths
$proj = "C:\atari-monk\Code\ball-game-2\"
$pack = "game-1.0.0.tgz"
$folder = "game\build\"
$api = $proj + $folder + $pack
#install in server
$server = $proj + "server\"
Copy-Item $api $server
Set-Location $server
npm i (Get-Item $pack).Name
