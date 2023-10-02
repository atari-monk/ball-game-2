import { Socket } from 'socket.io-client'
import { IInput, ISocketIo, ISocketOutManager } from 'client-api'
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
