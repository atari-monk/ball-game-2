import { INameGenerator, IPlayerState } from 'game-api'
import { IdleState } from './state/IdleState'
import { PlayerActionProxy } from './PlayerActionProxy'

export class PlayerState extends PlayerActionProxy {
  private currentState: IPlayerState

  constructor(id: string, nameGenerator: INameGenerator) {
    super(id, nameGenerator)
    this.currentState = new IdleState()
    this.currentState.enter()
  }

  setState(newState: IPlayerState): void {
    this.currentState.exit()
    this.currentState = newState
    this.currentState.enter()
  }
}
