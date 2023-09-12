import { Server, Socket } from 'socket.io'
import { IPlayer, IBall, ITeam, IField, IGates, MatchDto } from 'api'
import { BallBuilder } from '../ball/BallBuilder'
import { GateBuilder } from '../gate/GateBuilder'
import { NameGenerator } from '../utils/NameGenerator'
import { PlayerBuilder } from '../player/PlayerBuilder'
import { PlayerBallCollider } from '../collision/PlayerBallCollider'
import { PlayerWallCollider } from '../collision/PlayerWallCollider'
import { BallWallCollider } from '../collision/BallWallCollider'
import { Messenger } from '../utils/Messenger'
import { GameStateManager } from './GameStateManager'
import { Team } from '../team/Team'
import { TeamNameGenerator } from '../team/TeamNameGenerator'
import { BallGateCollider } from '../collision/BallGateCollider'
import { DateUtil } from '../utils/DateUtil'

interface IMatch {
  matchDuration: number
  matchStartTime: number | null
}

export class Game implements IMatch {
  private readonly frictionCoefficient: number = 0.99
  players: IPlayer[] = []
  ball: IBall = new BallBuilder()
    .withPosition(400, 300)
    .withVelocity(0, 0)
    .withRadius(5)
    .withMass(5)
    .withLastHit(null)
    .build()
  field: IField = { width: 800, height: 600 }
  gates: IGates
  teams: ITeam[] = []
  matchDuration: number = 5 * 60 * 1000 // 5 minutes in milliseconds
  matchStartTime: number | null = null
  private nameGenerator = new NameGenerator()
  private frameRate: number = 30
  private frameInterval: number = 1000 / this.frameRate
  private lastFrameTime: number = 0
  private gameLoop?: NodeJS.Timeout
  private lastLogMinute: number = -1
  private playerBallCollider = new PlayerBallCollider()
  private playerWallCollider = new PlayerWallCollider()
  private ballWallCollider = new BallWallCollider()
  private ballGateCollider = new BallGateCollider()
  private _messenger: Messenger
  private _stateManager: GameStateManager
  private teamNameGenerator: TeamNameGenerator

  get messenger(): Messenger {
    return this._messenger
  }

  get stateManager(): GameStateManager {
    return this._stateManager
  }

  constructor(private readonly io: Server) {
    this._messenger = new Messenger(io)
    this._stateManager = new GameStateManager(this._messenger, this)

    this.teamNameGenerator = new TeamNameGenerator()
    const [nameA, nameB] = this.teamNameGenerator.getRandomAnimalTeams()
    const teamA = Team.builder()
      .withName(nameA)
      .withColor('red')
      .withScore(0)
      .build()
    const teamB = Team.builder()
      .withName(nameB)
      .withColor('blue')
      .withScore(0)
      .build()
    this.teams.push(teamA)
    this.teams.push(teamB)

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

    this._stateManager.transitionToMatchMaking()
  }

  public startLoop() {
    this.lastFrameTime = Date.now()
    this.gameLoop = setInterval(() => {
      const currentTime = Date.now()
      const deltaTime = currentTime - this.lastFrameTime

      this.update(deltaTime)

      this.io.emit('update', new MatchDto(this.players, this.ball))

      this.lastFrameTime = currentTime
    }, this.frameInterval)
  }

  public startMatch() {
    this.matchStartTime = Date.now()
    this._messenger.sendText(`${DateUtil.formatTime(this.matchStartTime)} Begin`)
  }

  public stopLoop() {
    clearInterval(this.gameLoop)
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
    this.messenger.clearLogAll()
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

    this.matchStartTime = null

    // Reassign players to teams and position them
    for (const player of this.players) {
      this.assignPlayerToTeam(player)
      this.positionPlayerInLine(player)
      player.velocityX = 0
      player.velocityY = 0
      player.speed = 0
    }

    this.lastLogMinute = -1
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
      player.velocityX = 0
      player.velocityY = 0
      player.speed = 0
    }
  }

  pointScored() {
    this.ball.lastHit?.scorePoint()
    this._messenger.sendText(
      `Goal by ${this.ball.lastHit?.name}, ${this.teams[0].name} (${this.teams[0].color}): ${this.teams[0].score} - ${this.teams[1].name}: ${this.teams[1].score}`
    )
    this.resetAfterGoal()
  }

  addPlayer(id: string, socket: Socket) {
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
      .withMaxSpeedForward(0.1)
      .withMaxSpeedBackward(-0.05)
      .withTurnSpeed(0.4)
      .withTeam(null)
      .withScore(0)
      .build()

    this.assignPlayerToTeam(newPlayer)

    this.players.push(newPlayer)

    this.positionPlayerInLine(newPlayer)

    this._messenger.sendText(
      `${newPlayer.name} joins team ${newPlayer.team?.name} (${newPlayer.team?.color})`
    )

    if (this.players.length === 2) {
      this._stateManager.transitionToStartGame()
    }
    return newPlayer
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
    if (this.matchStartTime !== null) {
      const currentTime = Date.now()
      const elapsedTime = currentTime - this.matchStartTime
      const remainingTimeMinutes = (this.matchDuration - elapsedTime) / 60000 // Convert milliseconds to minutes

      // Log the remaining time every minute
      const minutesPassed = Math.floor(elapsedTime / 60000)
      const minutesSinceLastLog = minutesPassed - this.lastLogMinute

      if (minutesSinceLastLog >= 1 && remainingTimeMinutes >= 0) {
        this._messenger.sendText(
          `End in ${remainingTimeMinutes.toFixed(1)} minutes`
        )
        this.lastLogMinute = minutesPassed
      }

      // Check if the match has ended
      if (elapsedTime >= this.matchDuration) {
        this._messenger.sendText(
          `${DateUtil.formatTime(Date.now())} It's over! ${this.getGameResult()}`
        )
        this.matchStartTime = null // Add a method to stop the timer when the match is over
        this._stateManager.transitionToGameOver()
      }
    }

    if (this._stateManager.isNotInProgressState()) return

    // Update ball position based on its velocity
    this.updateBallPosition(deltaTime)

    // Update player positions based on their velocity
    this.updatePlayerPositions(deltaTime)

    this.playerBallCollider.checkPlayerBallCollision(this.players, this.ball)

    this.playerWallCollider.checkWallCollision(
      this.players,
      this.field,
      deltaTime
    )

    this.ballWallCollider.checkWallCollisionForBall(this.ball, this.field)

    this.ballGateCollider.checkGateCollision(this.ball, this.gates, this)
  }

  getGameResult() {
    const teamA = this.teams[0]
    const teamB = this.teams[1]

    if (teamA.score > teamB.score) {
      return `Team ${teamA.name} (${teamA.color}) wins ${teamA.score}-${teamB.score}!`
    } else if (teamB.score > teamA.score) {
      return `Team ${teamB.name} (${teamB.color}) wins ${teamB.score}-${teamA.score}!`
    } else {
      return `It's a tie! ${teamA.score}-${teamB.score}`
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
      player.update(deltaTime)
    }
  }
}
