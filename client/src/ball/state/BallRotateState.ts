import { IState } from 'game-api'
import { BallStateContext } from '../BallStateContext'
import { BallStateType } from 'shared-api'

export class BallRotateState implements IState {
  constructor(private readonly ball: BallStateContext) {}

  enter() {
    this.ball.state = { type: BallStateType.Rotate }
    this.ball.renderer?.switchAnimation(1)
  }

  exit() {}

  update() {}
}
