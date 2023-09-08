import { IBall } from './game/IBall'
import { IPlayer } from './game/IPlayer'

export class MatchDto {
  players: IPlayer[]
  ball: IBall

  constructor(players: IPlayer[], ball: IBall) {
    this.players = players
    this.ball = ball
  }
}
