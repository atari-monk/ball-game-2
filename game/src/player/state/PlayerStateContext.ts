import { Server } from 'socket.io'
import { IPlayerModel, IPlayerState } from 'game-api'
import { IdleState } from './IdleState'

export class PlayerStateContext {
  private currentState: IPlayerState

  constructor(player: IPlayerModel, io: Server) {
    this.currentState = new IdleState(player, io)
  }

  setState(newState: IPlayerState): void {
    this.currentState.exit()
    this.currentState = newState
    this.currentState.enter()
  }
}
