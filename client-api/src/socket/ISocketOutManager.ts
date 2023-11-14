import { IInput } from '../input/IInput'
import { IKeyInput } from '../input/IKeyInput'

export interface ISocketOutManager {
  sendPlayerInput(input: IInput): void
  sendPlayerId(playerId: string): void
  sendPong(): void
  sendKeyInput(input: IKeyInput): void
}
