import { IBall } from "./IBall"
import { IPlayer } from "./IPlayer"

export class MatchDto {
  players: IPlayer[]
  ball: IBall

  constructor(players: IPlayer[], ball: IBall) {
    this.players = players
    this.ball = ball
  }
}
