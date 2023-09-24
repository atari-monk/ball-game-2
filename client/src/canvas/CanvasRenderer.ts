import { FieldDto, IGateDtos, PlayerDto, BallDto } from 'api'
import { CanvasInfoProvider } from './CanvasInfoProvider'
import { CanvasDrawer } from './CanvasDrawer'
import { BluePlayerRenderer } from './BluePlayerRenderer'
import { RedPlayerRenderer } from './RedPlayerRenderer'

export class CanvasRenderer {
  private ctx: CanvasRenderingContext2D
  private canvasDrawer: CanvasDrawer
  private redplayerRenderer: RedPlayerRenderer
  private blueplayerRenderer: BluePlayerRenderer

  constructor() {
    const canvasInfoProvider = new CanvasInfoProvider()
    const canvasInfo = canvasInfoProvider.getCanvasInfo('canvas')
    this.ctx = canvasInfo.ctx
    this.canvasDrawer = new CanvasDrawer(this.ctx)
    this.redplayerRenderer = new RedPlayerRenderer(this.canvasDrawer)
    this.blueplayerRenderer = new BluePlayerRenderer(this.canvasDrawer)
    this.redplayerRenderer.switchAnimation(1)
    this.blueplayerRenderer.switchAnimation(1)
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
    if (player.team?.color === 'red') {
      this.redplayerRenderer.update(dt)
      this.redplayerRenderer.draw(player)
    }
    if (player.team?.color === 'blue') {
      this.blueplayerRenderer.update(dt)
      this.blueplayerRenderer.draw(player)
    }
  }

  drawBall(ball: BallDto) {
    this.canvasDrawer.setFillStyle('yellow')
    this.canvasDrawer.drawCircle(ball.x, ball.y, ball.radius)
  }
}
