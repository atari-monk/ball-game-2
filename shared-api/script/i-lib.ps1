. "C:\atari-monk\Code\ball-game-2\ps1_script\CommonFunctions.ps1"

$libName = "shared-api"
$build = $libName + "\build\"
$pack = $libName + "-1.0.0.tgz"
$lib = $RepoPath + $build + $pack
$targetProj1 = $RepoPath + "dtos\"
$targetProj2 = $RepoPath + "client-api\"
$targetProj3 = $RepoPath + "client\"
$targetProj4 = $RepoPath + "game-api\"
$targetProj5 = $RepoPath + "game\"
$targetProj6 = $RepoPath + "server\"

Build-Lib
Copy-And-Install-Pack -packPath $lib -projDir $targetProj1 -packName $pack
Copy-And-Install-Pack -packPath $lib -projDir $targetProj2 -packName $pack
Copy-And-Install-Pack -packPath $lib -projDir $targetProj3 -packName $pack
Copy-And-Install-Pack -packPath $lib -projDir $targetProj4 -packName $pack
Copy-And-Install-Pack -packPath $lib -projDir $targetProj5 -packName $pack
Copy-And-Install-Pack -packPath $lib -projDir $targetProj6 -packName $pack
