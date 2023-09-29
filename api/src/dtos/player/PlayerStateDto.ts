import { IPlayer } from '../../api/player/IPlayer'
import { PlayerState } from '../../api/player/state/PlayerState'

export class PlayerStateDto {
  id: string
  state: PlayerState

  constructor(player: IPlayer) {
    this.id = player.id
    this.state = player.state
  }
}
