import { MsgFlag } from './MsgFlag'

export interface IMessage {
  sender: string
  text: string
  flag: MsgFlag
}
