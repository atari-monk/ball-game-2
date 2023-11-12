import { ICanvasInfo } from 'client-api'
import { CanvasDrawer } from './CanvasDrawer'
import { ITextInfo2 } from './ITextInfo'

export class WaitInfo {
  private info: ITextInfo2
  private info2: ITextInfo2

  constructor(
    private readonly canvasDrawer: CanvasDrawer,
    private readonly canvasInfo: ICanvasInfo
  ) {
    this.info = {
      font: '30px Arial',
      color: 'yellow',
      text: 'server is waking up, please wait...',
      x: 0,
      y: 0,
      textWidth: 0,
      textHeigth: 0,
    }
    this.canvasDrawer.measureText2(this.info)
    this.info.x = this.canvasInfo.canvas.width / 2 - this.info.textWidth / 2
    this.info.y = this.canvasInfo.canvas.height / 2 - this.info.textHeigth / 2

    this.info2 = {
      font: '30px Arial',
      color: 'yellow',
      text: 'waiting for player, please wait...',
      x: 0,
      y: 0,
      textWidth: 0,
      textHeigth: 0,
    }
    this.canvasDrawer.measureText2(this.info2)
    this.info2.x = this.canvasInfo.canvas.width / 2 - this.info2.textWidth / 2
    this.info2.y = this.canvasInfo.canvas.height / 2 - this.info2.textHeigth / 2
  }

  draw(isWakingUp: boolean, isWaitingForPlayer: boolean) {
    if (isWakingUp) this.canvasDrawer.drawText2(this.info)
    if (isWaitingForPlayer) this.canvasDrawer.drawText2(this.info2)
  }
}
