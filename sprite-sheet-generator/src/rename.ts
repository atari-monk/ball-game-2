import { renameFilesInFolder } from './api/rename'
import { sprites } from './data'

renameFilesInFolder(sprites.character.idle_blue, 'idle')
renameFilesInFolder(sprites.character.walk_blue, 'walk')
renameFilesInFolder(sprites.character.idle_red, 'idle')
renameFilesInFolder(sprites.character.walk_red, 'walk')
renameFilesInFolder(sprites.character_test.idle_red, 'idle')
renameFilesInFolder(sprites.character_test.walk_red, 'walk')
