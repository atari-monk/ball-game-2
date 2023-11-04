import { Server } from 'socket.io'
import { IPlayerModel, IState } from 'game-api'
import { IdleState } from './IdleState'

export class PlayerStateContext {
  private currentState: IState

  constructor(player: IPlayerModel, io: Server) {
    this.currentState = new IdleState(player, io)
  }

  setState(newState: IState): void {
    this.currentState.exit()
    this.currentState = newState
    this.currentState.enter()
  }
}
