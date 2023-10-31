import { generateSpriteSheet } from './api/sprite-sheet'
import { getListOfFiles } from './api/file-list'
import { sprites } from './data'

const frameWidth = 80
const frameHeight = 40
generateSpriteSheet(
  [getListOfFiles(sprites.ball.idle), getListOfFiles(sprites.ball.rotate)],
  'C:/atari-monk/pixel-art/ball/ball.png',
  frameWidth,
  frameHeight
)
