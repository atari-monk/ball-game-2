import { IState } from 'game-api'
import { PlayerModel } from './PlayerModel'
import { PlayerIdleState } from './state/PlayerIdleState'
import { PlayerRenderer } from './PlayerRenderer'
import { CanvasDrawer } from '../canvas/CanvasDrawer'
import { AnimationConfig } from 'client-api'

export class PlayerStateContext extends PlayerModel {
  private currentState: IState
  renderer?: PlayerRenderer

  constructor() {
    super()
    this.currentState = new PlayerIdleState(this)
    this.currentState.enter()
  }

  setState(newState: IState): void {
    this.currentState.exit()
    this.currentState = newState
    this.currentState.enter()
  }

  render(dt: number) {
    this.renderer?.update(dt)
    this.renderer?.draw(this)
  }

  createRenderer(drawer: CanvasDrawer, animations: AnimationConfig[]) {
    this.renderer = new PlayerRenderer(drawer, animations)
  }
}
