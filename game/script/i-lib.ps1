. "C:\atari-monk\Code\ball-game-2\ps1_script\CommonFunctions.ps1"

$libName = "game"
$build = "$libName\build\"
$pack = "$libName-1.0.0.tgz"
$lib = $RepoPath + $build + $pack

$targetProjects = @(
  "$RepoPath\server\"
)

Build-Lib
foreach ($targetProj in $targetProjects) {
  Copy-And-Install-Pack -packPath $lib -projDir $targetProj -packName $pack
}
