import { AnimationConfig } from './AnimationConfig'
import { IAnimationFrame } from './IAnimationFrame'

export class SpriteAnimator {
  private image: HTMLImageElement
  private animations: IAnimationFrame[][]
  private currentAnimationIndex: number = 0
  private currentFrameIndex: number = 0
  private timeSinceLastFrame: number = 0
  private frameDurations: number[]

  constructor(private readonly animationConfigs: AnimationConfig[]) {
    this.image = new Image()
    this.image.src = animationConfigs[0].imagePath
    this.animations = animationConfigs.map((config, index) =>
      this.createAnimationFrames(config, index)
    )
    this.frameDurations = animationConfigs.map((config) => config.frameDuration)
  }

  private createAnimationFrames(
    config: AnimationConfig,
    animIndex: number
  ): IAnimationFrame[] {
    const frames: IAnimationFrame[] = []
    for (let i = 0; i < config.frameCount; i++) {
      const frameX = i * config.frameWidth
      const frameY = animIndex * config.frameHeight
      frames.push({
        frameX,
        frameY,
        frameWidth: config.frameWidth,
        frameHeight: config.frameHeight,
      })
    }
    return frames
  }

  update(
    deltaTime: number //, log: boolean = false
  ) {
    this.timeSinceLastFrame += deltaTime

    // Check if it's time to switch to the next frame
    if (
      this.timeSinceLastFrame >= this.frameDurations[this.currentAnimationIndex]
    ) {
      if (
        this.currentFrameIndex <
        this.animations[this.currentAnimationIndex].length - 1
      ) {
        this.currentFrameIndex++
      } else {
        this.currentFrameIndex = 0 // Reset to the first frame if it's the last frame
      }
      this.timeSinceLastFrame = 0
    }
    //if (log)
    //  console.log(`anim ${this.currentAnimationIndex}:`, this.currentFrameIndex)
  }

  switchAnimation(animationIndex: number) {
    if (animationIndex >= 0 && animationIndex < this.animations.length) {
      this.currentAnimationIndex = animationIndex
      this.currentFrameIndex = 0
      this.timeSinceLastFrame = 0

      this.image.src = this.animationConfigs[animationIndex].imagePath
    }
  }

  draw(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number
    //log: boolean = false
  ) {
    //if (log)
    //  console.log(`anim ${this.currentAnimationIndex}:`, this.currentFrameIndex)
    const currentFrame =
      this.animations[this.currentAnimationIndex][this.currentFrameIndex]
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
