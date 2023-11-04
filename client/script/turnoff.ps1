# turnoff.ps1

# Specify the path to the file you want to turn off --skip-worktree for
$filePath = (Resolve-Path "src\config\config.ts").Path

# Turn off --skip-worktree for the specified file
git update-index --skip-worktree $filePath
