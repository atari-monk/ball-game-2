import { MapDto, MatchDto, MessageDto } from 'api'
import { Socket, io } from 'socket.io-client'
import { IInput } from './api/IInput'

export class SocketManager {
  private socket: Socket

  get connection(): Socket {
    return this.socket
  }

  constructor(serverHost: string) {
    this.socket = io(serverHost)
    this.setupSocket()
  }

  private setupSocket() {
    this.socket.on('connect', () => {
      const playerId = localStorage.getItem('playerId')
      this.socket.emit('setPlayerId', playerId)
    })

    this.socket.on('assignedPlayerId', (id: string) => {
      localStorage.setItem('playerId', id)
    })

    this.socket.on('ping', () => {
      this.socket.emit('pong')
    })
  }

  handleMapUpdate(callback: (mapData: MapDto) => void) {
    this.socket.on('map', callback)
  }

  handleLogMessage(callback: (message: MessageDto) => void) {
    this.socket.on('log', callback)
  }

  handleLogReset(callback: () => void) {
    this.socket.on('log-reset', callback)
  }

  handleMatchUpdate(callback: (matchData: MatchDto) => void) {
    this.socket.on('update', callback)
  }

  sendPlayerInput(input: IInput) {
    this.socket.emit('input', input)
  }
}
