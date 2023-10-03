import { IPlayerState } from 'game-api'
import { PlayerModel } from './PlayerModel'
import { IdleState } from './state/IdleState'

export class PlayerStateContext extends PlayerModel {
  private currentState: IPlayerState

  constructor() {
    super()
    this.currentState = new IdleState(this)
    this.currentState.enter()
  }

  setState(newState: IPlayerState): void {
    this.currentState.exit()
    this.currentState = newState
    this.currentState.enter()
  }
}
