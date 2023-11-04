import { IState } from 'game-api'
import { BallModel } from './BallModel'
import { IdleState } from './state/IdleState'
import { BallRenderer } from './BallRenderer'
import { CanvasDrawer } from '../canvas/CanvasDrawer'
import { AnimationConfig } from 'client-api'

export class BallStateContext extends BallModel {
  private currentState: IState
  renderer?: BallRenderer

  constructor() {
    super()
    this.currentState = new IdleState(this)
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
    this.renderer = new BallRenderer(drawer, animations)
  }
}
