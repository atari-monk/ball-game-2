import { IBallAction } from 'game-api'
import { BallModel } from './BallModel'

export class BallAction extends BallModel implements IBallAction {
  private readonly frictionCoefficient: number = 0.99

  update(deltaTime: number): void {
    this.velocityX *= this.frictionCoefficient
    this.velocityY *= this.frictionCoefficient

    this.x += this.velocityX * deltaTime
    this.y += this.velocityY * deltaTime
  }
}
