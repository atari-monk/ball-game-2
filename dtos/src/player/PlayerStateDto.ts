import { PlayerState } from 'shared-api'

export class PlayerStateDto {
  id: string
  state: PlayerState

  constructor(id: string, state: PlayerState) {
    this.id = id
    this.state = state
  }
}
