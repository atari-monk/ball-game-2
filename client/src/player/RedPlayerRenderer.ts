import { CanvasDrawer } from '../canvas/CanvasDrawer'
import { SpriteAnimator } from '../sprite/SpriteAnimator'
import { AnimationConfig, AnimationType } from '../sprite/AnimationConfig'
import { PlayerModel } from './PlayerModel'

export class RedPlayerRenderer {
  private sprite: SpriteAnimator
  private isDirection: boolean = true
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

  draw(player: PlayerModel) {
    const p = player.moveDto
    this.sprite.draw(this.canvasDrawer.cctx, p.x - 41, p.y - 120)

    console.log('player.teamColor:', player.teamColor)
    console.log('player.radius:', player.radius)
    this.canvasDrawer.setLineStyle(player.teamColor, 1)
    this.canvasDrawer.drawCircle(p.x, p.y, player.radius)

    if (!this.isDirection) return
    this.canvasDrawer.setLineStyle('yellow', 1)
    this.canvasDrawer.drawLine(p.x, p.y, p.directionX, p.directionY)
  }

  switchAnimation(animationIndex: number) {
    this.sprite.switchAnimation(animationIndex)
  }
}
