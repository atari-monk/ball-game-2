import { Server } from 'socket.io'
import { IPlayerModel, IState } from 'game-api'
import { PlayerStateDto } from 'dtos'
import { PlayerStateType, SocketEvents } from 'shared-api'

export class PlayerIdleState implements IState {
  constructor(
    private readonly player: IPlayerModel,
    private readonly io: Server
  ) {}

  enter() {
    this.player.state = { type: PlayerStateType.Idle }
    this.io.emit(
      SocketEvents.PlayerState,
      new PlayerStateDto(this.player.id, this.player.state)
    )
  }

  exit() {}

  update() {}
}
