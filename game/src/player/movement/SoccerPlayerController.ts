import { IPlayerModel } from 'game-api'
import { IPlayerController } from './IPlayerController'

export class SoccerPlayerController implements IPlayerController {
  private p: IPlayerModel

  constructor(player: IPlayerModel) {
    this.p = player
  }

  update(deltaTime: number) {
    this.computeDirection(this.p)
    this.computePosition(this.p, deltaTime)
  }

  private computeDirection(p: IPlayerModel) {
    p.directionX = p.x + p.radius * Math.cos(p.direction)
    p.directionY = p.y + p.radius * Math.sin(p.direction)
  }

  private computePosition(p: IPlayerModel, deltaTime: number) {
    p.x += p.velocityX * deltaTime
    p.y += p.velocityY * deltaTime
  }

  onLeft(): void {
    this.p.velocityX = -0.04
  }

  onRight(): void {
    this.p.velocityX = 0.04
  }

  onUp(): void {
    this.p.velocityY = -0.04
  }

  onDown(): void {
    this.p.velocityY = 0.04
  }

  onInactive(): void {
    this.p.velocityX = 0
    this.p.velocityY = 0
  }
}
