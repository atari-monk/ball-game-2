import { PlayerDto } from 'api'
import { CanvasDrawer } from './CanvasDrawer'

export class PlayerRenderer {
  constructor(private readonly canvasDrawer: CanvasDrawer) {}

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
  }
}
