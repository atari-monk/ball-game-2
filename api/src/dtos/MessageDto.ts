import { IMessage } from '../api/IMessage'

export class MessageDto {
  sender: string
  text: string

  constructor(message: IMessage) {
    this.sender = message.sender
    this.text = message.text
  }
}
