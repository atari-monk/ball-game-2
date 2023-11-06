import { Server } from 'socket.io'
import { IPlayerModel, IState } from 'game-api'
import { PlayerIdleState } from './PlayerIdleState'

export class PlayerStateContext {
  private currentState: IState

  constructor(player: IPlayerModel, io: Server) {
    this.currentState = new PlayerIdleState(player, io)
  }

  setState(newState: IState): void {
    this.currentState.exit()
    this.currentState = newState
    this.currentState.enter()
  }
}
