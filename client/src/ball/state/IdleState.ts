import { IState } from 'game-api'
import { BallStateContext } from '../BallStateContext'
import { BallStateType } from 'shared-api'

export class IdleState implements IState {
  constructor(private readonly ball: BallStateContext) {}

  enter() {
    this.ball.state = { type: BallStateType.Idle }
    this.ball.renderer?.switchAnimation(0)
  }

  exit() {}

  update() {}
}
