#run from npm run
#build phase
npm i
npm run build
Set-Location build
npm pack
#paths
$proj = "C:\atari-monk\Code\ball-game-2\"
$pack = "shared-api-1.0.0.tgz"
$folder = "shared-api\build\"
$api = $proj + $folder + $pack
#install in client
$client = $proj + "client\"
Copy-Item $api $client
Set-Location $client
npm i (Get-Item $pack).Name
#install in server
$server = $proj + "server\"
Copy-Item $api $server
Set-Location $server
npm i (Get-Item $pack).Name
#clean files
#Remove-Item $shared-api
#Remove-Item ($client + $pack)
