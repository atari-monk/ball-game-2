import { IBall } from '../api/IBall'

export class BallDto {
  x: number
  y: number
  radius: number
  mass: number

  constructor(ball: IBall) {
    this.x = ball.x
    this.y = ball.y
    this.radius = ball.radius
    this.mass = ball.mass
  }
}
