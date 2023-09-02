interface Player {
  id: string
  x: number
  y: number
  velocityX: number
  velocityY: number
  radius: number
  collisionDisabled: boolean
  mass: number
  direction: number
  speed: number
  maxSpeed: number
}

interface Ball {
  x: number
  y: number
  velocityX: number
  velocityY: number
  radius: number
  mass: number
}

interface Field {
  width: number
  height: number
}

export class Game {
  players: Player[] = []
  ball: Ball = {
    x: 400,
    y: 300,
    velocityX: 0,
    velocityY: 0,
    radius: 5,
    mass: 5,
  }
  field: Field = { width: 800, height: 600 }

  constructor() {}

  addPlayer(id: string) {
    const newPlayer: Player = {
      id: id,
      x: Math.random() * 800, // Initialize player's position randomly
      y: Math.random() * 600,
      radius: 20,
      collisionDisabled: false,
      mass: 20,
      velocityX: 0,
      velocityY: 0,
      direction: 0,
      speed: 0,
      maxSpeed: 10,
    }
    this.players.push(newPlayer)
    return newPlayer
  }

  update() {
    // Update ball position based on its velocity
    this.updateBallPosition()

    // Update player positions based on their velocity
    this.updatePlayerPositions()

    // Check collision with players
    this.checkPlayerBallCollision()

    // Check collision with walls
    this.checkWallCollision()
  }

  updateBallPosition() {
    this.ball.x += this.ball.velocityX
    this.ball.y += this.ball.velocityY
  }

  updatePlayerPositions() {
    for (const player of this.players) {
      const speed = player.speed
      player.velocityX = speed * Math.cos(player.direction)
      player.velocityY = speed * Math.sin(player.direction)

      player.x += player.velocityX
      player.y += player.velocityY
    }
  }

  checkPlayerBallCollision() {
    for (const player of this.players) {
      if (!player.collisionDisabled) {
        const dx = this.ball.x - player.x
        const dy = this.ball.y - player.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < player.radius + this.ball.radius) {
          this.handleCollision(player, this.ball)

          player.collisionDisabled = true
          setTimeout(() => {
            player.collisionDisabled = false
          }, 2000)
        }
      }
    }
  }

  handleCollision(player: Player, ball: Ball) {
    const mass1 = player.mass
    const mass2 = ball.mass
    const v1x = player.velocityX
    const v1y = player.velocityY
    const v2x = ball.velocityX
    const v2y = ball.velocityY

    // Calculate new velocities using conservation of momentum and kinetic energy
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

    // Update the velocities of the player and the ball
    player.velocityX = newV1x
    player.velocityY = newV1y
    ball.velocityX = newV2x
    ball.velocityY = newV2y
  }

  checkWallCollision() {
    for (const player of this.players) {
      const newX = player.x + player.velocityX
      const newY = player.y + player.velocityY

      let directionChanged = false

      if (newX - player.radius < 0 || newX + player.radius > this.field.width) {
        this.adjustHorizontalWallCollision(player, newX)

        directionChanged = true
      }

      if (
        newY - player.radius < 0 ||
        newY + player.radius > this.field.height
      ) {
        this.adjustVerticalWallCollision(player, newY)

        directionChanged = true
      }

      if (directionChanged) {
        this.normalizePlayerDirection(player)
      }
    }
  }

  adjustHorizontalWallCollision(player: Player, newX: number) {
    if (newX - player.radius < 0) {
      player.x = player.radius
    } else {
      player.x = this.field.width - player.radius
    }

    player.direction = Math.PI - player.direction
  }

  adjustVerticalWallCollision(player: Player, newY: number) {
    if (newY - player.radius < 0) {
      player.y = player.radius
    } else {
      player.y = this.field.height - player.radius
    }

    player.direction = -player.direction
  }

  normalizePlayerDirection(player: Player) {
    const length = Math.sqrt(
      player.velocityX * player.velocityX + player.velocityY * player.velocityY
    )

    player.velocityX /= length
    player.velocityY /= length
  }
}
