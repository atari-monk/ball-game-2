import { PlayerDto } from 'api'
import { CanvasDrawer } from './CanvasDrawer'
import { SpriteAnimator } from '../sprite/SpriteAnimator'

export class PlayerRenderer {
  private sprite: SpriteAnimator
  constructor(private readonly canvasDrawer: CanvasDrawer) {
    this.sprite = new SpriteAnimator(
      './assets/player.png',
      40,
      80,
      80,
      8
    )
  }

  update(deltaTime: number) {
    this.sprite.update(deltaTime)
  }

  draw(player: PlayerDto) {
    this.sprite.draw(this.canvasDrawer.cctx, player.x -27, player.y -64)

    this.canvasDrawer.setLineStyle(player.team?.color ?? 'blue', 2)
    this.canvasDrawer.drawCircle(player.x, player.y, player.radius)

    this.canvasDrawer.setLineStyle('yellow', 2)
    this.canvasDrawer.drawLine(
      player.x,
      player.y,
      player.directionX,
      player.directionY
    )
  }
}
