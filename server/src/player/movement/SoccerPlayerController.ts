import { IPlayerModel } from 'api'
import { IPlayerController } from './IPlayerController'

export class SoccerPlayerController implements IPlayerController {
  constructor(private readonly player: IPlayerModel) {}

  update(deltaTime: number) {
    const p = this.player
    this.computePosition(p, deltaTime)
    p.velocityX *= .9
    p.velocityY *= .9
  }

  private computePosition(p: IPlayerModel, deltaTime: number) {
    p.x += p.velocityX * deltaTime
    p.y += p.velocityY * deltaTime
  }

  onLeft(): void {
    const p = this.player
    p.velocityX = -0.1
  }

  onRight(): void {
    const p = this.player
    p.velocityX = 0.1
  }

  onUp(): void {
    const p = this.player
    p.velocityY = -0.1
  }

  onDown(): void {
    const p = this.player
    p.velocityY = 0.1
  }
}
