import { generateSpriteSheet } from './api/sprite-sheet'
import { getListOfFiles } from './api/file-list'
import { sprites } from './data'

const frameWidth = 80
const frameHeight = 160
generateSpriteSheet(
  [
    getListOfFiles(sprites.character.idle_red),
    getListOfFiles(sprites.character.walk_red),
  ],
  'C:/atari-monk/pixel-art/character/red-player.png',
  frameWidth,
  frameHeight
)
generateSpriteSheet(
  [
    getListOfFiles(sprites.character.idle_blue),
    getListOfFiles(sprites.character.walk_blue),
  ],
  'C:/atari-monk/pixel-art/character/blue-player.png',
  frameWidth,
  frameHeight
)
generateSpriteSheet(
  [
    getListOfFiles(sprites.character_test.idle_red),
    getListOfFiles(sprites.character_test.walk_red),
  ],
  'C:/atari-monk/pixel-art/character-test/red-player.png',
  frameWidth,
  frameHeight
)
