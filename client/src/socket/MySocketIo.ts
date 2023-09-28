import { Socket, io } from 'socket.io-client'
import { ISocketIo } from './ISocketIo'

export class MySocketIo implements ISocketIo {
  private _socket: Socket

  get socket(): Socket {
    return this._socket
  }

  constructor(serverHost: string) {
    this._socket = io(serverHost)
  }
}
