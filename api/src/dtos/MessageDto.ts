import { IMessage } from '../api/messanger/IMessage'
import { MsgFlag } from '../api/messanger/MsgFlag'

export class MessageDto {
  sender: string
  text: string
  flag: MsgFlag

  constructor(message: IMessage) {
    this.sender = message.sender
    this.text = message.text
    this.flag = message.flag
  }
}
