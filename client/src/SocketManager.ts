import { MapDto, MatchDto, MessageDto } from 'api'
import { Socket, io } from 'socket.io-client'
import { IInput } from './api/IInput'

export class SocketManager {
  private _socket: Socket

  get socket(): Socket {
    return this._socket
  }

  constructor(host: string) {
    this._socket = io(host)
    this.configureSocket()
  }

  private configureSocket() {
    this._socket.on('connect', () => {
      const yourPlayerId = localStorage.getItem('yourPlayerId')
      this._socket.emit('setPlayerId', yourPlayerId)
    })

    this._socket.on('yourPlayerId', (id: string) => {
      localStorage.setItem('yourPlayerId', id)
    })

    this._socket.on('ping', () => {
      this._socket.emit('pong')
    })
  }

  handleMapEvent(callback: (dto: MapDto) => void) {
    this._socket.on('map', callback)
  }

  handleLogEvent(callback: (dto: MessageDto) => void) {
    this.socket.on('log', callback)
  }

  handleLogResetEvent(callback: () => void) {
    this.socket.on('log-reset', callback)
  }

  handleUpdateEvent(callback: (dto: MatchDto) => void) {
    this.socket.on('update', callback)
  }

  sendInput(input: IInput) {
    this.socket.emit('input', input)
  }
}
