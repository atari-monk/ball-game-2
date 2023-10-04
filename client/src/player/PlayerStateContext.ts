import { IPlayerState } from 'game-api'
import { PlayerModel } from './PlayerModel'
import { IdleState } from './state/IdleState'
import { PlayerRenderer } from './PlayerRenderer'
import { CanvasDrawer } from '../canvas/CanvasDrawer'
import { AnimationConfig } from 'client-api'

export class PlayerStateContext extends PlayerModel {
  private currentState: IPlayerState
  renderer?: PlayerRenderer

  constructor() {
    super()
    this.currentState = new IdleState(this)
    this.currentState.enter()
  }

  setState(newState: IPlayerState): void {
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
