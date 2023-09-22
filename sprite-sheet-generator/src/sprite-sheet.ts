import * as Jimp from 'jimp' // You'll need to install the 'jimp' package
import { getListOfFiles } from './file-list'

const folderPath = 'C:/atari-monk/pixel-art/character/idle'
// Define the paths to your input images
const imagePaths: string[] = getListOfFiles(folderPath)

// Function to resize and stitch frames into a single row
export async function generateSpriteSheet() {
  try {
    const frameWidth = 40 // Specify the width of each frame
    const frameHeight = 80 // Specify the height of each frame

    const frames = await Promise.all(
      imagePaths.map(async (imagePath) => {
        const image = await Jimp.read(imagePath)
        return image.resize(frameWidth, frameHeight)
      })
    )

    const spriteSheet = new Jimp(
      frameWidth * imagePaths.length, // Width of the sprite sheet
      frameHeight // Height of the sprite sheet
    )

    let x = 0
    for (const frame of frames) {
      spriteSheet.blit(frame, x, 0)
      x += frameWidth
    }

    // Save the generated sprite sheet image
    await spriteSheet.writeAsync(
      'C:/atari-monk/code/ball-game-2/client/assets/player.png'
    )

    console.log('Sprite sheet generated successfully!')
  } catch (err) {
    console.error('Error generating sprite sheet:', err)
  }
}

// Call the function to generate the sprite sheet
generateSpriteSheet()
