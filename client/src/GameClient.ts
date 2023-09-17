import { FieldDto, IGateDtos, MapDto, MatchDto, MessageDto } from 'api'
import { hostConfig } from './config/config'
import { CanvasRenderer } from './CanvasRenderer'
import { SocketManager } from './SocketManager'
import { LogManager } from './LogManager'
import { IInput } from './api/IInput'

export class GameClient {
  private socketManager: SocketManager
  private canvasRenderer: CanvasRenderer
  private logManager: LogManager
  private gates: IGateDtos | null
  private field: FieldDto | null

  constructor() {
    this.socketManager = new SocketManager(hostConfig.selectedHost)
    this.canvasRenderer = new CanvasRenderer()
    this.logManager = new LogManager('log', 'log-filter')

    this.gates = null
    this.field = null

    this.initializeSocketListeners()
    this.initializeEventListeners()
  }

  private initializeSocketListeners() {
    this.socketManager.handleMapEvent((dto: MapDto) => {
      this.handleMapUpdate(dto)
    })

    this.socketManager.handleLogEvent((dto: MessageDto) => {
      this.logManager.logMessage(dto)
    })

    this.socketManager.handleLogResetEvent(() => {
      this.logManager.clearTextArea()
    })

    this.socketManager.handleUpdateEvent((dto: MatchDto) => {
      this.handleMatchUpdate(dto)
    })
  }

  private initializeEventListeners() {
    document.addEventListener('keydown', (event: KeyboardEvent) => {
      const input: IInput = {
        up: event.key === 'ArrowUp',
        down: event.key === 'ArrowDown',
        left: event.key === 'ArrowLeft',
        right: event.key === 'ArrowRight',
      }
      this.socketManager.sendInput(input)
    })
  }

  private handleMapUpdate(dto: MapDto) {
    this.gates = dto.gates
    this.field = dto.field
    this.canvasRenderer.clearCanvas()
    this.canvasRenderer.drawField(this.field)
    this.canvasRenderer.drawGates(this.gates)
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
}
