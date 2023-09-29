const fs = require('fs')
const path = require('path')

//relative to script folder
const sourceFile = '../package.json'
const targetDir = '../build'

// Get the absolute paths
const scriptDir = __dirname
const projectRootDir = path.resolve(scriptDir, '.')
const sourcePath = path.join(projectRootDir, sourceFile)
const targetPath = path.join(
  projectRootDir,
  targetDir,
  path.basename(sourceFile)
)

// Ensure the build directory exists
if (!fs.existsSync(path.dirname(targetPath))) {
  fs.mkdirSync(path.dirname(targetPath), { recursive: true })
}

// Copy package.json to the build directory
fs.copyFileSync(sourcePath, targetPath)

console.log(`Copied ${sourcePath} to ${targetPath}`)
