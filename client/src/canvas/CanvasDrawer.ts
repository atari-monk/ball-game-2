import { ITextInfo } from './ITextInfo'

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
    this.ctx.stroke()
  }

  drawLine(x1: number, y1: number, x2: number, y2: number) {
    this.ctx.beginPath()
    this.ctx.moveTo(x1, y1)
    this.ctx.lineTo(x2, y2)
    this.ctx.stroke()
  }

  drawText(text: string, x: number, y: number, data: ITextInfo) {
    this.ctx.font = data.font
    this.ctx.fillStyle = data.color
    this.ctx.fillText(text, x, y)
  }

  async loadImage(imgAssetPath: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const image = new Image()
      image.src = imgAssetPath

      image.onload = () => {
        resolve(image)
      }

      image.onerror = () => {
        reject(new Error('Failed to load the image.'))
      }
    })
  }

  drawImage(
    image: HTMLImageElement,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    this.ctx.drawImage(image, x, y, width, height)
  }

  drawImageFlippedHorizontally(
    image: HTMLImageElement,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    this.ctx.save() // Save the current canvas state
    this.ctx.scale(-1, 1) // Flip the canvas horizontally
    this.ctx.drawImage(image, -x - width, y, width, height) // Draw the image (flipped)
    this.ctx.restore() // Restore the canvas state
  }
}
