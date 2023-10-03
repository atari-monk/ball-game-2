$proj = "C:\atari-monk\Code\ball-game-2\"
$pack = "shared-api-1.0.0.tgz"
$folder = "shared-api\build\"
$api = $proj + $folder + $pack

npm i
npm run build
Set-Location build
npm pack

$clientApi = $proj + "client-api\"
Copy-Item $api $clientApi
Set-Location $clientApi
npm i (Get-Item $pack).Name

$client = $proj + "client\"
Copy-Item $api $client
Set-Location $client
npm i (Get-Item $pack).Name

$gameApi = $proj + "game-api\"
Copy-Item $api $gameApi
Set-Location $gameApi
npm i (Get-Item $pack).Name

$game = $proj + "game\"
Copy-Item $api $game
Set-Location $game
npm i (Get-Item $pack).Name

$server = $proj + "server\"
Copy-Item $api $server
Set-Location $server
npm i (Get-Item $pack).Name
