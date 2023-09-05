interface Player {
  id: string
  name: string
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
  score: number
  scorePoint(): void
}

interface Ball {
  x: number
  y: number
  velocityX: number
  velocityY: number
  radius: number
  mass: number
  lastHit: Player | null
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
  team: Team
}

interface Team {
  name: string
  color: string
  playerIds: string[]
  score: number
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
  private readonly frictionCoefficient: number = 0.99
  players: Player[] = []
  ball: Ball = {
    x: 400,
    y: 300,
    velocityX: 0,
    velocityY: 0,
    radius: 5,
    mass: 5,
    lastHit: null,
  }
  field: Field = { width: 800, height: 600 }
  gates: {
    left: Gate
    right: Gate
  }
  teams: Team[] = [
    { name: 'Team A', color: 'red', playerIds: [], score: 0 },
    { name: 'Team B', color: 'blue', playerIds: [], score: 0 },
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
        team: this.teams[0],
      },
      right: {
        x: this.field.width - 10, // Adjust position as needed
        y: this.field.height / 2 - 50, // Adjust position as needed
        width: 10,
        height: 100,
        team: this.teams[1],
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
      // Handle left gate collision here
      if (
        this.ball.lastHit &&
        this.ball.lastHit.team?.name !== this.gates.left.team.name
      ) {
        this.pointScored()
      }
    }

    // Check if the ball hits the right gate
    if (
      this.ball.x >= this.gates.right.x &&
      this.ball.x <= this.gates.right.x + this.gates.right.width &&
      this.ball.y >= this.gates.right.y &&
      this.ball.y <= this.gates.right.y + this.gates.right.height
    ) {
      // Handle right gate collision here
      if (
        this.ball.lastHit &&
        this.ball.lastHit.team?.name !== this.gates.right.team.name
      ) {
        this.pointScored()
      }
    }
  }

  positionPlayerInLine(player: Player) {
    if (!player.team) throw 'Player team must be specified at this point!'

    // Find the goalpost of the player's team and the opponent's goalpost
    const playerTeamGoal =
      player.team === this.teams[0] ? this.gates.left : this.gates.right

    // Calculate the horizontal position as the average of ball position and player's team goalpost position
    player.x = (this.ball.x + playerTeamGoal.x) / 2

    // Set the direction angle to be purely horizontal and away from the player's team goalpost
    player.direction = playerTeamGoal.x < this.ball.x ? 0 : Math.PI

    // Calculate vertical spacing based on player radius
    const playerSpacing = 4 * player.radius

    // Calculate vertical position for each player
    const ballVerticalPosition = this.ball.y
    const numPlayers = player.team.playerIds.length
    const playerIndex = player.team.playerIds.indexOf(player.id) + 1
    this.sendServerMessage('server', `playerIndex: ${playerIndex}`)

    // Adjust the vertical position of the first player to match the ball's Y-coordinate
    player.y = ballVerticalPosition

    if (numPlayers > 1) {
      // Calculate the positions for subsequent players
      if (playerIndex % 2 === 0) {
        // If the player index is even, place players only above the first player
        player.y -= (playerIndex / 2) * playerSpacing
      } else {
        // If the player index is odd, place players only below the first player
        player.y += Math.floor(playerIndex / 2) * playerSpacing
      }
    }
  }

  resetGame() {
    // Reset player scores
    for (const player of this.players) {
      player.score = 0
      player.team = null
    }

    // Reset the ball position
    this.ball.x = this.field.width / 2
    this.ball.y = this.field.height / 2
    this.ball.velocityX = 0
    this.ball.velocityY = 0
    this.ball.lastHit = null

    // Reset team scores
    for (const team of this.teams) {
      team.score = 0
      team.playerIds = []
    }

    // Clear messages
    this.messages = []

    // Reset match start time
    this.matchStartTime = null

    // Reassign players to teams and position them
    for (const player of this.players) {
      this.assignPlayerToTeam(player)
      this.positionPlayerInLine(player)
    }
  }

  resetAfterGoal() {
    // Reposition the ball to the center of the field
    this.ball.x = this.field.width / 2
    this.ball.y = this.field.height / 2
    this.ball.velocityX = 0
    this.ball.velocityY = 0
    this.ball.lastHit = null

    for (const player of this.players) {
      this.positionPlayerInLine(player)
    }
  }

  pointScored() {
    this.ball.lastHit?.scorePoint()
    this.sendServerMessage('server', `Player ${this.ball.lastHit?.name} scored`)
    for (const team of this.teams) {
      this.sendServerMessage('server', `${team.name} Score: ${team.score}`)
    }
    this.resetAfterGoal()
  }

  addPlayer(id: string) {
    const newPlayer: Player = {
      id: id,
      name: 'player-' + id.substring(0, 3),
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
      score: 0,
      scorePoint() {
        this.score++
        if (this.team) this.team.score++
      },
    }
    this.assignPlayerToTeam(newPlayer)

    this.players.push(newPlayer)

    this.positionPlayerInLine(newPlayer)

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
    // Apply friction to the ball's velocity
    this.ball.velocityX *= this.frictionCoefficient
    this.ball.velocityY *= this.frictionCoefficient

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

          this.ball.lastHit = player

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
