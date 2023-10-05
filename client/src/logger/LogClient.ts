import { MessageDto } from 'dtos'
import { LogManager } from './LogManager'
import { ISocketInManager } from 'client-api'

export class LogClient {
  private logManager: LogManager

  constructor(private readonly socketInManager: ISocketInManager) {
    this.logManager = new LogManager()
    this.initializeSocketListeners()
  }

  private initializeSocketListeners() {
    this.socketInManager.handleLogMessage(this.handleLogMessage.bind(this))
    this.socketInManager.handleLogReset(this.handleLogReset.bind(this))
  }

  private handleLogMessage(dto: MessageDto) {
    this.logManager.logMessage(dto)
  }

  private handleLogReset() {
    this.logManager.clearTextArea()
  }
}
