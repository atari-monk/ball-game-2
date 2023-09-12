import { IPlayer, IPlayerBehavior } from 'api'

export class BallPlayer implements IPlayerBehavior {
  constructor(private readonly player: IPlayer) {}

  update(deltaTime: number) {
    const speed = this.player.speed
    this.player.velocityX = speed * Math.cos(this.player.direction)
    this.player.velocityY = speed * Math.sin(this.player.direction)

    const displacementX = this.player.velocityX * deltaTime
    const displacementY = this.player.velocityY * deltaTime

    this.player.x += displacementX
    this.player.y += displacementY
  }

  scorePoint(): void {
    this.player.score++
    if (this.player.team) this.player.team.score++
  }
}
