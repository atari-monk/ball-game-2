import { Server } from 'socket.io'
import { IPlayerModel, IPlayerState } from 'game-api'
import { PlayerStateDto } from 'dtos'
import { PlayerStateType, SocketEvents } from 'shared-api'

export class WalkState implements IPlayerState {
  constructor(
    private readonly player: IPlayerModel,
    private readonly io: Server
  ) {}

  enter() {
    this.player.state = { type: PlayerStateType.Walk }
    this.io.emit(
      SocketEvents.PlayerState,
      new PlayerStateDto(this.player.id, this.player.state)
    )
  }

  exit() {}

  update() {}
}
