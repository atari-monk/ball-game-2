import { IBallAction } from 'game-api'
import { BallModel } from './BallModel'
import { BallStateType } from 'shared-api'
import { BallRotateState } from './state/BallRotateState'
import { BallIdleState } from './state/BallIdleState'

export class BallAction extends BallModel implements IBallAction {
  private readonly frictionCoefficient: number = 0.985
  private readonly deltaThreshold: number = 0.05

  update(deltaTime: number): void {
    this.velocityX *= this.frictionCoefficient
    this.velocityY *= this.frictionCoefficient

    this.x += this.velocityX * deltaTime
    this.y += this.velocityY * deltaTime

    const ballStoped =
      Math.abs(this.velocityX) < this.deltaThreshold &&
      Math.abs(this.velocityY) < this.deltaThreshold

    if (this.state.type === BallStateType.Idle && !ballStoped) {
      this.switchToRotateState()
    } else if (this.state.type === BallStateType.Rotate && ballStoped) {
      this.velocityX = 0
      this.velocityY = 0
      this.switchToIdleState()
    }
  }

  private switchToRotateState() {
    if (this.state.type !== BallStateType.Rotate)
      this.stateContext.setState(new BallRotateState(this, this.io))
  }

  private switchToIdleState() {
    if (this.state.type !== BallStateType.Idle)
      this.stateContext.setState(new BallIdleState(this, this.io))
  }
}
