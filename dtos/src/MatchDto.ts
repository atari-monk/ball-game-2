import { IBall, IPlayer } from 'game-api'
import { BallDto } from './BallDto'
import { PlayerDto } from './player/PlayerDto'

export class MatchDto {
  players: PlayerDto[]
  ball: BallDto
  dt: number

  constructor(players: IPlayer[], ball: IBall, dt: number) {
    this.players = players.map((player) => new PlayerDto(player))
    this.ball = new BallDto(ball)
    this.dt = dt
  }
}
