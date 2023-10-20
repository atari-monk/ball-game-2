. "C:\atari-monk\Code\ball-game-2\ps1_script\CommonFunctions.ps1"

$libName = "dtos"
$build = $libName + "\build\"
$pack = $libName + "-1.0.0.tgz"
$lib = $RepoPath + $build + $pack
$targetProj1 = $RepoPath + "game\"
$targetProj2 = $RepoPath + "server\"
$targetProj3 = $RepoPath + "client-api\"
$targetProj4 = $RepoPath + "client\"

Build-Lib
Copy-And-Install-Pack -packPath $lib -projDir $targetProj1 -packName $pack
Copy-And-Install-Pack -packPath $lib -projDir $targetProj2 -packName $pack
Copy-And-Install-Pack -packPath $lib -projDir $targetProj3 -packName $pack
Copy-And-Install-Pack -packPath $lib -projDir $targetProj4 -packName $pack
