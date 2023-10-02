import { ISocketIo } from 'client-api'
import { Socket, io } from 'socket.io-client'

export class MySocketIo implements ISocketIo {
  private _socket: Socket

  get socket(): Socket {
    return this._socket
  }

  constructor(serverHost: string) {
    this._socket = io(serverHost)
  }
}
