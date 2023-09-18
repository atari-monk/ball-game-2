import { FieldDto, IGateDtos, PlayerDto, BallDto } from 'api'
import { CanvasInfoProvider } from './CanvasInfoProvider'
import { CanvasDrawer } from './CanvasDrawer'
import { PlayerRenderer } from './PlayerRenderer'

export class CanvasRenderer {
  private ctx: CanvasRenderingContext2D
  private canvasDrawer: CanvasDrawer
  private playerRenderer: PlayerRenderer

  constructor() {
    const canvasInfoProvider = new CanvasInfoProvider()
    const canvasInfo = canvasInfoProvider.getCanvasInfo('canvas')
    this.ctx = canvasInfo.ctx
    this.canvasDrawer = new CanvasDrawer(this.ctx)
    this.playerRenderer = new PlayerRenderer(this.canvasDrawer)
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

  drawPlayer(player: PlayerDto, dt: number) {
    this.playerRenderer.update(dt)
    this.playerRenderer.draw(player)
  }

  drawBall(ball: BallDto) {
    this.canvasDrawer.setFillStyle('yellow')
    this.canvasDrawer.drawCircle(ball.x, ball.y, ball.radius)
  }
}
