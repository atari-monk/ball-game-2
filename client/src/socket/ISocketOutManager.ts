import { IInput } from 'client-api'

export interface ISocketOutManager {
  sendPlayerInput(input: IInput): void
  sendPlayerId(playerId: string): void
  sendPong(): void
}
