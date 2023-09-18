import * as fs from 'fs'
import * as Jimp from 'jimp' // You'll need to install the 'jimp' package

// Define the paths to your input images
const imagePaths: string[] = [
  'assets/in/idle1.png',
  'assets/in/idle2.png',
  // Add more image paths as needed
]

// Function to resize and stitch frames into a single row
async function generateSpriteSheet() {
  try {
    const frameWidth = 25 // Specify the width of each frame
    const frameHeight = 53 // Specify the height of each frame

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
    await spriteSheet.writeAsync('assets/out/sprite.png')

    console.log('Sprite sheet generated successfully!')
  } catch (err) {
    console.error('Error generating sprite sheet:', err)
  }
}

// Call the function to generate the sprite sheet
generateSpriteSheet()
