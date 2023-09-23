import * as Jimp from 'jimp' // You'll need to install the 'jimp' package
import { getListOfFiles } from './file-list'

export async function generateSpriteSheet(
  imagePathsArray: string[][],
  out: string
) {
  try {
    const frameWidth = 40 // Specify the width of each frame
    const frameHeight = 80 // Specify the height of each frame

    // Load images and resize them asynchronously
    const animationFrames: Jimp[][] = await Promise.all(
      imagePathsArray.map(async (imagePaths) => {
        const frames = await Promise.all(
          imagePaths.map(async (imagePath) => {
            const image = await Jimp.read(imagePath)
            return image.resize(frameWidth, frameHeight)
          })
        )
        return frames
      })
    )

    const numAnimations = animationFrames.length
    const maxFrames = Math.max(
      ...animationFrames.map((frames) => frames.length)
    )

    const spriteSheet = new Jimp(
      frameWidth * maxFrames, // Width of the sprite sheet
      frameHeight * numAnimations // Height of the sprite sheet
    )

    for (let i = 0; i < numAnimations; i++) {
      const frames = animationFrames[i]
      let x = 0
      for (const frame of frames) {
        spriteSheet.blit(frame, x, i * frameHeight)
        x += frameWidth
      }
    }

    // Save the generated sprite sheet image
    await spriteSheet.writeAsync(out)

    console.log('Sprite sheet generated successfully!')
  } catch (err) {
    console.error('Error generating sprite sheet:', err)
  }
}

const root = 'C:/atari-monk/pixel-art/character/'
const anims = {
  idle_blue: root + 'blue-idle',
  idle_red: root + 'red-idle',
  walk_blue: root + 'blue-walk',
  walk_red: root + 'red-walk',
  test1: root + 'test-1',
  test2: root + 'test-2',
}

generateSpriteSheet(
  [getListOfFiles(anims.idle_blue), getListOfFiles(anims.walk_blue)],
  'C:/atari-monk/code/ball-game-2/client/assets/blue-player.png'
)
generateSpriteSheet(
  [getListOfFiles(anims.idle_red), getListOfFiles(anims.walk_red)],
  'C:/atari-monk/code/ball-game-2/client/assets/red-player.png'
)
generateSpriteSheet(
  [getListOfFiles(anims.test1), getListOfFiles(anims.test2)],
  'C:/atari-monk/code/ball-game-2/client/assets/test.png'
)
