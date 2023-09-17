import { FieldDto, IGateDtos, PlayerDto, BallDto } from 'api'

export class CanvasRenderer {
  private canvas: HTMLCanvasElement | null
  private ctx: CanvasRenderingContext2D | null

  constructor() {
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement | null

    if (!this.canvas) {
      throw new Error('Canvas element not found')
    }

    this.ctx = this.canvas.getContext('2d')
    if (!this.ctx) {
      throw new Error('Canvas 2d context not available')
    }
  }

  clearCanvas() {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas!.width, this.canvas!.height)
    }
  }

  drawField(field: FieldDto) {
    if (this.ctx) {
      this.ctx.fillStyle = 'green'
      this.ctx.fillRect(0, 0, field.width, field.height)
    }
  }

  drawGates(gates: IGateDtos) {
    if (this.ctx) {
      this.ctx.fillStyle = gates.left.team.color
      this.ctx.fillRect(
        gates.left.x,
        gates.left.y,
        gates.left.width,
        gates.left.height
      )

      this.ctx.fillStyle = gates.right.team.color
      this.ctx.fillRect(
        gates.right.x,
        gates.right.y,
        gates.right.width,
        gates.right.height
      )
    }
  }

  drawPlayer(player: PlayerDto) {
    if (this.ctx) {
      this.ctx.fillStyle = player.team?.color ?? 'blue' // Change color or style as needed
      this.ctx.strokeStyle = 'yellow' // Change color or style as needed
      this.ctx.lineWidth = 2 // Set the line width as needed
      this.ctx.beginPath()
      this.ctx.arc(player.x, player.y, player.radius, 0, 2 * Math.PI)
      this.ctx.fill()

      // Draw direction vector line
      this.ctx.beginPath()
      this.ctx.moveTo(player.x, player.y)
      const directionX = player.x + player.radius * Math.cos(player.direction)
      const directionY = player.y + player.radius * Math.sin(player.direction)
      this.ctx.lineTo(directionX, directionY)
      this.ctx.stroke()
    }
  }

  drawBall(ball: BallDto) {
    if (this.ctx) {
      this.ctx.fillStyle = 'yellow' // Change color or style for the ball
      this.ctx.beginPath()
      this.ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI)
      this.ctx.fill()
    }
  }
}
