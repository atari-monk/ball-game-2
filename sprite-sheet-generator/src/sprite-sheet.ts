import { generateSpriteSheet } from './api/sprite-sheet'
import { getListOfFiles } from './api/file-list'
import { sprites } from './data'

const frameWidth = 80
const frameHeight = 160
generateSpriteSheet(
  [getListOfFiles(sprites.idle_blue), getListOfFiles(sprites.walk_blue)],
  'C:/atari-monk/code/ball-game-2/client/assets/blue-player.png',
  frameWidth,
  frameHeight
)
generateSpriteSheet(
  [getListOfFiles(sprites.idle_red), getListOfFiles(sprites.walk_red)],
  'C:/atari-monk/code/ball-game-2/client/assets/red-player.png',
  frameWidth,
  frameHeight
)
generateSpriteSheet(
  [getListOfFiles(sprites.test1), getListOfFiles(sprites.test2)],
  'C:/atari-monk/code/ball-game-2/client/assets/test.png',
  frameWidth,
  frameHeight
)
