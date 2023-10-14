import { ISocketInManager } from 'client-api'
import { PointDto } from 'dtos'
import { Team } from 'shared-api'
import { CanvasDrawer } from '../canvas/CanvasDrawer'
import { ITextInfo } from '../canvas/ITextInfo'

export class Scoreboard {
  private redScore: number = 0
  private blueScore: number = 0
  private redText: ITextInfo
  private blueText: ITextInfo

  constructor(
    private readonly socketInManager: ISocketInManager,
    private readonly drawer: CanvasDrawer
  ) {
    this.redText = { font: '30px Arial', color: 'red' }
    this.blueText = { font: '30px Arial', color: 'blue' }
    this.initializeSocketListeners()
  }

  private initializeSocketListeners() {
    this.socketInManager.handlePoint(this.onPoint.bind(this))
  }

  private onPoint(data: PointDto) {
    if (data.team === Team.Red) {
      this.incrementRedScore()
    }
    if (data.team === Team.Blue) {
      this.incrementBlueScore()
    }
  }

  incrementRedScore() {
    this.redScore++
  }

  incrementBlueScore() {
    this.blueScore++
  }

  draw() {
    this.drawer.drawText(this.redScore.toString(), 200, 100, this.redText)
  }
}
