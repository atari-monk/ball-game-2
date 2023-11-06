import { FieldDto, IGateDtos, BallDto } from 'dtos'
import { CanvasDrawer } from './CanvasDrawer'
import { Player } from '../player/Player'
import { Ball } from '../ball/Ball'

export class CanvasRenderer {
  private fieldImg: HTMLImageElement | null

  constructor(private readonly canvasDrawer: CanvasDrawer) {
    this.fieldImg = null
  }

  async loadImageAndInitialize() {
    try {
      this.fieldImg = await this.canvasDrawer.loadImage('../assets/grass.png')
    } catch (error: any) {
      console.error(error.message)
    }
  }

  async initialize() {
    await this.loadImageAndInitialize()
  }

  clearCanvas() {
    this.canvasDrawer.clearCanvas()
  }

  drawField(field: FieldDto) {
    //this.canvasDrawer.setFillStyle('green')
    //this.canvasDrawer.drawRectangle(0, 0, field.width, field.height)
    if (!this.fieldImg) return
    this.canvasDrawer.drawImage(this.fieldImg, 0, 0, field.width, field.height)
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

  drawPlayer(player: Player, dt: number) {
    player.render(dt)
  }

  drawBall(ball: Ball, dt: number) {
    ball.render(dt)
  }
}
