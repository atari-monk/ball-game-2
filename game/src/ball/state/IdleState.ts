import { Server } from 'socket.io'
import { IBallModel, IState } from 'game-api'
import { BallStateDto } from 'dtos'
import { BallStateType, SocketEvents } from 'shared-api'

export class IdleState implements IState {
  constructor(
    private readonly ball: IBallModel,
    private readonly io: Server
  ) {}

  enter() {
    this.ball.state = { type: BallStateType.Idle }
    this.io.emit(
      SocketEvents.PlayerState,
      new BallStateDto(this.ball.state)
    )
  }

  exit() {}

  update() {}
}
