import { IAnimationFrame } from './IAnimationFrame'

export class SpriteAnimator {
  private image: HTMLImageElement
  private frames: IAnimationFrame[]
  private currentFrameIndex: number = 0
  private frameDuration: number
  private timeSinceLastFrame: number = 0

  constructor(
    imagePath: string,
    frameWidth: number,
    frameHeight: number,
    frameDuration: number,
    frameCount: number
  ) {
    this.image = new Image()
    this.image.src = imagePath

    // Calculate and store animation frames
    this.frames = []
    for (let i = 0; i < frameCount; i++) {
      const frameX = i * frameWidth
      const frameY = 0 // Assuming all frames are in the same row
      this.frames.push({ frameX, frameY, frameWidth, frameHeight })
    }

    this.frameDuration = frameDuration
  }

  update(deltaTime: number) {
    this.timeSinceLastFrame += deltaTime

    // Check if it's time to switch to the next frame
    if (this.timeSinceLastFrame >= this.frameDuration) {
      this.currentFrameIndex = (this.currentFrameIndex + 1) % this.frames.length
      this.timeSinceLastFrame = 0
    }
  }

  draw(ctx: CanvasRenderingContext2D, x: number, y: number) {
    const currentFrame = this.frames[this.currentFrameIndex]
    ctx.drawImage(
      this.image,
      currentFrame.frameX,
      currentFrame.frameY,
      currentFrame.frameWidth,
      currentFrame.frameHeight,
      x,
      y,
      currentFrame.frameWidth,
      currentFrame.frameHeight
    )
  }
}
