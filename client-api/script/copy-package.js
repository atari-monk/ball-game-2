const copyFileToBuild = require('./../../js_script/copy-package')

const projName = 'client-api'
const sourceFile = `../${projName}/package.json`
const targetDir = `../${projName}/build`

copyFileToBuild(sourceFile, targetDir)
