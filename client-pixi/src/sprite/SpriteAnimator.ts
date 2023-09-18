import * as PIXI from 'pixi.js'

export class SpriteAnimator {
  private sprite: PIXI.Sprite
  private frames: PIXI.Texture[]
  private currentFrameIndex: number = 0
  private frameDuration: number
  private timeSinceLastFrame: number = 0

  constructor(texturePaths: string[], frameDuration: number) {
    // Load textures from paths
    this.frames = texturePaths.map((path) => PIXI.Texture.from(path))
    this.sprite = new PIXI.Sprite(this.frames[0])

    this.frameDuration = frameDuration
  }

  update(deltaTime: number) {
    this.timeSinceLastFrame += deltaTime

    // Check if it's time to switch to the next frame
    if (this.timeSinceLastFrame >= this.frameDuration) {
      this.currentFrameIndex = (this.currentFrameIndex + 1) % this.frames.length
      this.sprite.texture = this.frames[this.currentFrameIndex]
      this.timeSinceLastFrame = 0
    }
  }

  getSprite(): PIXI.Sprite {
    return this.sprite
  }
}
