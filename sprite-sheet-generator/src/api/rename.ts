import * as fs from 'fs'
import * as path from 'path'

export function renameFilesInFolder(folderPath: string, newName: string): void {
  try {
    const files = fs.readdirSync(folderPath)

    files.forEach((file, index) => {
      const ext = path.extname(file)
      const newFileName = `${newName}${index + 1}${ext}`
      const oldFilePath = path.join(folderPath, file)
      const newFilePath = path.join(folderPath, newFileName)

      fs.renameSync(oldFilePath, newFilePath)
      console.log(`Renamed "${file}" to "${newFileName}"`)
    })

    console.log('All files renamed successfully.')
  } catch (error) {
    console.error('Error renaming files:', error)
  }
}
