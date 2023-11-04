import { AnimationConfig } from 'client-api'
import { CanvasDrawer } from '../canvas/CanvasDrawer'
import { SpriteAnimator } from '../sprite/SpriteAnimator'
import { BallModel } from './BallModel'

export class BallRenderer {
  private sprite: SpriteAnimator

  constructor(
    private readonly canvasDrawer: CanvasDrawer,
    animations: AnimationConfig[]
  ) {
    this.sprite = new SpriteAnimator(animations)
  }

  update(deltaTime: number) {
    this.sprite.update(deltaTime)
  }

  draw(ball: BallModel) {
    const b = ball.moveDto
    if (!b) return
    this.sprite.draw(this.canvasDrawer.cctx, b.x, b.y)

    
  }

  switchAnimation(animationIndex: number) {
    this.sprite.switchAnimation(animationIndex)
  }
}
