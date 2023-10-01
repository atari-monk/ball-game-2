import { Server } from 'socket.io'
import { IPlayer, IPlayerState } from 'game-api'
import { IdleState } from '../player/state/IdleState'
import { PlayerAction } from './PlayerAction'

export class PlayerState extends PlayerAction implements IPlayer {
  private currentState: IPlayerState

  constructor(io: Server) {
    super()
    this.currentState = new IdleState(this, io)
    this.currentState.enter()
  }

  setState(newState: IPlayerState): void {
    this.currentState.exit()
    this.currentState = newState
    this.currentState.enter()
  }
}
