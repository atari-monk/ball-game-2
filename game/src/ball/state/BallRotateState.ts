import { Server } from 'socket.io'
import { IBallModel, IState } from 'game-api'
import { BallStateDto } from 'dtos'
import { BallStateType, SocketEvents } from 'shared-api'

export class BallRotateState implements IState {
  constructor(private readonly ball: IBallModel, private readonly io: Server) {}

  enter() {
    this.ball.state = { type: BallStateType.Rotate }
    this.io.emit(SocketEvents.BallState, new BallStateDto(this.ball.state))
  }

  exit() {}

  update() {}
}
