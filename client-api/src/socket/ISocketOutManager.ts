import { IInput } from "../IInput"

export interface ISocketOutManager {
  sendPlayerInput(input: IInput): void
  sendPlayerId(playerId: string): void
  sendPong(): void
}
