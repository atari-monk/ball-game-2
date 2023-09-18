import { FieldDto, IGateDtos, PlayerDto, BallDto } from 'api'
import { CanvasInfoProvider } from './CanvasInfoProvider'
import { CanvasDrawer } from './CanvasDrawer'

export class CanvasRenderer {
  private ctx: CanvasRenderingContext2D
  private canvasDrawer: CanvasDrawer

  constructor() {
    const canvasInfoProvider = new CanvasInfoProvider()
    const canvasInfo = canvasInfoProvider.getCanvasInfo('canvas')
    this.ctx = canvasInfo.ctx
    this.canvasDrawer = new CanvasDrawer(this.ctx)
  }

  clearCanvas() {
    this.canvasDrawer.clearCanvas()
  }

  drawField(field: FieldDto) {
    this.canvasDrawer.setFillStyle('green')
    this.canvasDrawer.drawRectangle(0, 0, field.width, field.height)
  }

  drawGates(gates: IGateDtos) {
    this.canvasDrawer.setFillStyle(gates.left.team.color)
    this.canvasDrawer.drawRectangle(
      gates.left.x,
      gates.left.y,
      gates.left.width,
      gates.left.height
    )

    this.canvasDrawer.setFillStyle(gates.right.team.color)
    this.canvasDrawer.drawRectangle(
      gates.right.x,
      gates.right.y,
      gates.right.width,
      gates.right.height
    )
  }

  drawPlayer(player: PlayerDto) {
    this.canvasDrawer.setFillStyle(player.team?.color ?? 'blue')
    this.ctx.strokeStyle = 'yellow'
    this.ctx.lineWidth = 2

    this.canvasDrawer.drawCircle(player.x, player.y, player.radius)

    const directionX = player.x + player.radius * Math.cos(player.direction)
    const directionY = player.y + player.radius * Math.sin(player.direction)
    this.canvasDrawer.drawLine(player.x, player.y, directionX, directionY)
  }

  drawBall(ball: BallDto) {
    this.canvasDrawer.setFillStyle('yellow')
    this.canvasDrawer.drawCircle(ball.x, ball.y, ball.radius)
  }
}
