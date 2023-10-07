import { IField, IPlayer } from 'game-api'

export class PlayerWallCollider {
  public checkWallCollision(
    players: IPlayer[],
    field: IField,
    deltaTime: number
  ) {
    for (const player of players) {
      const newX = player.x + player.velocityX * deltaTime
      const newY = player.y + player.velocityY * deltaTime

      if (newX - player.radius < 0) {
        player.x = player.radius
      } else if (newX + player.radius > field.width) {
        player.x = field.width - player.radius
      } else {
        player.x = newX
      }

      if (newY - player.radius < 0) {
        player.y = player.radius
      } else if (newY + player.radius > field.height) {
        player.y = field.height - player.radius
      } else {
        player.y = newY
      }
    }
  }
}
