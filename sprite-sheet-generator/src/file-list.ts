import * as fs from 'fs'
import * as path from 'path'

export function getListOfFiles(folderPath: string): string[] {
  try {
    const files = fs.readdirSync(folderPath)

    // Filter out directories (if needed)
    const fileList = files
      .map((file) => path.join(folderPath, file))
      .filter((file) => fs.statSync(file).isFile())

    return fileList
  } catch (error) {
    console.error('Error reading directory:', error)
    return []
  }
}

//const folderPath = 'C:/atari-monk/pixel-art/character/idle' // Replace with your folder path
//const filesList = getListOfFiles(folderPath)
//console.log('List of files in the directory:', filesList)
