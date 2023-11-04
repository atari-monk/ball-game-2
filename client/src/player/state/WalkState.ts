import { IState } from 'game-api'
import { PlayerStateContext } from '../PlayerStateContext'
import { PlayerStateType } from 'shared-api'

export class WalkState implements IState {
  constructor(private readonly player: PlayerStateContext) {}

  enter() {
    this.player.state = { type: PlayerStateType.Walk }
    this.player.renderer?.switchAnimation(1)
  }

  exit() {}

  update() {}
}
