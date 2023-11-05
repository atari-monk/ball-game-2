import { Server } from 'socket.io'
import { IBall, IPlayer } from 'game-api'
import { Ball } from './Ball'

export class BallBuilder {
  private _ball: IBall

  constructor(io: Server) {
    this._ball = new Ball(io)
  }

  withPosition(x: number, y: number): BallBuilder {
    this._ball.x = x
    this._ball.y = y
    return this
  }

  withVelocity(velocityX: number, velocityY: number): BallBuilder {
    this._ball.velocityX = velocityX
    this._ball.velocityY = velocityY
    return this
  }

  withRadius(radius: number): BallBuilder {
    this._ball.radius = radius
    return this
  }

  withMass(mass: number): BallBuilder {
    this._ball.mass = mass
    return this
  }

  withLastHit(lastHit: IPlayer | null): BallBuilder {
    this._ball.lastHit = lastHit
    return this
  }

  build(): IBall {
    return this._ball
  }
}
