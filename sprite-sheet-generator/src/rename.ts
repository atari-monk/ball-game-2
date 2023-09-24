import { renameFilesInFolder } from './api/rename'
import { sprites } from './data'

let name = 'idle'
renameFilesInFolder(sprites.idle_blue, name)
renameFilesInFolder(sprites.idle_red, name)
name = 'walk'
renameFilesInFolder(sprites.walk_blue, name)
renameFilesInFolder(sprites.walk_red, name)
name = 'test'
renameFilesInFolder(sprites.test1, name)
renameFilesInFolder(sprites.test2, name)
