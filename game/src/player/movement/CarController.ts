import { IPlayerModel } from 'game-api'
import { IPlayerController } from './IPlayerController'

export class CarController implements IPlayerController {
  private readonly speedLevel1: number

  constructor(private readonly player: IPlayerModel) {
    this.speedLevel1 = player.maxSpeedForward / 2
  }

  update(deltaTime: number) {
    const p = this.player
    this.computeDirection(p)
    this.computeVelocity(p)
    this.computePosition(p, deltaTime)
  }

  private computeDirection(p: IPlayerModel) {
    p.directionX = p.x + p.radius * Math.cos(p.direction)
    p.directionY = p.y + p.radius * Math.sin(p.direction)
  }

  private computeVelocity(p: IPlayerModel) {
    p.velocityX = p.speed * Math.cos(p.direction)
    p.velocityY = p.speed * Math.sin(p.direction)
  }

  private computePosition(p: IPlayerModel, deltaTime: number) {
    p.x += p.velocityX * deltaTime
    p.y += p.velocityY * deltaTime
  }

  onUp() {
    const p = this.player
    p.speed = Math.min(p.speed + this.speedLevel1, p.maxSpeedForward)
  }

  onDown(): void {
    const p = this.player
    if (p.speed > 0) {
      p.speed = 0
    } else if (p.speed === 0) {
      p.speed = p.maxSpeedBackward
    }
  }

  onLeft(): void {
    const p = this.player
    p.direction -= p.turnSpeed
  }

  onRight(): void {
    const p = this.player
    p.direction += p.turnSpeed
  }

  onInactive(): void {}
}
