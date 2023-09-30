import { Server } from 'socket.io'
import { IPlayer, IPlayerState, PlayerStateType } from 'game-api'
import { PlayerStateDto } from 'dtos'
import { ServerOutEvents } from './ServerOutEvents'

export class IdleState implements IPlayerState {
  constructor(private readonly player: IPlayer, private readonly io: Server) {}

  enter() {
    this.player.state = { type: PlayerStateType.Idle }
    this.io.emit(
      ServerOutEvents.PlayerState,
      new PlayerStateDto(this.player.id, this.player.state)
    )
  }

  exit() {}

  update() {}
}
