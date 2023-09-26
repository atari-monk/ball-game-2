import { PlayerDto } from 'api'
import { CanvasDrawer } from '../canvas/CanvasDrawer'
import { SpriteAnimator } from '../sprite/SpriteAnimator'
import { AnimationConfig, AnimationType } from '../sprite/AnimationConfig'

export class RedPlayerRenderer {
  private sprite: SpriteAnimator
  constructor(private readonly canvasDrawer: CanvasDrawer) {
    const sprite = './assets/red-player.png'
    const idle: AnimationConfig = {
      imagePath: sprite,
      frameCount: 20,
      frameDuration: 100,
      frameWidth: 80,
      frameHeight: 160,
      animationType: AnimationType.Sequential,
    }
    const walk: AnimationConfig = {
      imagePath: sprite,
      frameCount: 17,
      frameDuration: 100,
      frameWidth: 80,
      frameHeight: 160,
      animationType: AnimationType.Sequential,
    }
    this.sprite = new SpriteAnimator([idle, walk])
  }

  update(deltaTime: number) {
    this.sprite.update(deltaTime)
  }

  draw(player: PlayerDto) {
    this.sprite.draw(this.canvasDrawer.cctx, player.x - 41, player.y - 120)

    this.canvasDrawer.setLineStyle(player.team?.color ?? 'blue', 1)
    this.canvasDrawer.drawCircle(player.x, player.y, player.radius)

    this.canvasDrawer.setLineStyle('yellow', 1)
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
