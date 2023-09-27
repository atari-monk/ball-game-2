import { MapDto, MatchDto, MessageDto, TeamDto } from 'api'
import { hostConfig } from './config/config'
import { CanvasRenderer } from './canvas/CanvasRenderer'
import { SocketManager } from './SocketManager'
import { LogManager } from './logger/LogManager'
import { IInput } from './api/IInput'
import { AnimationLoop } from './canvas/AnimationLoop'
import { PlayerModel } from './player/PlayerModel'

export class GameClient {
  private socketManager: SocketManager
  private canvasRenderer: CanvasRenderer
  private logManager: LogManager
  private map: MapDto | null = null
  private teams: TeamDto[] = []
  private match: MatchDto | null = null
  private animationLoop: AnimationLoop
  private players: PlayerModel[] = []

  constructor() {
    this.socketManager = new SocketManager(
      hostConfig.selectedHost,
      this.players
    )
    this.canvasRenderer = new CanvasRenderer()
    this.logManager = new LogManager()
    this.animationLoop = new AnimationLoop(this.render.bind(this))

    this.initializeSocketListeners()
    this.initializeEventListeners()
    this.animationLoop.start()
  }

  private initializeSocketListeners() {
    this.socketManager.handleMapUpdate(this.handleMapUpdate.bind(this))
    this.socketManager.handleTeamUpdate(this.handleTeamUpdate.bind(this))
    this.socketManager.handleLogMessage(this.handleLogMessage.bind(this))
    this.socketManager.handleLogReset(this.handleLogReset.bind(this))
    this.socketManager.handleMatchUpdate(this.handleMatchUpdate.bind(this))
  }

  private initializeEventListeners() {
    document.addEventListener('keydown', this.handleKeyDown.bind(this))
  }

  private handleMapUpdate(dto: MapDto) {
    this.map = dto
  }

  private handleTeamUpdate(dto: TeamDto) {
    this.teams.push(dto)
    this.players.forEach((player) => {
      if (!player.teamColor) {
        if (dto.playerIds.find((id) => id === player.id)) {
          player.teamColor = dto.color
        }
      }
    })
  }

  private handleMatchUpdate(dto: MatchDto) {
    this.match = dto
  }

  private handleLogMessage(dto: MessageDto) {
    this.logManager.logMessage(dto)
  }

  private handleLogReset() {
    this.logManager.clearTextArea()
  }

  private handleKeyDown(event: KeyboardEvent) {
    const input: IInput = {
      up: event.key === 'ArrowUp',
      down: event.key === 'ArrowDown',
      left: event.key === 'ArrowLeft',
      right: event.key === 'ArrowRight',
    }
    this.socketManager.sendPlayerInput(input)
  }

  private render(dt: number) {
    this.canvasRenderer.clearCanvas()
    if (this.map) {
      const { gates, field } = this.map
      this.canvasRenderer.drawField(field)
      this.canvasRenderer.drawGates(gates)
    }
    if (this.match) {
      const { players, ball } = this.match
      players.forEach((player) => {
        const myplayer = this.players.find((p) => p.id === player.id)
        if (myplayer) {
          myplayer.moveDto = player
          this.canvasRenderer.drawPlayer(myplayer, dt)
        }
      })
      this.canvasRenderer.drawBall(ball)
    }
  }

  public stopGame() {
    this.animationLoop.stop()
  }
}
