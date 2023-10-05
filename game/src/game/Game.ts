import { Server } from 'socket.io'
import {
  IPlayer,
  IBall,
  ITeam,
  IField,
  IGates,
  IMessenger,
  IGameStateManager,
} from 'game-api'
import { BallBuilder } from '../ball/BallBuilder'
import { GateBuilder } from '../gate/GateBuilder'
import { NameGenerator } from '../utils/NameGenerator'
import { PlayerBallCollider } from '../collision/PlayerBallCollider'
import { PlayerWallCollider } from '../collision/PlayerWallCollider'
import { BallWallCollider } from '../collision/BallWallCollider'
import { Messenger } from '../utils/Messenger'
import { GameStateManager } from './GameStateManager'
import { Team } from '../team/Team'
import { TeamNameGenerator } from '../team/TeamNameGenerator'
import { BallGateCollider } from '../collision/BallGateCollider'
import { DateUtil } from '../utils/DateUtil'
import { IMatch } from './IMatch'
import { MatchDto, PlayerDto, TeamDto } from 'dtos'
import { Player } from '../player/Player'

export class GameData {
  private _field: IField
  private _teams: ITeam[]
  private _gates: IGates

  get field(): IField {
    return this._field
  }

  get teams(): ITeam[] {
    return this._teams
  }

  get gates(): IGates {
    return this._gates
  }

  constructor() {
    this._field = this.getField()
    this._teams = this.getTeams()
    this._gates = this.getGates()
  }

  private getField() {
    return { width: 800, height: 600 }
  }

  private getTeams() {
    const teamNameGenerator = new TeamNameGenerator()
    const [nameA, nameB] = teamNameGenerator.getRandomAnimalTeams()
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
    const teams: ITeam[] = []
    teams.push(teamA)
    teams.push(teamB)
    return teams
  }

  private getGates() {
    const gates: IGates = {
      left: new GateBuilder()
        .withPosition(0, this._field.height / 2 - 50)
        .withWidth(20)
        .withHeight(100)
        .withTeam(this._teams[0])
        .build(),
      right: new GateBuilder()
        .withPosition(this._field.width - 20, this._field.height / 2 - 50)
        .withWidth(20)
        .withHeight(100)
        .withTeam(this._teams[1])
        .build(),
    }
    return gates
  }
}

export class Game implements IMatch {
  private readonly gameData: GameData
  private readonly frictionCoefficient: number = 0.99
  players: IPlayer[] = []
  ball: IBall = new BallBuilder()
    .withPosition(400, 300)
    .withVelocity(0, 0)
    .withRadius(20)
    .withMass(0.6)
    .withLastHit(null)
    .build()
  matchDuration: number = 5 * 60 * 1000
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
  private _messenger: IMessenger
  private _stateManager: IGameStateManager

  get messenger(): IMessenger {
    return this._messenger
  }

  get stateManager(): IGameStateManager {
    return this._stateManager
  }

  constructor(private readonly io: Server) {
    this.gameData = new GameData()
    this._messenger = new Messenger(io)
    this._stateManager = new GameStateManager(this._messenger, this)

    this._stateManager.transitionToMatchMaking()
  }

  public startLoop() {
    this.lastFrameTime = Date.now()
    this.gameLoop = setInterval(() => {
      const currentTime = Date.now()
      const deltaTime = currentTime - this.lastFrameTime

      this.update(deltaTime)
      this.io.emit('update', new MatchDto(this.players, this.ball, deltaTime))

      this.lastFrameTime = currentTime
    }, this.frameInterval)
  }

  public startMatch() {
    this.matchStartTime = Date.now()
    this._messenger.sendText(
      `${DateUtil.formatTime(this.matchStartTime)} Begin`
    )
    this.players.forEach((p) => {
      this.io.emit(
        'newPlayer',
        new PlayerDto(p.id, p.x, p.y, p.radius, p.directionX, p.directionY)
      )
      const team = this.gameData.teams.find((t) =>
        t.playerIds.find((id) => id === p.id)
      )
      if (team) this.io.emit('team', new TeamDto(team))
    })
  }

  public stopLoop() {
    clearInterval(this.gameLoop)
  }

  resetGame() {
    this.messenger.clearLogAll()

    // Reset the ball position
    this.ball.x = this.gameData.field.width / 2
    this.ball.y = this.gameData.field.height / 2
    this.ball.velocityX = 0
    this.ball.velocityY = 0
    this.ball.lastHit = null

    // Reset team scores
    for (const team of this.gameData.teams) {
      team.score = 0
      team.playerIds = []
    }

    this.matchStartTime = null

    for (const player of this.players) {
      player.resetAfterMatch()
      player.assignToTeam(this.gameData.teams)
      player.positionInLine(
        this.gameData.teams,
        this.gameData.gates,
        this.gameData.field
      )
    }

    this.lastLogMinute = -1
  }

  resetAfterGoal() {
    // Reposition the ball to the center of the field
    this.ball.x = this.gameData.field.width / 2
    this.ball.y = this.gameData.field.height / 2
    this.ball.velocityX = 0
    this.ball.velocityY = 0
    this.ball.lastHit = null

    for (const player of this.players) {
      player.resetAfterGoal()
      player.positionInLine(
        this.gameData.teams,
        this.gameData.gates,
        this.gameData.field
      )
    }
  }

  pointScored() {
    this.ball.lastHit?.scorePoint()
    this._messenger.sendText(
      `Goal by ${this.ball.lastHit?.name}, ${this.gameData.teams[0].name} (${this.gameData.teams[0].color}): ${this.gameData.teams[0].score} - ${this.gameData.teams[1].name}: ${this.gameData.teams[1].score}`
    )
    this.resetAfterGoal()
  }

  public addPlayer(id: string): IPlayer {
    const newPlayer: IPlayer = Player.getDefaultPlayer(
      this.io,
      id,
      this.nameGenerator
    )
    newPlayer.assignToTeam(this.gameData.teams)
    this.players.push(newPlayer)
    newPlayer.positionInLine(
      this.gameData.teams,
      this.gameData.gates,
      this.gameData.field
    )
    this._messenger.sendText(
      `${newPlayer.name} joins team ${newPlayer.team?.name} (${newPlayer.team?.color})`
    )
    if (this.players.length === 2) {
      this._stateManager.transitionToStartGame()
    }
    return newPlayer
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
          `${DateUtil.formatTime(
            Date.now()
          )} It's over! ${this.getGameResult()}`
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
      this.gameData.field,
      deltaTime
    )

    this.ballWallCollider.checkWallCollisionForBall(
      this.ball,
      this.gameData.field
    )

    this.ballGateCollider.checkGateCollision(
      this.ball,
      this.gameData.gates,
      this
    )
  }

  getGameResult() {
    const teamA = this.gameData.teams[0]
    const teamB = this.gameData.teams[1]

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
