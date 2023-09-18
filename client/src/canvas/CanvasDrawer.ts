export class CanvasDrawer {
  private ctx: CanvasRenderingContext2D

  get cctx(): CanvasRenderingContext2D {
    return this.ctx
  }

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
  }

  setFillStyle(color: string) {
    this.ctx.fillStyle = color
  }

  setLineStyle(color: string, width: number) {
    this.ctx.strokeStyle = color
    this.ctx.lineWidth = width
  }

  drawRectangle(x: number, y: number, width: number, height: number) {
    this.ctx.fillRect(x, y, width, height)
  }

  drawCircle(x: number, y: number, radius: number) {
    this.ctx.beginPath()
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI)
    this.ctx.fill()
  }

  drawLine(x1: number, y1: number, x2: number, y2: number) {
    this.ctx.beginPath()
    this.ctx.moveTo(x1, y1)
    this.ctx.lineTo(x2, y2)
    this.ctx.stroke()
  }
}
