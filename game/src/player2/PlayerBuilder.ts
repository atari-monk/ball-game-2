import { Server } from 'socket.io'
import { IPlayer, ITeam } from 'game-api'
import { Player } from './Player'

export class PlayerBuilder {
  private _player: IPlayer

  constructor(io: Server) {
    this._player = new Player(io)
  }

  withId(id: string): PlayerBuilder {
    this._player.id = id
    return this
  }

  withName(name: string): PlayerBuilder {
    this._player.name = name
    return this
  }

  withPosition(x: number, y: number): PlayerBuilder {
    this._player.x = x
    this._player.y = y
    return this
  }

  withVelocity(velocityX: number, velocityY: number): PlayerBuilder {
    this._player.velocityX = velocityX
    this._player.velocityY = velocityY
    return this
  }

  withRadius(radius: number): PlayerBuilder {
    this._player.radius = radius
    return this
  }

  withCollisionDisabled(collisionDisabled: boolean): PlayerBuilder {
    this._player.collisionDisabled = collisionDisabled
    return this
  }

  withMass(mass: number): PlayerBuilder {
    this._player.mass = mass
    return this
  }

  withDirection(direction: number): PlayerBuilder {
    this._player.direction = direction
    return this
  }

  withSpeed(speed: number): PlayerBuilder {
    this._player.speed = speed
    return this
  }

  withMaxSpeedForward(maxSpeedForward: number): PlayerBuilder {
    this._player.maxSpeedForward = maxSpeedForward
    return this
  }

  withMaxSpeedBackward(maxSpeedBackward: number): PlayerBuilder {
    this._player.maxSpeedBackward = maxSpeedBackward
    return this
  }

  withTurnSpeed(turnSpeed: number): PlayerBuilder {
    this._player.turnSpeed = turnSpeed
    return this
  }

  withTeam(team: ITeam | null): PlayerBuilder {
    this._player.team = team
    return this
  }

  withScore(score: number): PlayerBuilder {
    this._player.score = score
    return this
  }

  build(): IPlayer {
    return this._player
  }
}
