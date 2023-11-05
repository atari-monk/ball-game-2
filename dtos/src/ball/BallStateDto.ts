import { BallState } from 'shared-api'

export class BallStateDto {
  state: BallState

  constructor(state: BallState) {
    this.state = state
  }
}
