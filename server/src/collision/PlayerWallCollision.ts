import { IField, IPlayer } from 'api'

export class PlayerWallCollision {
  public checkWallCollision(
    players: IPlayer[],
    field: IField,
    deltaTime: number
  ) {
    for (const player of players) {
      const newX = player.x + player.velocityX * deltaTime
      const newY = player.y + player.velocityY * deltaTime
      let directionChanged = false

      if (newX - player.radius < 0 || newX + player.radius > field.width) {
        this.adjustHorizontalWallCollision(player, field, newX)
        directionChanged = true
      }

      if (newY - player.radius < 0 || newY + player.radius > field.height) {
        this.adjustVerticalWallCollision(player, field, newY)
        directionChanged = true
      }

      if (directionChanged) {
        this.normalizePlayerDirection(player)
      }
    }
  }

  private adjustHorizontalWallCollision(
    player: IPlayer,
    field: IField,
    newX: number
  ) {
    if (newX - player.radius < 0) {
      player.x = player.radius
    } else {
      player.x = field.width - player.radius
    }

    player.direction = Math.PI - player.direction
  }

  private adjustVerticalWallCollision(
    player: IPlayer,
    field: IField,
    newY: number
  ) {
    if (newY - player.radius < 0) {
      player.y = player.radius
    } else {
      player.y = field.height - player.radius
    }

    player.direction = -player.direction
  }

  private normalizePlayerDirection(player: IPlayer) {
    const length = Math.sqrt(
      player.velocityX * player.velocityX + player.velocityY * player.velocityY
    )

    player.velocityX /= length
    player.velocityY /= length
  }
}
