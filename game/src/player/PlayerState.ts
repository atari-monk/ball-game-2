import { Server } from 'socket.io'
import { INameGenerator, IPlayer, IPlayerState } from 'game-api'
import { IdleState } from './state/IdleState'
import { PlayerActionProxy } from './PlayerActionProxy'

export class PlayerState extends PlayerActionProxy implements IPlayer {
  private currentState: IPlayerState

  constructor(
    id: string,
    nameGenerator: INameGenerator,
    private readonly io: Server
  ) {
    super(id, nameGenerator)
    this.currentState = new IdleState(this, this.io)
    this.currentState.enter()
  }

  setState(newState: IPlayerState): void {
    this.currentState.exit()
    this.currentState = newState
    this.currentState.enter()
  }
}
