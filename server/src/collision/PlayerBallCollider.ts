import { IBall, IPlayer } from 'api'
import { Vector2 } from '../utils/Vector2'

export class PlayerBallCollider {
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

  private handleCollision(player: IPlayer, ball: IBall, e: number = 0.9) {
    const playerVelocity = new Vector2(player.velocityX, player.velocityY)
    const ballVelocity = new Vector2(ball.velocityX, ball.velocityY)

    const relativeVelocity = ballVelocity.subtract(playerVelocity)

    const playerMassFactor = (2 * ball.mass) / (player.mass + ball.mass)
    const ballMassFactor = (2 * player.mass) / (player.mass + ball.mass)

    const newPlayerVelocity = playerVelocity
      .add(relativeVelocity.multiply(playerMassFactor))
      .multiply(e)

    const newBallVelocity = ballVelocity
      .subtract(relativeVelocity.multiply(ballMassFactor))
      .multiply(e)

    player.velocityX = newPlayerVelocity.x
    player.velocityY = newPlayerVelocity.y
    ball.velocityX = newBallVelocity.x
    ball.velocityY = newBallVelocity.y
  }
}
