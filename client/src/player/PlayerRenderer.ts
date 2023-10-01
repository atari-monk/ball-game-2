import { CanvasDrawer } from '../canvas/CanvasDrawer'
import { AnimationConfig } from '../sprite/AnimationConfig'
import { SpriteAnimator } from '../sprite/SpriteAnimator'
import { PlayerModel } from './PlayerModel'

export class PlayerRenderer {
  private sprite: SpriteAnimator
  private isDirection: boolean = true

  constructor(
    private readonly canvasDrawer: CanvasDrawer,
    animations: AnimationConfig[]
  ) {
    this.sprite = new SpriteAnimator(animations)
  }

  update(deltaTime: number) {
    this.sprite.update(deltaTime)
  }

  draw(player: PlayerModel) {
    const p = player.moveDto
    if (!p) return
    this.sprite.draw(this.canvasDrawer.cctx, p.x - 41, p.y - 120)

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
