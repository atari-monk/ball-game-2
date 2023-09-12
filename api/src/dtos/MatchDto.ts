import { IBall } from '../api/IBall'
import { IPlayerModel } from '../api/IPlayerModel'
import { BallDto } from './BallDto'
import { PlayerDto } from './PlayerDto'

export class MatchDto {
  players: PlayerDto[]
  ball: BallDto

  constructor(players: IPlayerModel[], ball: IBall) {
    this.players = players.map((player) => new PlayerDto(player))
    this.ball = new BallDto(ball)
  }
}
