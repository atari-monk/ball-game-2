import { IPlayerState } from 'game-api'
import { PlayerStateContext } from '../PlayerStateContext'
import { PlayerStateType } from 'shared-api'

export class IdleState implements IPlayerState {
  constructor(private readonly player: PlayerStateContext) {}

  enter() {
    this.player.state = { type: PlayerStateType.Idle }
    console.log('idle');
  }

  exit() {}

  update() {}
}
