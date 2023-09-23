import { AnimationConfig, AnimationType } from './AnimationConfig'
import { IAnimationFrame } from './IAnimationFrame'

export class SpriteAnimator {
  private image: HTMLImageElement
  private animations: IAnimationFrame[][]
  private currentAnimationIndex: number = 0
  private currentFrameIndex: number = 0
  private timeSinceLastFrame: number = 0
  private frameDurations: number[]
  private animationType: AnimationType
  private isForward: boolean = true

  constructor(private readonly animationConfigs: AnimationConfig[]) {
    this.image = new Image()
    this.image.src = animationConfigs[0].imagePath
    this.animationType = animationConfigs[0].animationType
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

  update(deltaTime: number) {
    switch (this.animationType) {
      case AnimationType.Cyclic:
        this.cyclic(deltaTime)
        break
      case AnimationType.Sequential:
        this.sequential(deltaTime)
        break
      default:
        break
    }
  }

  cyclic(deltaTime: number) {
    this.timeSinceLastFrame += deltaTime

    // Check if it's time to switch to the next frame
    if (
      this.timeSinceLastFrame >= this.frameDurations[this.currentAnimationIndex]
    ) {
      if (
        this.currentFrameIndex <
          this.animations[this.currentAnimationIndex].length - 1 &&
        this.isForward
      ) {
        this.currentFrameIndex++
      } else if (this.currentFrameIndex > 0 && !this.isForward) {
        this.currentFrameIndex--
      } else {
        // Change the direction when reaching the start or end of frames
        this.isForward = !this.isForward
      }
      this.timeSinceLastFrame = 0
    }
  }

  private sequential(deltaTime: number) {
    this.timeSinceLastFrame += deltaTime

    if (
      this.timeSinceLastFrame >= this.frameDurations[this.currentAnimationIndex]
    ) {
      if (
        this.currentFrameIndex <
        this.animations[this.currentAnimationIndex].length - 1
      ) {
        this.currentFrameIndex++
      } else {
        this.currentFrameIndex = 0
      }
      this.timeSinceLastFrame = 0
    }
  }

  switchAnimation(animationIndex: number) {
    if (animationIndex >= 0 && animationIndex < this.animations.length) {
      this.currentAnimationIndex = animationIndex
      this.currentFrameIndex = 0
      this.timeSinceLastFrame = 0

      const config = this.animationConfigs[animationIndex]
      this.image.src = config.imagePath
      this.animationType = config.animationType
    }
  }

  draw(ctx: CanvasRenderingContext2D, x: number, y: number) {
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
