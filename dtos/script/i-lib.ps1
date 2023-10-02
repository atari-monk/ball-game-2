#run from npm run
#build phase
npm i
npm run build
Set-Location build
npm pack
#paths
$proj = "C:\atari-monk\Code\ball-game-2\"
$pack = "dtos-1.0.0.tgz"
$folder = "dtos\build\"
$api = $proj + $folder + $pack
#install in game
$game = $proj + "game\"
Copy-Item $api $game
Set-Location $game
npm i (Get-Item $pack).Name
#install in server
$server = $proj + "server\"
Copy-Item $api $server
Set-Location $server
npm i (Get-Item $pack).Name
#install in client-api
$clientApi = $proj + "client-api\"
Copy-Item $api $clientApi
Set-Location $clientApi
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
