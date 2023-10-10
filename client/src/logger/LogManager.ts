import { MessageDto } from 'dtos'
import { LogInfoProvider } from './LogInfoProvider'
import { MsgFlag } from 'game-api'

export class LogManager {
  private textArea: HTMLTextAreaElement | null
  private logFilterOption: string = 'Text'

  constructor() {
    const logInfoProvider = new LogInfoProvider(
      'log_textarea',
      'log_filter_select'
    )
    this.textArea = logInfoProvider.getTextArea()
    this.logFilterOption = logInfoProvider.getLogFilterOption()
  }

  logMessage(message: MessageDto) {
    if (
      this.logFilterOption !== 'All' &&
      this.logFilterOption !== MsgFlag[message.flag]
    ) {
      return
    }
    const senderText = message.sender ? `${message.sender}: ` : ''
    const log = `${senderText}${message.text}`

    if (this.textArea) {
      this.textArea.value += log + '\n'
      this.textArea.scrollTop = this.textArea.scrollHeight
    }
  }

  clearTextArea() {
    if (this.textArea) {
      this.textArea.value = ''
    }
  }
}
