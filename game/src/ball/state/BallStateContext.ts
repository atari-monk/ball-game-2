import { Server } from 'socket.io'
import { IBallModel, IState } from 'game-api'
import { BallIdleState } from './BallIdleState'

export class BallStateContext {
  private currentState: IState

  constructor(ball: IBallModel, io: Server) {
    this.currentState = new BallIdleState(ball, io)
  }

  setState(newState: IState): void {
    this.currentState.exit()
    this.currentState = newState
    this.currentState.enter()
  }
}
