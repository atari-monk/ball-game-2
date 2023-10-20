const copyFileToBuild = require('./../../js_script/copy-package')

const projName = 'shared-api'
const sourceFile = `../${projName}/package.json`
const targetDir = `../${projName}/build`

copyFileToBuild(sourceFile, targetDir)
