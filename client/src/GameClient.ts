import {
  BallStateDto,
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
import { MySocketIo } from './socket/MySocketIo'
import { SocketOutManager } from './socket/SocketOutManager'
import {
  ISocketIo,
  ISocketInManager,
  ISocketOutManager,
  ICanvasInfo,
} from 'client-api'
import { Player } from './player/Player'
import { PlayerIdleState } from './player/state/PlayerIdleState'
import { BallStateType, PlayerStateType } from 'shared-api'
import { PlayerWalkState } from './player/state/PlayerWalkState'
import { CanvasInfoProvider } from './canvas/CanvasInfoProvider'
import { CanvasDrawer } from './canvas/CanvasDrawer'
import { blueAnimations, redAnimations } from './player/playerData'
import { LogClient } from './logger/LogClient'
import { FullscreenManager } from './canvas/FullscreenManager'
import { Scoreboard } from './score/Scoreboard'
import { Counter } from './counter/Counter'
import { InputManager } from './input/InputManager'
import { getById } from 'dom-lib'
import { Ball } from './ball/Ball'
import { ballAnimations } from './ball/ballData'
import { BallRotateState } from './ball/state/BallRotateState'
import { BallIdleState } from './ball/state/BallIdleState'

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
  private ball: Ball | null = null
  private canvasDrawer: CanvasDrawer
  private logClient?: LogClient
  private isLogOn: boolean = false
  private playerId: string = ''
  private fullScreen: FullscreenManager | null = null
  private canvasInfo: ICanvasInfo
  private scoreboard: Scoreboard | null = null
  private counter: Counter | null = null
  private inputManager: InputManager | null = null

  constructor() {
    this.mysocket = new MySocketIo(hostConfig.selectedHost)
    this.socketInManager = new SocketInManager(this.mysocket)
    this.socketOutManager = new SocketOutManager(this.mysocket)
    this.canvasInfo = this.getCanvasInfo()
    this.canvasDrawer = new CanvasDrawer(this.canvasInfo.ctx)
    this.canvasRenderer = new CanvasRenderer(this.canvasDrawer)
    this.animationLoop = new AnimationLoop(this.render.bind(this))
  }

  async initializeGame() {
    try {
      await this.canvasRenderer.initialize()

      this.initializeSocketListeners()
      this.animationLoop.start()
      if (this.isLogOn) {
        this.logClient = new LogClient(this.socketInManager)
        this.setLogButton()
      }
      this.playerId = ''
      this.fullScreen = new FullscreenManager(getById('canvas_container'))
      this.setFullscreenButton()
      this.inputManager = new InputManager(this.socketOutManager, {
        isKeyboard: true,
        isMobileInput: false,
        isJoystick: true,
      })
    } catch (error: any) {
      console.error('Failed to initialize game:', error.message)
    }
  }

  private getCanvasInfo() {
    const canvasInfoProvider = new CanvasInfoProvider()
    return canvasInfoProvider.getCanvasInfo('canvas')
  }

  private setFullscreenButton() {
    const fullscreenButton = document.getElementById(
      'fullscreen_button'
    ) as HTMLButtonElement
    if (!fullscreenButton) return

    fullscreenButton.addEventListener('click', () => {
      this.fullScreen?.toggleFullscreen()
    })
    fullscreenButton.addEventListener('touchstart', () => {
      this.fullScreen?.toggleFullscreen()
    })
  }

  private setLogButton() {
    const logButton = document.getElementById('log_button')
    if (!logButton) return
    logButton.classList.toggle('hidden')

    const logboard = document.getElementById('message_board_container')
    if (!logboard) return

    const toggleLogboard = () => {
      logboard.classList.toggle('hidden')
    }

    logButton.addEventListener('click', toggleLogboard)
    logButton.addEventListener('touchstart', toggleLogboard)
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
    this.socketInManager.handleBallSate(this.handleBallState.bind(this))
  }

  private onConnect() {
    const playerId = localStorage.getItem('playerId')
    this.socketOutManager.sendPlayerId(playerId ?? '')
    this.playerId = playerId ?? ''
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
      player.setState(new PlayerIdleState(player))
    if (dto.state.type === PlayerStateType.Walk)
      player.setState(new PlayerWalkState(player))
  }

  private handleBallState(dto: BallStateDto) {
    if (!this.ball) return
    if (dto.state.type === BallStateType.Idle)
      this.ball.setState(new BallIdleState(this.ball))
    if (dto.state.type === BallStateType.Rotate)
      this.ball.setState(new BallRotateState(this.ball))
  }

  private handleMapUpdate(dto: MapDto) {
    const { gates, field } = dto
    this.gates = gates
    this.field = field
    this.scoreboard = new Scoreboard(
      this.socketInManager,
      this.canvasDrawer,
      this.field
    )
    this.counter = new Counter(
      this.socketInManager,
      this.canvasDrawer,
      this.field
    )
    if (this.ball) return
    this.ball = new Ball()
    this.ball.createRenderer(this.canvasDrawer, ballAnimations)
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
    if (this.ball) this.ball.moveDto = ball
    this.players.forEach((player) => {
      const playerDto = players.find((p) => p.id === player.id)
      if (playerDto) {
        player.moveDto = playerDto
        if (
          this.inputManager!.config.isMobileInput &&
          this.playerId === player.id
        )
          this.inputManager!.mobileInputHandler!.setPlayerPosition(
            playerDto.x,
            playerDto.y
          )
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
    if (this.ball) this.canvasRenderer.drawBall(this.ball, dt)
    this.scoreboard?.draw()
    this.counter?.draw()
  }

  public stopGame() {
    this.animationLoop.stop()
  }
}
