import { IMessage, MessageDto, MsgFlag } from 'api'
import { Server, Socket } from 'socket.io'

export class Messanger {
  private messages: IMessage[] = []
  private readonly logEvent = 'log'
  private readonly logResetEvent = 'log-reset'

  constructor(private readonly io: Server) {}

  public sendText(text: string) {
    const message: IMessage = {
      sender: '',
      text,
      flag: MsgFlag.Text,
    }
    this.messages.push(message)
    this.io.emit(this.logEvent, new MessageDto(message))
  }

  public sendMsg(sender: string, text: string, flag: MsgFlag) {
    const message: IMessage = {
      sender,
      text,
      flag,
    }
    this.messages.push(message)
    this.io.emit(this.logEvent, new MessageDto(message))
  }

  public sendTextToOne(socket: Socket, text: string) {
    const message: IMessage = {
      sender: '',
      text,
      flag: MsgFlag.Text,
    }
    this.messages.push(message)
    socket.emit(this.logEvent, new MessageDto(message))
  }

  public resendLog(socket: Socket) {
    if (this.messages.length === 0) return
    this.messages.forEach((msg) => {
      socket.emit(this.logEvent, new MessageDto(msg))
    })
  }

  public clear() {
    this.messages = []
  }

  public clearLogOne(socket: Socket) {
    socket.emit(this.logResetEvent)
  }

  public clearLogAll() {
    this.io.emit(this.logResetEvent)
  }
}
