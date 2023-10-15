import { ISocketInManager } from 'client-api'
import { CounterDto, FieldDto } from 'dtos'
import { CanvasDrawer } from '../canvas/CanvasDrawer'
import { ITextInfo } from '../canvas/ITextInfo'
import { CounterEvent } from 'shared-api'

export class Counter {
  private redText: ITextInfo
  private blueText: ITextInfo
  private yellowText: ITextInfo
  private data?: CounterDto
  private eventMap

  constructor(
    private readonly socketInManager: ISocketInManager,
    private readonly drawer: CanvasDrawer,
    private readonly field: FieldDto
  ) {
    this.redText = { font: '30px Arial', color: 'red' }
    this.blueText = { font: '30px Arial', color: 'blue' }
    this.yellowText = { font: '60px Arial', color: 'yellow' }
    this.eventMap = {
      [CounterEvent.StartGame]: 'PLAY IN',
    }
    this.initializeSocketListeners()
  }

  private initializeSocketListeners() {
    this.socketInManager.handleCounter(this.onCounter.bind(this))
  }

  private onCounter(data: CounterDto) {
    this.data = data
  }

  draw() {
    if (!this.data) return
    if (this.data.event === CounterEvent.StartGame) this.handleStart()
    //this.debugStart()
  }

  private handleStart() {
    if (!this.data) return
    if (this.data.second > 0) {
      this.drawer.drawText(
        this.eventMap[this.data.event],
        this.field.width / 2 - 55,
        90,
        this.redText
      )
      this.setFont()
      this.drawer.drawText(
        this.data.second.toString(),
        this.field.width / 2 - 15,
        140,
        this.blueText
      )
    }
    if (this.data.second === 0) {
      this.drawer.drawText(
        this.data.message,
        this.field.width / 2 - 60,
        145,
        this.yellowText
      )
      this.startCounter(() => (this.data = undefined))
    }
  }

  private startCounter(fn: () => void, sec: number = 1) {
    let timer = sec
    const intervalId = setInterval(() => {
      timer--
      if (timer === 0) {
        clearInterval(intervalId)
        fn()
      }
    }, 1000)
  }

  private setFont() {
    if (this.data!.second === 2)
      this.blueText = { font: '40px Arial', color: 'blue' }
    if (this.data!.second === 1)
      this.blueText = { font: '50px Arial', color: 'blue' }
  }

  debugStart() {
    this.drawer.drawText(
      this.eventMap[CounterEvent.StartGame],
      this.field.width / 2 - 55,
      90,
      this.redText
    )
    this.drawer.drawText('3', this.field.width / 2 - 15, 140, this.blueText)
    this.blueText = { font: '40px Arial', color: 'blue' }
    this.drawer.drawText('2', this.field.width / 2 - 15, 140, this.blueText)
    this.blueText = { font: '50px Arial', color: 'blue' }
    this.drawer.drawText('1', this.field.width / 2 - 15, 140, this.blueText)
    this.drawer.drawText(
      'GO !',
      this.field.width / 2 - 60,
      145,
      this.yellowText
    )
  }
}
