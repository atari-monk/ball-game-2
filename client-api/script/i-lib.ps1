. "C:\atari-monk\Code\ball-game-2\ps1\CommonFunctions.ps1"

$libName = "client-api"
$build = $libName + "\build\"
$pack = $libName + "-1.0.0.tgz"
$lib = $RepoPath + $build + $pack
$targetProj1 = $RepoPath + "client\"

Build-Lib
Copy-And-Install-Pack -packPath $lib -projDir $targetProj1 -packName $pack
