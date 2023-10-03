import { IPlayerState, PlayerStateType } from 'game-api'
import { PlayerStateContext } from '../PlayerStateContext'

export class IdleState implements IPlayerState {
  constructor(private readonly player: PlayerStateContext) {}

  enter() {
    this.player.state = { type: PlayerStateType.Idle }
  }

  exit() {}

  update() {}
}
