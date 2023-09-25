import { IPlayerModel } from 'api'
import { IPlayerController } from './IPlayerController'

export class SoccerPlayerController implements IPlayerController {
  private readonly speedLevel1: number
  private dt: number

  constructor(private readonly player: IPlayerModel) {
    const p = this.player
    this.speedLevel1 = p.maxSpeedForward / 2
    this.dt = 0
  }

  update(deltaTime: number) {
    this.dt = deltaTime
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
    p.x += p.speed * deltaTime
    //p.y += p.velocityY * deltaTime
  }

  private computePosition2(p: IPlayerModel, deltaTime: number) {
    p.x += p.velocityX * deltaTime
    p.y += p.velocityY * deltaTime
  }

  onLeft(): void {
    const p = this.player
    p.direction = -Math.PI / 2
    this.computePosition2(p, this.dt)
  }

  onRight(): void {
    const p = this.player
    p.direction = Math.PI / 2
    this.computePosition2(p, this.dt)
  }

  onUp(): void {
    const p = this.player
    p.speed = Math.min(p.speed + this.speedLevel1, p.maxSpeedForward)
    //p.direction = 0
  }

  onDown(): void {
    const p = this.player
    if (p.speed > 0) {
      p.speed = 0
    } else if (p.speed === 0) {
      p.speed = p.maxSpeedBackward
    }
    //p.direction = Math.PI
  }
}
