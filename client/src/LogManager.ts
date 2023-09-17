import { MessageDto, MsgFlag } from 'api'

export class LogManager {
  private textArea: HTMLTextAreaElement | null
  private logFilterOption: string = 'Text'

  constructor(textAreaId: string, logFilterId: string) {
    this.textArea = document.getElementById(
      textAreaId
    ) as HTMLTextAreaElement | null

    if (!this.textArea) {
      throw new Error('Log text area not available')
    }

    const logFilter = document.getElementById(
      logFilterId
    ) as HTMLSelectElement | null

    if (!logFilter) {
      throw new Error('Log filter not available')
    }

    logFilter.value = 'Text'
    logFilter.addEventListener('change', () => {
      this.logFilterOption = logFilter.value
    })
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
