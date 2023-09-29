import { IPlayerModel } from 'game-api'
import { IPlayerController } from './IPlayerController'

export class PrimitiveController implements IPlayerController {
  constructor(private readonly player: IPlayerModel) {
    player.speed = 10
  }

  update(deltaTime: number): void {}

  onLeft(): void {
    const p = this.player
    p.x -= p.speed // Adjust 'speed' as needed
  }

  onRight(): void {
    const p = this.player
    p.x += p.speed // Adjust 'speed' as needed
  }

  onUp(): void {
    const p = this.player
    p.y -= p.speed // Adjust 'speed' as needed
  }

  onDown(): void {
    const p = this.player
    p.y += p.speed // Adjust 'speed' as needed
  }

  onInactive(): void {
      
  }
}
