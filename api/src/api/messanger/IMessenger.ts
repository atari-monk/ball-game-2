import { Socket } from 'socket.io'
import { MsgFlag } from './MsgFlag'

export interface IMessenger {
  sendText(text: string): void
  sendMsg(sender: string, text: string, flag: MsgFlag): void
  sendTextToOne(socket: Socket, text: string): void
  resendLog(socket: Socket): void
  clear(): void
  clearLogOne(socket: Socket): void
  clearLogAll(): void
}
