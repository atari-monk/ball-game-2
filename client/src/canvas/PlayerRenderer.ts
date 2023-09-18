import { PlayerDto } from 'api'
import { CanvasDrawer } from './CanvasDrawer'
import { SpriteAnimator } from '../sprite/SpriteAnimator'


export class PlayerRenderer {
  private sprite: SpriteAnimator
  constructor(private readonly canvasDrawer: CanvasDrawer) {
    this.sprite = new SpriteAnimator(
      './assets/sprite/FinnSprite.png',
      32,
      32,
      100,
      6
    )
  }

  update(deltaTime: number) {
    this.sprite.update(deltaTime)
  }

  draw(player: PlayerDto) {
    this.canvasDrawer.setFillStyle(player.team?.color ?? 'blue')
    this.canvasDrawer.drawCircle(player.x, player.y, player.radius)

    this.canvasDrawer.setLineStyle('yellow', 2)
    this.canvasDrawer.drawLine(
      player.x,
      player.y,
      player.directionX,
      player.directionY
    )

    this.sprite.draw(this.canvasDrawer.cctx, player.x, player.y)
  }
}
