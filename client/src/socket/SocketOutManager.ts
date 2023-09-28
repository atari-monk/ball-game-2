import { Socket } from 'socket.io-client'
import { IInput } from '../api/IInput'
import { ISocketOutManager } from './ISocketOutManager'
import { ISocketIo } from './ISocketIo'
import { OutEvents } from './SocketOutEvent'

export class SocketOutManager implements ISocketOutManager {
  private socket: Socket

  constructor(socket: ISocketIo) {
    this.socket = socket.socket
  }

  sendPlayerInput(input: IInput) {
    this.socket.emit(OutEvents.Input, input)
  }

  sendPlayerId(playerId: string) {
    this.socket.emit(OutEvents.SetPlayerId, playerId)
  }

  sendPong() {
    this.socket.emit(OutEvents.Pong)
  }
}
