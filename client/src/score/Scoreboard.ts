import { ISocketInManager } from 'client-api'
import { FieldDto, PointDto } from 'dtos'
import { Team } from 'shared-api'
import { CanvasDrawer } from '../canvas/CanvasDrawer'
import { ITextInfo } from '../canvas/ITextInfo'

export class Scoreboard {
  private redScore: number = 0
  private blueScore: number = 0
  private redText: ITextInfo
  private blueText: ITextInfo
  private yellowText: ITextInfo

  constructor(
    private readonly socketInManager: ISocketInManager,
    private readonly drawer: CanvasDrawer,
    private readonly field: FieldDto
  ) {
    this.redText = { font: '30px Arial', color: 'red' }
    this.blueText = { font: '30px Arial', color: 'blue' }
    this.yellowText = { font: '30px Arial', color: 'yellow' }
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
    this.drawer.drawText(
      this.redScore.toString(),
      this.field.width / 2 - (this.redScore < 10 ? 25 : 42),
      25,
      this.redText
    )
    this.drawer.drawText(':', this.field.width / 2 - 5, 25, this.yellowText)
    this.drawer.drawText(
      this.blueScore.toString(),
      this.field.width / 2 + (this.blueScore < 10 ? 5 : 5),
      25,
      this.blueText
    )
  }
}
