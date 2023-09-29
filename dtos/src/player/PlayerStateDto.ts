import { IPlayer, PlayerState } from 'game-api'

export class PlayerStateDto {
  id: string
  state: PlayerState

  constructor(player: IPlayer) {
    this.id = player.id
    this.state = player.state
  }
}
