import * as Jimp from 'jimp'

function naturalSort(array: string[]): string[] {
  return array.sort((a, b) => {
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
  })
}

export async function generateSpriteSheet(
  imagePathsArray: string[][],
  out: string,
  frameWidth: number,
  frameHeight: number
) {
  try {
    const animationFrames: Jimp[][] = await Promise.all(
      imagePathsArray.map(async (imagePaths) => {
        const sortedImagePaths = naturalSort(imagePaths) // Sort imagePaths naturally
        const frames = await Promise.all(
          sortedImagePaths.map(async (imagePath) => {
            console.log('imagePath:', imagePath)
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
      frameWidth * maxFrames,
      frameHeight * numAnimations
    )

    for (let i = 0; i < numAnimations; i++) {
      const frames = animationFrames[i]
      let x = 0
      for (const frame of frames) {
        spriteSheet.blit(frame, x, i * frameHeight)
        x += frameWidth
      }
    }

    await spriteSheet.writeAsync(out)

    console.log('Sprite sheet generated successfully!')
  } catch (err) {
    console.error('Error generating sprite sheet:', err)
  }
}
