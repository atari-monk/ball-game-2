import { getListOfFiles } from './api/file-list'

console.log(
  'List of files in the directory:',
  getListOfFiles('C:/atari-monk/pixel-art/character/idle')
)
