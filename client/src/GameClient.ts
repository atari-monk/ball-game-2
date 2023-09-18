import { FieldDto, IGateDtos, MapDto, MatchDto, MessageDto } from 'api'
import { hostConfig } from './config/config'
import { CanvasRenderer } from './canvas/CanvasRenderer'
import { SocketManager } from './SocketManager'
import { LogManager } from './logger/LogManager'
import { IInput } from './api/IInput'

export class GameClient {
  private socketManager: SocketManager
  private canvasRenderer: CanvasRenderer
  private logManager: LogManager
  private gates: IGateDtos | null = null
  private field: FieldDto | null = null

  constructor() {
    this.socketManager = new SocketManager(hostConfig.selectedHost)
    this.canvasRenderer = new CanvasRenderer()
    this.logManager = new LogManager()

    this.initializeSocketListeners()
    this.initializeEventListeners()
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
    this.gates = dto.gates
    this.field = dto.field
    this.canvasRenderer.clearCanvas()
    this.canvasRenderer.drawField(this.field)
    this.canvasRenderer.drawGates(this.gates!)
  }

  private handleMatchUpdate(dto: MatchDto) {
    const { players, ball } = dto
    this.canvasRenderer.clearCanvas()
    this.canvasRenderer.drawField(this.field!)
    this.canvasRenderer.drawGates(this.gates!)

    for (const playerId in players) {
      this.canvasRenderer.drawPlayer(players[playerId])
    }
    this.canvasRenderer.drawBall(ball)
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
}
