import { Server } from 'socket.io'
import { IPlayer, IMessenger, IGameStateManager } from 'game-api'
import { NameGenerator } from '../utils/NameGenerator'
import { PlayerBallCollider } from '../collision/PlayerBallCollider'
import { PlayerWallCollider } from '../collision/PlayerWallCollider'
import { BallWallCollider } from '../collision/BallWallCollider'
import { Messenger } from '../utils/Messenger'
import { GameStateManager } from './GameStateManager'
import { BallGateCollider } from '../collision/BallGateCollider'
import { DateUtil } from '../utils/DateUtil'
import { IMatch } from './IMatch'
import { MatchDto, PlayerDto, PointDto, TeamDto } from 'dtos'
import { IGameData } from './IGameData'
import { GameDataForMobileLandscape } from './GameDataForMobileLandscape'
import { SocketEvents } from 'shared-api'
import { Team } from '../team/Team'
import { Team as TeamEnum } from 'shared-api'

export class Game implements IMatch {
  private readonly _gameData: IGameData
  private readonly frictionCoefficient: number = 0.99
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

  get gameData(): IGameData {
    return this._gameData
  }

  get messenger(): IMessenger {
    return this._messenger
  }

  get stateManager(): IGameStateManager {
    return this._stateManager
  }

  get io(): Server {
    return this._io
  }

  constructor(private readonly _io: Server) {
    this._gameData = new GameDataForMobileLandscape(_io)
    this._messenger = new Messenger(_io)
    this._stateManager = new GameStateManager(this._messenger, this)
    this._stateManager.transitionToMatchMaking()
  }

  public startLoop() {
    this.lastFrameTime = Date.now()
    this.gameLoop = setInterval(() => {
      const currentTime = Date.now()
      const deltaTime = currentTime - this.lastFrameTime

      this.update(deltaTime)
      this._io.emit(
        'update',
        new MatchDto(this._gameData.players, this._gameData.ball, deltaTime)
      )

      this.lastFrameTime = currentTime
    }, this.frameInterval)
  }

  public startMatch() {
    this.matchStartTime = Date.now()
    this._messenger.sendText(
      `${DateUtil.formatTime(this.matchStartTime)} Begin`
    )
    this._gameData.players.forEach((p) => {
      this._io.emit(
        'newPlayer',
        new PlayerDto(p.id, p.x, p.y, p.radius, p.directionX, p.directionY)
      )
      const team = this._gameData.teams.find((t) =>
        t.playerIds.find((id) => id === p.id)
      )
      if (team) this._io.emit('team', new TeamDto(team))
    })
  }

  public stopLoop() {
    clearInterval(this.gameLoop)
  }

  resetGame() {
    this.messenger.clearLogAll()

    // Reset the ball position
    this._gameData.ball.x = this._gameData.field.width / 2
    this._gameData.ball.y = this._gameData.field.height / 2
    this._gameData.ball.velocityX = 0
    this._gameData.ball.velocityY = 0
    this._gameData.ball.lastHit = null

    // Reset team scores
    for (const team of this._gameData.teams) {
      team.score = 0
      team.playerIds = []
    }

    this.matchStartTime = null

    for (const player of this._gameData.players) {
      player.resetAfterMatch()
      player.assignToTeam(this._gameData.teams)
      player.positionInLine(
        this._gameData.teams,
        this._gameData.gates,
        this._gameData.field
      )
    }

    this.lastLogMinute = -1
  }

  resetAfterGoal() {
    // Reposition the ball to the center of the field
    this._gameData.ball.x = this._gameData.field.width / 2
    this._gameData.ball.y = this._gameData.field.height / 2
    this._gameData.ball.velocityX = 0
    this._gameData.ball.velocityY = 0
    this._gameData.ball.lastHit = null

    for (const player of this._gameData.players) {
      player.resetAfterGoal()
      player.positionInLine(
        this._gameData.teams,
        this._gameData.gates,
        this._gameData.field
      )
    }
  }

  findPlayerTeam(player: IPlayer): string {
    let playerTeamColor = ''
    this._gameData.teams.some((team) => {
      if (team.playerIds.includes(player.id)) {
        playerTeamColor = team.color
        return true
      }
    })
    return playerTeamColor
  }

  pointScored() {
    if (!this._gameData.ball.lastHit) return
    const playerThatScored = this._gameData.ball.lastHit
    playerThatScored.scorePoint()
    this._messenger.sendText(
      `Goal by ${playerThatScored.name}, ${this._gameData.teams[0].name} (${this._gameData.teams[0].color}): ${this._gameData.teams[0].score} - ${this._gameData.teams[1].name}: ${this._gameData.teams[1].score}`
    )
    const team = this.findPlayerTeam(playerThatScored)
    if (team === 'red') {
      this._io.emit(SocketEvents.Point, new PointDto(TeamEnum.Red))
    }
    if (team === 'blue')
      this._io.emit(SocketEvents.Point, new PointDto(TeamEnum.Blue))
    this.resetAfterGoal()
  }

  public addPlayer(id: string): IPlayer {
    const newPlayer: IPlayer = this._gameData.getPlayer(
      id,
      this._io,
      this.nameGenerator
    )
    this._messenger.sendText(
      `${newPlayer.name} joins team ${newPlayer.team?.name} (${newPlayer.team?.color})`
    )
    if (this._gameData.players.length === 2) {
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

    this.playerBallCollider.checkPlayerBallCollision(
      this._gameData.players,
      this._gameData.ball
    )

    this.playerWallCollider.checkWallCollision(
      this._gameData.players,
      this._gameData.field,
      deltaTime
    )

    this.ballWallCollider.checkWallCollisionForBall(
      this._gameData.ball,
      this._gameData.field
    )

    this.ballGateCollider.checkGateCollision(
      this._gameData.ball,
      this._gameData.gates,
      this
    )
  }

  getGameResult() {
    const teamA = this._gameData.teams[0]
    const teamB = this._gameData.teams[1]

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
    this._gameData.ball.velocityX *= this.frictionCoefficient
    this._gameData.ball.velocityY *= this.frictionCoefficient

    // Calculate the displacement based on velocity and deltaTime
    const displacementX = this._gameData.ball.velocityX * deltaTime
    const displacementY = this._gameData.ball.velocityY * deltaTime

    // Update the ball's position
    this._gameData.ball.x += displacementX
    this._gameData.ball.y += displacementY
  }

  updatePlayerPositions(deltaTime: number) {
    for (const player of this._gameData.players) {
      player.update(deltaTime)
    }
  }
}
