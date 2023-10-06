import {
  BallDto,
  FieldDto,
  IGateDtos,
  MapDto,
  MatchDto,
  PlayerDto,
  PlayerStateDto,
  TeamDto,
} from 'dtos'
import { hostConfig } from './config/config'
import { CanvasRenderer } from './canvas/CanvasRenderer'
import { SocketInManager } from './socket/SocketInManager'
import { AnimationLoop } from './canvas/AnimationLoop'
import { InputHandler } from './input/InputHandler'
import { MySocketIo } from './socket/MySocketIo'
import { SocketOutManager } from './socket/SocketOutManager'
import { ISocketIo, ISocketInManager, ISocketOutManager } from 'client-api'
import { Player } from './player/Player'
import { IdleState } from './player/state/IdleState'
import { PlayerStateType } from 'shared-api'
import { WalkState } from './player/state/WalkState'
import { CanvasInfoProvider } from './canvas/CanvasInfoProvider'
import { CanvasDrawer } from './canvas/CanvasDrawer'
import { blueAnimations, redAnimations } from './player/playerData'
import { LogClient } from './logger/LogClient'
import { MobileInputHandler } from './input/MobileInputHandler'

export class GameClient {
  private mysocket: ISocketIo
  private socketInManager: ISocketInManager
  private socketOutManager: ISocketOutManager
  private canvasRenderer: CanvasRenderer
  private teams: TeamDto[] = []
  private animationLoop: AnimationLoop
  private gates: IGateDtos | null = null
  private field: FieldDto | null = null
  private players: Player[] = []
  private ball: BallDto | null = null
  private canvasDrawer: CanvasDrawer
  private logClient?: LogClient
  private isLogOn: boolean = false

  constructor() {
    this.mysocket = new MySocketIo(hostConfig.selectedHost)
    this.socketInManager = new SocketInManager(this.mysocket)
    this.socketOutManager = new SocketOutManager(this.mysocket)
    this.canvasDrawer = this.getCanvasDrawer()
    this.canvasRenderer = new CanvasRenderer(this.canvasDrawer)
    this.animationLoop = new AnimationLoop(this.render.bind(this))
    new InputHandler(this.socketOutManager)
    new MobileInputHandler(this.socketOutManager)

    this.initializeSocketListeners()
    this.animationLoop.start()
    if (this.isLogOn) this.logClient = new LogClient(this.socketInManager)
  }

  private getCanvasDrawer() {
    const canvasInfoProvider = new CanvasInfoProvider()
    const canvasInfo = canvasInfoProvider.getCanvasInfo('canvas')
    const ctx = canvasInfo.ctx
    return new CanvasDrawer(ctx)
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
    this.socketInManager.handleMatchUpdate(this.handleMatchUpdate.bind(this))
    this.socketInManager.handlePlayerSate(this.handlePlayerState.bind(this))
  }

  private onConnect() {
    const playerId = localStorage.getItem('playerId')
    this.socketOutManager.sendPlayerId(playerId ?? '')
  }

  onYourPlayerId(id: string) {
    localStorage.setItem('playerId', id)
  }

  private onNewPlayer(dto: PlayerDto) {
    if (!this.players.find((p) => p.id === dto.id)) {
      const newPlayer = new Player()
      newPlayer.id = dto.id
      newPlayer.radius = dto.radius
      this.players.push(newPlayer)
    }
  }

  private handlePlayerState(dto: PlayerStateDto) {
    const player = this.players.find((p) => p.id === dto.id)
    if (!player) return
    if (dto.state.type === PlayerStateType.Idle)
      player.setState(new IdleState(player))
    if (dto.state.type === PlayerStateType.Walk)
      player.setState(new WalkState(player))
  }

  private handleMapUpdate(dto: MapDto) {
    const { gates, field } = dto
    this.gates = gates
    this.field = field
  }

  private handleTeamUpdate(dto: TeamDto) {
    this.teams.push(dto)
    this.players.forEach((player) => {
      if (!player.teamColor) {
        if (dto.playerIds.find((id) => id === player.id)) {
          player.teamColor = dto.color
          if (player.teamColor === 'blue')
            player.createRenderer(this.canvasDrawer, blueAnimations)
          if (player.teamColor === 'red')
            player.createRenderer(this.canvasDrawer, redAnimations)
        }
      }
    })
  }

  private handleMatchUpdate(dto: MatchDto) {
    const { players, ball } = dto
    this.ball = ball
    this.players.forEach((player) => {
      const playerDto = players.find((p) => p.id === player.id)
      if (playerDto) {
        player.moveDto = playerDto
      }
    })
  }

  private render(dt: number) {
    this.canvasRenderer.clearCanvas()
    if (this.field) this.canvasRenderer.drawField(this.field)
    if (this.gates) this.canvasRenderer.drawGates(this.gates)
    this.players.forEach((player) => {
      this.canvasRenderer.drawPlayer(player, dt)
    })
    if (this.ball) this.canvasRenderer.drawBall(this.ball)
  }

  public stopGame() {
    this.animationLoop.stop()
  }
}
