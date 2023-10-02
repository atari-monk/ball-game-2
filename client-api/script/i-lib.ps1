#run from npm run
#build phase
npm i
npm run build
Set-Location build
npm pack
#paths
$proj = "C:\atari-monk\Code\ball-game-2\"
$pack = "client-api-1.0.0.tgz"
$folder = "client-api\build\"
$api = $proj + $folder + $pack
#install in client
$client = $proj + "client\"
Copy-Item $api $client
Set-Location $client
npm i (Get-Item $pack).Name
#clean files
#Remove-Item $client-api
#Remove-Item ($client + $pack)
