import { Socket, io } from 'socket.io-client'
import {
  FieldDto,
  IGateDtos,
  MapDto,
  MatchDto,
  MessageDto,
  MsgFlag,
} from 'api'
import { hostConfig } from './config/config'
import { CanvasRenderer } from './CanvasRenderer'

export class GameClient {
  private socket: Socket
  private canvasRenderer: CanvasRenderer
  private textArea: HTMLTextAreaElement | null
  private logFilterOption: string = 'Text'
  private gates: IGateDtos | null
  private field: FieldDto | null

  constructor() {
    this.socket = io(hostConfig.selectedHost)
    this.canvasRenderer = new CanvasRenderer()
    this.textArea = document.getElementById('log') as HTMLTextAreaElement | null

    this.gates = null
    this.field = null

    const logFilter = document.getElementById(
      'log-filter'
    ) as HTMLSelectElement | null
    if (!logFilter) {
      throw new Error('log Filter not available')
    }

    logFilter.value = 'Text'
    logFilter.addEventListener('change', () => {
      this.logFilterOption = logFilter.value
    })

    this.initializeSocketListeners()
    this.initializeEventListeners()
  }

  private initializeSocketListeners() {
    this.socket.on('connect', () => {
      const yourPlayerId = localStorage.getItem('yourPlayerId')
      this.socket.emit('setPlayerId', yourPlayerId)
    })

    this.socket.on('yourPlayerId', (id: string) => {
      localStorage.setItem('yourPlayerId', id)
    })

    this.socket.on('ping', () => {
      this.socket.emit('pong')
    })

    this.socket.on('map', (dto: MapDto) => {
      this.handleMapUpdate(dto)
    })

    this.socket.on('log', (dto: MessageDto) => {
      this.logMessage(dto)
    })

    this.socket.on('log-reset', () => {
      this.clearTextArea()
    })

    this.socket.on('update', (dto: MatchDto) => {
      this.handleMatchUpdate(dto)
    })
  }

  private initializeEventListeners() {
    document.addEventListener('keydown', (event: KeyboardEvent) => {
      const input = {
        up: event.key === 'ArrowUp',
        down: event.key === 'ArrowDown',
        left: event.key === 'ArrowLeft',
        right: event.key === 'ArrowRight',
      }
      this.socket.emit('input', input)
    })
  }

  private handleMapUpdate(dto: MapDto) {
    this.gates = dto.gates
    this.field = dto.field
    this.canvasRenderer.clearCanvas()
    this.canvasRenderer.drawField(this.field)
    this.canvasRenderer.drawGates(this.gates)
  }

  private logMessage(message: MessageDto) {
    if (
      this.logFilterOption !== 'All' &&
      this.logFilterOption !== MsgFlag[message.flag]
    ) {
      return
    }
    const senderText = message.sender ? `${message.sender}:` : ''
    const log = `${senderText}${message.text}`

    if (this.textArea) {
      this.textArea.value += log + '\n'
      this.textArea.scrollTop = this.textArea.scrollHeight
    }
  }

  private clearTextArea() {
    if (this.textArea) {
      this.textArea.value = ''
    }
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
