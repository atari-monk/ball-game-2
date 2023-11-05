import { IBall, IPlayer } from 'game-api'
import { BallDto } from './ball/BallDto'
import { PlayerDto } from './player/PlayerDto'

export class MatchDto {
  players: PlayerDto[]
  ball: BallDto
  dt: number

  constructor(players: IPlayer[], ball: IBall, dt: number) {
    this.players = players.map(
      (player) =>
        new PlayerDto(
          player.id,
          player.x,
          player.y,
          player.radius,
          player.directionX,
          player.directionY
        )
    )
    this.ball = new BallDto(ball)
    this.dt = dt
  }
}
