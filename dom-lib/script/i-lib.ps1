. "C:\atari-monk\Code\ball-game-2\ps1_script\CommonFunctions.ps1"

$libName = "dom-lib"
$build = $libName + "\build\"
$pack = $libName + "-1.0.0.tgz"
$lib = $RepoPath + $build + $pack
$targetProj1 = $RepoPath + "client\"
$targetProj2 = $RepoPath + "client-prototype-ui\"

Build-Lib
Copy-And-Install-Pack -packPath $lib -projDir $targetProj1 -packName $pack
Copy-And-Install-Pack -packPath $lib -projDir $targetProj2 -packName $pack
