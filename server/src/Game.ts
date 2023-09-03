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
  team: Team | null
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

interface Gate {
  x: number
  y: number
  width: number
  height: number
}

interface Team {
  name: string
  color: string
  playerIds: string[]
}

interface Message {
  sender: string
  text: string
}

interface Match {
  matchDuration: number
  matchStartTime: number | null
}

export class Game implements Match {
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
  gates: {
    left: Gate
    right: Gate
  }
  teams: Team[] = [
    { name: 'Team A', color: 'red', playerIds: [] },
    { name: 'Team B', color: 'blue', playerIds: [] },
  ]
  messages: Message[] = []
  matchDuration: number = 5 * 60 * 1000 // 5 minutes in milliseconds
  matchStartTime: number | null = null

  constructor() {
    this.gates = {
      left: {
        x: 0,
        y: this.field.height / 2 - 50, // Adjust position as needed
        width: 10,
        height: 100,
      },
      right: {
        x: this.field.width - 10, // Adjust position as needed
        y: this.field.height / 2 - 50, // Adjust position as needed
        width: 10,
        height: 100,
      },
    }
  }

  sendServerMessage(sender: string, messageText: string) {
    const message: Message = {
      sender,
      text: messageText,
    }

    // Add the message to the game state
    this.messages.push(message)
  }

  checkGateCollision() {
    // Check if the ball hits the left gate
    if (
      this.ball.x >= this.gates.left.x &&
      this.ball.x <= this.gates.left.x + this.gates.left.width &&
      this.ball.y >= this.gates.left.y &&
      this.ball.y <= this.gates.left.y + this.gates.left.height
    ) {
      console.log('Ball hit the left gate')
      // Handle left gate collision here
    }

    // Check if the ball hits the right gate
    if (
      this.ball.x >= this.gates.right.x &&
      this.ball.x <= this.gates.right.x + this.gates.right.width &&
      this.ball.y >= this.gates.right.y &&
      this.ball.y <= this.gates.right.y + this.gates.right.height
    ) {
      console.log('Ball hit the right gate')
      // Handle right gate collision here
    }
  }

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
      maxSpeed: 0.3,
      team: null,
    }
    this.assignPlayerToTeam(newPlayer)

    this.players.push(newPlayer)

    this.sendServerMessage('server', `Player ${newPlayer.id} connected.`)

    if (this.matchStartTime === null && this.players.length === 2) {
      // Start the match timer when there are two players
      this.matchStartTime = Date.now()
      this.sendServerMessage(
        'server',
        `Game starts at ${new Date(this.matchStartTime)}`
      )
    }

    return newPlayer
  }

  assignPlayerToTeam(player: Player) {
    if (player.team === null) {
      // Find the team with fewer players
      const teamA = this.teams[0]
      const teamB = this.teams[1]

      // Choose the team with fewer players
      const selectedTeam =
        teamA.playerIds.length <= teamB.playerIds.length ? teamA : teamB

      // Assign the player to the selected team
      player.team = selectedTeam
      // Add the player's ID to the team's list of player IDs
      selectedTeam.playerIds.push(player.id)
    }
  }

  update(deltaTime: number) {
    // Calculate the remaining time if the match has started
    if (this.matchStartTime !== null) {
      const currentTime = Date.now()
      const elapsedTime = currentTime - this.matchStartTime
      const remainingTimeMinutes = (this.matchDuration - elapsedTime) / 60000 // Convert milliseconds to minutes

      // Log the remaining time every minute
      if (elapsedTime % 60000 <= deltaTime && remainingTimeMinutes >= 0) {
        // Check if it's been a minute
        this.sendServerMessage(
          'server',
          `Remaining time: ${remainingTimeMinutes.toFixed(1)} minutes`
        )
      }

      // Check if the match has ended
      if (elapsedTime >= this.matchDuration) {
        this.sendServerMessage('server', 'Match over!')
        this.matchStartTime = null // Add a method to stop the timer when the match is over
      }
    }

    // Update ball position based on its velocity
    this.updateBallPosition(deltaTime)

    // Update player positions based on their velocity
    this.updatePlayerPositions(deltaTime)

    // Check collision with players
    this.checkPlayerBallCollision()

    for (const player of this.players) {
      // Check collision with walls
      this.checkWallCollision(player, deltaTime)
    }

    this.checkWallCollisionForBall()

    this.checkGateCollision()
  }

  updateBallPosition(deltaTime: number) {
    // Calculate the displacement based on velocity and deltaTime
    const displacementX = this.ball.velocityX * deltaTime
    const displacementY = this.ball.velocityY * deltaTime

    // Update the ball's position
    this.ball.x += displacementX
    this.ball.y += displacementY
  }

  updatePlayerPositions(deltaTime: number) {
    for (const player of this.players) {
      const speed = player.speed
      player.velocityX = speed * Math.cos(player.direction)
      player.velocityY = speed * Math.sin(player.direction)

      // Calculate the displacement based on velocity and deltaTime
      const displacementX = player.velocityX * deltaTime
      const displacementY = player.velocityY * deltaTime

      // Update the player's position
      player.x += displacementX
      player.y += displacementY
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
          }, 1000)
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

  checkWallCollision(player: Player, deltaTime: number) {
    const newX = player.x + player.velocityX * deltaTime
    const newY = player.y + player.velocityY * deltaTime
    let directionChanged = false

    if (newX - player.radius < 0 || newX + player.radius > this.field.width) {
      this.adjustHorizontalWallCollision(player, newX)
      directionChanged = true
    }

    if (newY - player.radius < 0 || newY + player.radius > this.field.height) {
      this.adjustVerticalWallCollision(player, newY)
      directionChanged = true
    }
    
    if (directionChanged) {
      this.normalizePlayerDirection(player)
    }
  }

  checkWallCollisionForBall() {
    const newX = this.ball.x + this.ball.velocityX
    const newY = this.ball.y + this.ball.velocityY

    // Check if the ball hits the left or right wall
    if (
      newX - this.ball.radius < 0 ||
      newX + this.ball.radius > this.field.width
    ) {
      // Reverse the ball's horizontal velocity
      this.ball.velocityX *= -1

      // Move the ball slightly away from the wall to prevent re-collision
      if (newX - this.ball.radius < 0) {
        this.ball.x = this.ball.radius // Adjust this value as needed
      } else {
        this.ball.x = this.field.width - this.ball.radius // Adjust this value as needed
      }
    }

    // Check if the ball hits the top or bottom wall
    if (
      newY - this.ball.radius < 0 ||
      newY + this.ball.radius > this.field.height
    ) {
      // Reverse the ball's vertical velocity
      this.ball.velocityY *= -1

      // Move the ball slightly away from the wall to prevent re-collision
      if (newY - this.ball.radius < 0) {
        this.ball.y = this.ball.radius // Adjust this value as needed
      } else {
        this.ball.y = this.field.height - this.ball.radius // Adjust this value as needed
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
