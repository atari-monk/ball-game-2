import { IBall } from '../api/IBall'
import { IPlayer } from '../api/player/IPlayer'
import { BallDto } from './BallDto'
import { PlayerDto } from './PlayerDto'

export class MatchDto {
  players: PlayerDto[]
  ball: BallDto

  constructor(players: IPlayer[], ball: IBall) {
    this.players = players.map((player) => new PlayerDto(player))
    this.ball = new BallDto(ball)
  }
}
