import { IBall, IPlayer } from 'api'

export class Ball implements IBall {
  private constructor(
    public x: number,
    public y: number,
    public velocityX: number,
    public velocityY: number,
    public radius: number,
    public mass: number,
    public lastHit: IPlayer | null
  ) {}

  static create(
    x: number,
    y: number,
    velocityX: number,
    velocityY: number,
    radius: number,
    mass: number,
    lastHit: IPlayer | null
  ): Ball {
    return new Ball(x, y, velocityX, velocityY, radius, mass, lastHit)
  }
}
