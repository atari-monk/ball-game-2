import { IBall, IPlayer } from 'api'

export class CollisionManager {
  checkPlayerBallCollision(players: IPlayer[], ball: IBall) {
    for (const player of players) {
      const dx = ball.x - player.x
      const dy = ball.y - player.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < player.radius + ball.radius) {
        this.unstickMyBall(player, ball, distance, dx, dy)
        this.handleCollision(player, ball)
        ball.lastHit = player
      }
    }
  }

  private unstickMyBall(
    player: IPlayer,
    ball: IBall,
    distance: number,
    dx: number,
    dy: number
  ) {
    const overlap = player.radius + ball.radius - distance
    const collisionVectorX = dx / distance
    const collisionVectorY = dy / distance
    ball.x += collisionVectorX * overlap
    ball.y += collisionVectorY * overlap
  }

  private handleCollision(player: IPlayer, ball: IBall) {
    const mass1 = player.mass
    const mass2 = ball.mass
    const v1x = player.velocityX
    const v1y = player.velocityY
    const v2x = ball.velocityX
    const v2y = ball.velocityY

    const newV1x =
      ((mass1 - mass2) / (mass1 + mass2)) * v1x +
      ((2 * mass2) / (mass1 + mass2)) * v2x
    const newV1y =
      ((mass1 - mass2) / (mass1 + mass2)) * v1y +
      ((2 * mass2) / (mass1 + mass2)) * v2y
    const newV2x =
      ((2 * mass1) / (mass1 + mass2)) * v1x +
      ((mass2 - mass1) / (mass1 + mass2)) * v2x
    const newV2y =
      ((2 * mass1) / (mass1 + mass2)) * v1y +
      ((mass2 - mass1) / (mass1 + mass2)) * v2y

    player.velocityX = newV1x
    player.velocityY = newV1y
    ball.velocityX = newV2x
    ball.velocityY = newV2y
  }
}
