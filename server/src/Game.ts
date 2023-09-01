import { Socket } from 'socket.io'

interface Player {
  id: string
  x: number
  y: number
  radius: number
  collisionDisabled: boolean
}

interface Ball {
  x: number
  y: number
  velocityX: number
  velocityY: number
  radius: number
}

export class Game {
  players: Player[] = []
  ball: Ball = { x: 400, y: 300, velocityX: 0, velocityY: 0, radius: 5 }

  constructor() {}

  addPlayer(id: string) {
    const newPlayer: Player = {
      id: id,
      x: Math.random() * 800, // Initialize player's position randomly
      y: Math.random() * 600,
      radius: 20,
      collisionDisabled: false,
    }
    this.players.push(newPlayer)
    return newPlayer
  }

  update() {
    // Update game state (e.g., player movement, ball physics)
    // Handle collisions and update player/ball positions
    // Update ball position based on its velocity
    this.ball.x += this.ball.velocityX
    this.ball.y += this.ball.velocityY

    // Check collision with players
    for (const player of this.players) {
      const dx = this.ball.x - player.x
      const dy = this.ball.y - player.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      // Assuming players and ball have a radius property
      if (distance < player.radius + this.ball.radius) {
        // Collision detected; handle the collision here
        // For example, reverse the ball's direction
        this.ball.velocityX *= -1
        this.ball.velocityY *= -1
      }
    }
  }
}
