# bringback.ps1

# Specify the path to the file you want to bring back --skip-worktree for
$filePath = (Resolve-Path "src\config\config.ts").Path

# Bring back --skip-worktree for the specified file
git update-index --no-skip-worktree $filePath
