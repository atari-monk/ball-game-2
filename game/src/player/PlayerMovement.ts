import { Server } from 'socket.io'
import { PlayerAction } from './PlayerAction'
import { IPlayerController } from './movement/IPlayerController'
import { SoccerPlayerController } from './movement/SoccerPlayerController'
import { WalkState } from './state/WalkState'
import { IPlayerMovement } from 'game-api'
import { IdleState } from './state/IdleState'
import { PlayerStateType } from 'shared-api'

export class PlayerMovement extends PlayerAction implements IPlayerMovement {
  private controller: IPlayerController = new SoccerPlayerController(this)

  constructor(io: Server) {
    super(io)
  }

  onUp(): void {
    this.controller.onUp()
    this.switchToWalkState()
  }

  private switchToWalkState() {
    if (this.state.type !== PlayerStateType.Walk)
      this.stateContext.setState(new WalkState(this, this.io))
  }

  onDown(): void {
    this.controller.onDown()
    this.switchToWalkState()
  }

  onLeft(): void {
    this.controller.onLeft()
    this.switchToWalkState()
  }

  onRight(): void {
    this.controller.onRight()
    this.switchToWalkState()
  }

  onInactive(): void {
    this.controller.onInactive()
    this.switchToIdleState()
  }

  private switchToIdleState() {
    if (this.state.type !== PlayerStateType.Idle)
      this.stateContext.setState(new IdleState(this, this.io))
  }

  update(deltaTime: number) {
    this.controller.update(deltaTime)
  }
}
