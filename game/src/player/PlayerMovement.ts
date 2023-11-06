import { Server } from 'socket.io'
import { PlayerAction } from './PlayerAction'
import { PlayerWalkState } from './state/PlayerWalkState'
import { IPlayerMovement } from 'game-api'
import { PlayerIdleState } from './state/PlayerIdleState'
import { PlayerStateType } from 'shared-api'

export class PlayerMovement extends PlayerAction implements IPlayerMovement {
  constructor(io: Server) {
    super(io)
  }

  onUp(): void {
    this.controller.onUp()
    this.switchToWalkState()
  }

  private switchToWalkState() {
    if (this.state.type !== PlayerStateType.Walk)
      this.stateContext.setState(new PlayerWalkState(this, this.io))
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
      this.stateContext.setState(new PlayerIdleState(this, this.io))
  }
}
