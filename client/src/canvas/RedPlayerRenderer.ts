import { PlayerDto } from 'api'
import { CanvasDrawer } from './CanvasDrawer'
import { SpriteAnimator } from '../sprite/SpriteAnimator'
import { AnimationConfig, AnimationType } from '../sprite/AnimationConfig'

export class RedPlayerRenderer {
  private sprite: SpriteAnimator
  constructor(private readonly canvasDrawer: CanvasDrawer) {
    const sprite = './assets/red-player.png'
    const idle: AnimationConfig = {
      imagePath: sprite,
      frameCount: 13,
      frameDuration: 100,
      frameWidth: 40,
      frameHeight: 80,
      animationType: AnimationType.Sequential,
    }
    const walk: AnimationConfig = {
      imagePath: sprite,
      frameCount: 16,
      frameDuration: 100,
      frameWidth: 40,
      frameHeight: 80,
      animationType: AnimationType.Sequential,
    }
    this.sprite = new SpriteAnimator([idle, walk])
    // const test1: AnimationConfig = {
    //   imagePath: './assets/test.png',
    //   frameCount: 6,
    //   frameDuration: 1000,
    //   frameWidth: 40,
    //   frameHeight: 80,
    //   animationType: AnimationType.Sequential,
    // }
    // const test2: AnimationConfig = {
    //   imagePath: './assets/test.png',
    //   frameCount: 7,
    //   frameDuration: 500,
    //   frameWidth: 40,
    //   frameHeight: 80,
    //   animationType: AnimationType.Cyclic,
    // }
    // this.sprite = new SpriteAnimator([test1, test2])
  }

  update(deltaTime: number) {
    this.sprite.update(deltaTime)
  }

  draw(player: PlayerDto) {
    this.sprite.draw(this.canvasDrawer.cctx, player.x - 27, player.y - 64)

    // this.canvasDrawer.setLineStyle(player.team?.color ?? 'blue', 2)
    // this.canvasDrawer.drawCircle(player.x, player.y, player.radius)

    this.canvasDrawer.setLineStyle('yellow', 2)
    this.canvasDrawer.drawLine(
      player.x,
      player.y,
      player.directionX,
      player.directionY
    )
  }

  switchAnimation(animationIndex: number) {
    this.sprite.switchAnimation(animationIndex)
  }
}
