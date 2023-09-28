import { MapDto, MatchDto, MessageDto, PlayerDto, TeamDto } from 'api'
import { hostConfig } from './config/config'
import { CanvasRenderer } from './canvas/CanvasRenderer'
import { SocketInManager } from './socket/SocketInManager'
import { LogManager } from './logger/LogManager'
import { AnimationLoop } from './canvas/AnimationLoop'
import { PlayerModel } from './player/PlayerModel'
import { InputHandler } from './input/InputHandler'
import { ISocketIo } from './socket/ISocketIo'
import { MySocketIo } from './socket/MySocketIo'
import { ISocketInManager } from './socket/ISocketInManager'
import { ISocketOutManager } from './socket/ISocketOutManager'
import { SocketOutManager } from './socket/SocketOutManager'

export class GameClient {
  private mysocket: ISocketIo
  private socketInManager: ISocketInManager
  private socketOutManager: ISocketOutManager
  private canvasRenderer: CanvasRenderer
  private logManager: LogManager
  private map: MapDto | null = null
  private teams: TeamDto[] = []
  private match: MatchDto | null = null
  private animationLoop: AnimationLoop
  private players: PlayerModel[] = []
  private inputHandler: InputHandler

  constructor() {
    this.mysocket = new MySocketIo(hostConfig.selectedHost)
    this.socketInManager = new SocketInManager(this.mysocket)
    this.socketOutManager = new SocketOutManager(this.mysocket)
    this.canvasRenderer = new CanvasRenderer()
    this.logManager = new LogManager()
    this.animationLoop = new AnimationLoop(this.render.bind(this))
    this.inputHandler = new InputHandler(this.socketOutManager)

    this.initializeSocketListeners()
    this.animationLoop.start()
  }

  private initializeSocketListeners() {
    this.socketInManager.handleConnect(this.onConnect.bind(this))
    this.socketInManager.handleYourPlayerId(this.onYourPlayerId.bind(this))
    this.socketInManager.handlePing(() =>
      this.socketOutManager.sendPong.bind(this)
    )
    this.socketInManager.handleNewPlayer(this.onNewPlayer.bind(this))
    this.socketInManager.handleMapUpdate(this.handleMapUpdate.bind(this))
    this.socketInManager.handleTeamUpdate(this.handleTeamUpdate.bind(this))
    this.socketInManager.handleLogMessage(this.handleLogMessage.bind(this))
    this.socketInManager.handleLogReset(this.handleLogReset.bind(this))
    this.socketInManager.handleMatchUpdate(this.handleMatchUpdate.bind(this))
  }

  private onConnect() {
    const playerId = localStorage.getItem('playerId')
    if (playerId) this.socketOutManager.sendPlayerId(playerId)
  }

  onYourPlayerId(id: string) {
    localStorage.setItem('playerId', id)
  }

  private onNewPlayer(dto: PlayerDto) {
    if (!this.players.find((p) => p.id === dto.id)) {
      const newPlayer = new PlayerModel()
      newPlayer.id = dto.id
      newPlayer.radius = dto.radius
      this.players.push(newPlayer)
    }
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
