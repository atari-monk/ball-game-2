const fs = require('fs')
const path = require('path')

function copyFileToBuild(sourceFile, targetDir) {
  const scriptDir = __dirname
  const projectRootDir = path.resolve(scriptDir, '.')
  console.log('projectRootDir:', projectRootDir)
  const sourcePath = path.join(projectRootDir, sourceFile)
  const targetPath = path.join(
    projectRootDir,
    targetDir,
    path.basename(sourceFile)
  )

  if (!fs.existsSync(path.dirname(targetPath))) {
    fs.mkdirSync(path.dirname(targetPath), { recursive: true })
  }

  fs.copyFileSync(sourcePath, targetPath)

  console.log(`Copied ${sourcePath} to ${targetPath}`)
}

module.exports = copyFileToBuild
