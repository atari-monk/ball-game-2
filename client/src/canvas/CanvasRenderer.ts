import { FieldDto, IGateDtos, BallDto } from 'dtos'
import { CanvasInfoProvider } from './CanvasInfoProvider'
import { CanvasDrawer } from './CanvasDrawer'
import { PlayerModel } from '../player/PlayerModel'
import { PlayerRenderer } from '../player/PlayerRenderer'
import { blueAnimations, redAnimations } from '../player/playerData'

export class CanvasRenderer {
  private ctx: CanvasRenderingContext2D
  private canvasDrawer: CanvasDrawer
  private redplayerRenderer: PlayerRenderer
  private blueplayerRenderer: PlayerRenderer

  constructor() {
    const canvasInfoProvider = new CanvasInfoProvider()
    const canvasInfo = canvasInfoProvider.getCanvasInfo('canvas')
    this.ctx = canvasInfo.ctx
    this.canvasDrawer = new CanvasDrawer(this.ctx)
    this.redplayerRenderer = new PlayerRenderer(
      this.canvasDrawer,
      redAnimations
    )
    this.blueplayerRenderer = new PlayerRenderer(
      this.canvasDrawer,
      blueAnimations
    )
    this.redplayerRenderer.switchAnimation(0)
    this.blueplayerRenderer.switchAnimation(0)
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

  drawPlayer(player: PlayerModel, dt: number) {
    if (player.teamColor === 'red') {
      this.redplayerRenderer.update(dt)
      this.redplayerRenderer.draw(player)
    }
    if (player.teamColor === 'blue') {
      this.blueplayerRenderer.update(dt)
      this.blueplayerRenderer.draw(player)
    }
  }

  drawBall(ball: BallDto) {
    this.canvasDrawer.setFillStyle('yellow')
    this.canvasDrawer.drawCircle(ball.x, ball.y, ball.radius)
  }
}
