#run from npm run
#build phase
npm i
npm run build
Set-Location build
npm pack
#paths
$proj = "C:\atari-monk\Code\ball-game-2\"
$pack = "api-1.0.0.tgz"
$folder = "api\build\"
$api = $proj + $folder + $pack
#install in server
$server = $proj + "server\"
Copy-Item $api $server
Set-Location $server
npm i (Get-Item $pack).Name
#install in client
$client = $proj + "client\"
Copy-Item $api $client
Set-Location $client
npm i (Get-Item $pack).Name
#clean files
#Remove-Item $api
#Remove-Item ($server + $pack)
#Remove-Item ($client + $pack)
