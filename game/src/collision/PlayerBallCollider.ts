import { IBall, IPlayer } from 'game-api'
import { Vector2 } from '../utils/Vector2'

export class PlayerBallCollider {
  //coefficient of restitution (COR) for a soccer ball
  private ballCOR: number = 0.7

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

    const adjustedOverlap = overlap * 1.1

    ball.x += collisionVectorX * adjustedOverlap
    ball.y += collisionVectorY * adjustedOverlap
  }

  private handleCollision(player: IPlayer, ball: IBall) {
    const playerVelocity = new Vector2(player.velocityX, player.velocityY)
    const ballVelocity = new Vector2(ball.velocityX, ball.velocityY)

    const relativeVelocity = ballVelocity.subtract(playerVelocity)

    const playerMassFactor = (2 * ball.mass) / (player.mass + ball.mass)
    const ballMassFactor = (2 * player.mass) / (player.mass + ball.mass)

    const newPlayerVelocity = playerVelocity
      .add(relativeVelocity.multiply(playerMassFactor))
      .multiply(this.ballCOR)

    const newBallVelocity = ballVelocity
      .subtract(relativeVelocity.multiply(ballMassFactor))
      .multiply(this.ballCOR)

    player.velocityX = newPlayerVelocity.x
    player.velocityY = newPlayerVelocity.y
    ball.velocityX = newBallVelocity.x
    ball.velocityY = newBallVelocity.y
  }
}
