import { IPlayer } from 'game-api'
import { Ball } from './Ball'

export class BallBuilder {
  private x: number = 0
  private y: number = 0
  private velocityX: number = 0
  private velocityY: number = 0
  private radius: number = 5
  private mass: number = 5
  private lastHit: IPlayer | null = null

  constructor() {}

  withPosition(x: number, y: number): BallBuilder {
    this.x = x
    this.y = y
    return this
  }

  withVelocity(velocityX: number, velocityY: number): BallBuilder {
    this.velocityX = velocityX
    this.velocityY = velocityY
    return this
  }

  withRadius(radius: number): BallBuilder {
    this.radius = radius
    return this
  }

  withMass(mass: number): BallBuilder {
    this.mass = mass
    return this
  }

  withLastHit(lastHit: IPlayer | null): BallBuilder {
    this.lastHit = lastHit
    return this
  }

  build(): Ball {
    return Ball.create(
      this.x,
      this.y,
      this.velocityX,
      this.velocityY,
      this.radius,
      this.mass,
      this.lastHit
    )
  }
}
