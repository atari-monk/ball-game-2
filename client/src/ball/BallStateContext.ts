import { IState } from 'game-api'
import { BallModel } from './BallModel'
import { BallIdleState } from './state/BallIdleState'
import { BallRenderer } from './BallRenderer'
import { CanvasDrawer } from '../canvas/CanvasDrawer'
import { AnimationConfig } from 'client-api'

export class BallStateContext extends BallModel {
  private currentState: IState
  renderer?: BallRenderer

  constructor() {
    super()
    this.currentState = new BallIdleState(this)
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
