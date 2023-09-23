import { MapDto, MatchDto, MessageDto } from 'api'
import { hostConfig } from './config/config'
import { CanvasRenderer } from './canvas/CanvasRenderer'
import { SocketManager } from './SocketManager'
import { LogManager } from './logger/LogManager'
import { IInput } from './api/IInput'
import { AnimationLoop } from './canvas/AnimationLoop'

export class GameClient {
  private socketManager: SocketManager
  private canvasRenderer: CanvasRenderer
  private logManager: LogManager
  private map: MapDto | null = null
  private match: MatchDto | null = null
  private animationLoop: AnimationLoop

  constructor() {
    this.socketManager = new SocketManager(hostConfig.selectedHost)
    this.canvasRenderer = new CanvasRenderer()
    this.logManager = new LogManager()
    this.animationLoop = new AnimationLoop(this.render.bind(this))

    this.initializeSocketListeners()
    this.initializeEventListeners()
    this.animationLoop.start()
  }

  private initializeSocketListeners() {
    this.socketManager.handleMapUpdate(this.handleMapUpdate.bind(this))
    this.socketManager.handleLogMessage(this.handleLogMessage.bind(this))
    this.socketManager.handleLogReset(this.handleLogReset.bind(this))
    this.socketManager.handleMatchUpdate(this.handleMatchUpdate.bind(this))
  }

  private initializeEventListeners() {
    document.addEventListener('keydown', this.handleKeyDown.bind(this))
  }

  private handleMapUpdate(dto: MapDto) {
    this.map = dto
  }

  private handleMatchUpdate(dto: MatchDto) {
    this.match = dto
  }

  private handleLogMessage(dto: MessageDto) {
    this.logManager.logMessage(dto)
  }

  private handleLogReset() {
    this.logManager.clearTextArea()
  }

  private handleKeyDown(event: KeyboardEvent) {
    const input: IInput = {
      up: event.key === 'ArrowUp',
      down: event.key === 'ArrowDown',
      left: event.key === 'ArrowLeft',
      right: event.key === 'ArrowRight',
    }
    this.socketManager.sendPlayerInput(input)
  }

  private render(cdt: number) {
    this.canvasRenderer.clearCanvas()
    if (this.map) {
      const { gates, field } = this.map
      this.canvasRenderer.drawField(field)
      this.canvasRenderer.drawGates(gates)
    }
    if (this.match) {
      const { players, ball } = this.match
      for (const playerId in players) {
        this.canvasRenderer.drawPlayer(players[playerId], cdt)
      }
      this.canvasRenderer.drawBall(ball)
    }
  }

  public stopGame() {
    this.animationLoop.stop()
  }
}
