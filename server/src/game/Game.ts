import { IPlayer, IBall, ITeam } from 'api'
import { BallBuilder } from './BallBuilder'
import { GameState } from './GameState'
import { GateBuilder } from './GateBuilder'
import { IGate } from './IGate'
import { NameGenerator } from './NameGenerator'
import { PlayerBuilder } from './PlayerBuilder'

interface Field {
  width: number
  height: number
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
  private readonly frictionCoefficient: number = 0.995
  players: IPlayer[] = []
  ball: IBall = new BallBuilder()
    .withPosition(400, 300)
    .withVelocity(0, 0)
    .withRadius(5)
    .withMass(5)
    .withLastHit(null)
    .build()
  field: Field = { width: 800, height: 600 }
  gates: {
    left: IGate
    right: IGate
  }
  teams: ITeam[] = [
    { name: '', color: 'red', playerIds: [], score: 0 },
    { name: '', color: 'blue', playerIds: [], score: 0 },
  ]
  messages: Message[] = []
  matchDuration: number = 5 * 60 * 1000 // 5 minutes in milliseconds
  matchStartTime: number | null = null
  private nameGenerator = new NameGenerator()
  private _currentState: GameState

  get CurrentState(): GameState {
    return this._currentState
  }

  constructor() {
    this._currentState = GameState.Creating
    this.sendServerMessage('Creating')
    this.gates = {
      left: new GateBuilder()
        .withPosition(0, this.field.height / 2 - 50)
        .withWidth(5)
        .withHeight(100)
        .withTeam(this.teams[0])
        .build(),
      right: new GateBuilder()
        .withPosition(this.field.width - 5, this.field.height / 2 - 50)
        .withWidth(5)
        .withHeight(100)
        .withTeam(this.teams[1])
        .build(),
    }
    const [teamA, teamB] = this.getRandomAnimalTeams()
    this.teams[0].name = teamA
    this.teams[1].name = teamB
    this.transitionToMatchMaking()
  }

  transitionToMatchMaking() {
    this._currentState = GameState.MatchMaking
    this.sendServerMessage('Match Making')
  }

  transitionToStartGame() {
    this._currentState = GameState.Start
    this.sendServerMessage('Starting Game')
    let timer = 3
    const intervalId = setInterval(() => {
      this.sendServerMessage(`In ${timer}`)
      timer--
      if (timer === 0) {
        clearInterval(intervalId)
        this.transitionToProgress()
      }
    }, 1000)
  }

  transitionToProgress() {
    this._currentState = GameState.Progress
    this.matchStartTime = Date.now()
    this.sendServerMessage(`${this.formatTime(this.matchStartTime)} Begin`)
  }

  getRandomAnimalTeams(): string[] {
    const animalTeams = [
      ['Lions', 'Tigers'],
      ['Eagles', 'Hawks'],
      ['Dolphins', 'Sharks'],
      ['Wolves', 'Bears'],
      ['Penguins', 'Seals'],
      ['Cheetahs', 'Leopards'],
      ['Owls', 'Falcons'],
      ['Elephants', 'Rhinos'],
      ['Kangaroos', 'Koalas'],
      ['Gorillas', 'Chimpanzees'],
    ]

    const randomIndex = Math.floor(Math.random() * animalTeams.length)
    return animalTeams[randomIndex]
  }

  sendServerMessage(messageText: string) {
    const message: Message = {
      sender: '',
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

  positionPlayerInLine(player: IPlayer) {
    if (!player.team) throw 'Player team must be specified at this point!'

    // Find the goalpost of the player's team and the opponent's goalpost
    const playerTeamGoal =
      player.team === this.teams[0] ? this.gates.left : this.gates.right

    // Calculate the horizontal position as the average of ball position and player's team goalpost position
    player.x = (this.field.width / 2 + playerTeamGoal.x) / 2

    // Set the direction angle to be purely horizontal and away from the player's team goalpost
    player.direction = playerTeamGoal.x < this.field.width / 2 ? 0 : Math.PI

    // Calculate vertical spacing based on player radius
    const playerSpacing = 4 * player.radius

    // Calculate vertical position for each player
    const canvasCenterY = this.field.height / 2
    const numPlayers = player.team.playerIds.length
    const playerIndex = player.team.playerIds.indexOf(player.id) + 1

    // Adjust the vertical position of the first player to match the center of the canvas
    player.y = canvasCenterY

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
    this.sendServerMessage(
      `Goal by ${this.ball.lastHit?.name}, ${this.teams[0].name}: ${this.teams[0].score} - ${this.teams[1].name}: ${this.teams[1].score}`
    )
    this.resetAfterGoal()
  }

  addPlayer(id: string) {
    const newPlayer = new PlayerBuilder(
      id,
      this.nameGenerator.getUniqueFunnySingleWordName()
    )
      .withPosition(0, 0)
      .withVelocity(0, 0)
      .withRadius(20)
      .withCollisionDisabled(false)
      .withMass(20)
      .withDirection(0)
      .withSpeed(0)
      .withMaxSpeed(0.3)
      .withTeam(null)
      .withScore(0)
      .build()

    this.assignPlayerToTeam(newPlayer)

    this.players.push(newPlayer)

    this.positionPlayerInLine(newPlayer)

    this.sendServerMessage(
      `${newPlayer.name} joins team ${newPlayer.team?.name}`
    )

    if (this.players.length === 2) {
      this.transitionToStartGame()
    }

    return newPlayer
  }

  formatDateTime(date: Date): string {
    const fdate = new Date(date)
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false, // Use 24-hour time format
    }

    return fdate.toLocaleString('pl-PL', options)
  }

  formatTime(date: number): string {
    const fdate = new Date(date)
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false, // Use 24-hour time format
    }

    return fdate.toLocaleString('pl-PL', options)
  }

  assignPlayerToTeam(player: IPlayer) {
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
          `End in ${remainingTimeMinutes.toFixed(1)} minutes`
        )
      }

      // Check if the match has ended
      if (elapsedTime >= this.matchDuration) {
        this.sendServerMessage(
          `${this.formatTime(Date.now())} It's over! ${this.getGameResult()}`
        )
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

  getGameResult() {
    const teamA = this.teams[0]
    const teamB = this.teams[1]

    if (teamA.score > teamB.score) {
      return `Team ${teamA.name} wins ${teamA.score}-${teamB.score}!`
    } else if (teamB.score > teamA.score) {
      return `Team ${teamB.name} wins ${teamB.score}-${teamA.score}!`
    } else {
      return `It's a tie! ${teamA.score}-${teamB.score}.`
    }
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

  handleCollision(player: IPlayer, ball: IBall) {
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

  checkWallCollision(player: IPlayer, deltaTime: number) {
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

  adjustHorizontalWallCollision(player: IPlayer, newX: number) {
    if (newX - player.radius < 0) {
      player.x = player.radius
    } else {
      player.x = this.field.width - player.radius
    }

    player.direction = Math.PI - player.direction
  }

  adjustVerticalWallCollision(player: IPlayer, newY: number) {
    if (newY - player.radius < 0) {
      player.y = player.radius
    } else {
      player.y = this.field.height - player.radius
    }

    player.direction = -player.direction
  }

  normalizePlayerDirection(player: IPlayer) {
    const length = Math.sqrt(
      player.velocityX * player.velocityX + player.velocityY * player.velocityY
    )

    player.velocityX /= length
    player.velocityY /= length
  }
}
