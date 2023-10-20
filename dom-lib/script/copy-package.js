const copyFileToBuild = require('./../../js_script/copy-package')

const projName = 'dom-lib'
const sourceFile = `../${projName}/package.json`
const targetDir = `../${projName}/build`

copyFileToBuild(sourceFile, targetDir)
