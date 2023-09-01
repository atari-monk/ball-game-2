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
    this.ball.x += this.ball.velocityX
    this.ball.y += this.ball.velocityY

    for (const player of this.players) {
      const speed = player.speed
      player.velocityX = speed * Math.cos(player.direction)
      player.velocityY = speed * Math.sin(player.direction)

      // Update player positions based on their velocity
      player.x += player.velocityX
      player.y += player.velocityY
    }

    // Check collision with players
    for (const player of this.players) {
      // Check if collision detection is enabled for this player
      if (!player.collisionDisabled) {
        const dx = this.ball.x - player.x
        const dy = this.ball.y - player.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        // Assuming players and ball have a radius property
        if (distance < player.radius + this.ball.radius) {
          // Collision detected; handle the collision here
          // For example, reverse the ball's direction and give it some speed
          this.handleCollision(player, this.ball)
          console.log('ball:', this.ball)
          // Disable collision detection for this player
          player.collisionDisabled = true
          setTimeout(() => {
            player.collisionDisabled = false // Re-enable after a delay
          }, 2000) // Adjust the delay as needed
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
}
