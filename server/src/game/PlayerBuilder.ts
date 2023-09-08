import { IPlayer, ITeam } from 'api'
import { Player } from './Player'

export class PlayerBuilder {
  private x = 0
  private y = 0
  private velocityX = 0
  private velocityY = 0
  private radius = 20
  private collisionDisabled = false
  private mass = 20
  private direction = 0
  private speed = 0.3
  private maxSpeed = 0
  private team: ITeam | null = null
  private score = 0

  constructor(private readonly id: string, private readonly name: string) {}

  withPosition(x: number, y: number): PlayerBuilder {
    this.x = x
    this.y = y
    return this
  }

  withVelocity(velocityX: number, velocityY: number): PlayerBuilder {
    this.velocityX = velocityX
    this.velocityY = velocityY
    return this
  }

  withRadius(radius: number): PlayerBuilder {
    this.radius = radius
    return this
  }

  withCollisionDisabled(collisionDisabled: boolean): PlayerBuilder {
    this.collisionDisabled = collisionDisabled
    return this
  }

  withMass(mass: number): PlayerBuilder {
    this.mass = mass
    return this
  }

  withDirection(direction: number): PlayerBuilder {
    this.direction = direction
    return this
  }

  withSpeed(speed: number): PlayerBuilder {
    this.speed = speed
    return this
  }

  withMaxSpeed(maxSpeed: number): PlayerBuilder {
    this.maxSpeed = maxSpeed
    return this
  }

  withTeam(team: ITeam | null): PlayerBuilder {
    this.team = team
    return this
  }

  withScore(score: number): PlayerBuilder {
    this.score = score
    return this
  }

  build(): IPlayer {
    return Player.create(
      this.id,
      this.name,
      this.x,
      this.y,
      this.velocityX,
      this.velocityY,
      this.radius,
      this.collisionDisabled,
      this.mass,
      this.direction,
      this.speed,
      this.maxSpeed,
      this.team,
      this.score
    )
  }
}
