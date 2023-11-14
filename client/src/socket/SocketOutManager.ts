import { Socket } from 'socket.io-client'
import { IInput, IKeyInput, ISocketIo, ISocketOutManager } from 'client-api'
import { SocketEvents } from 'shared-api'

export class SocketOutManager implements ISocketOutManager {
  private socket: Socket

  constructor(socket: ISocketIo) {
    this.socket = socket.socket
  }

  sendPlayerInput(input: IInput) {
    this.socket.emit(SocketEvents.Input, input)
  }

  sendPlayerId(playerId: string) {
    this.socket.emit(SocketEvents.SetPlayerId, playerId)
  }

  sendPong() {
    this.socket.emit(SocketEvents.Pong)
  }

  sendKeyInput(input: IKeyInput): void {
    this.socket.emit(SocketEvents.Keys)
  }
}
