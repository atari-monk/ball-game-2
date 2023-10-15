import { GameState, IMessenger, MsgFlag } from 'game-api'
import { Game } from './Game'
import { CounterEvent, SocketEvents } from 'shared-api'
import { CounterDto } from 'dtos'

export class GameStateManager {
  private _currentState: GameState
  private readonly serverState = 'Server State'

  get currentState(): GameState {
    return this._currentState
  }

  constructor(
    private readonly messenger: IMessenger,
    private readonly game: Game
  ) {
    this._currentState = this.initGameState(GameState.Creating)
  }

  private initGameState(state: GameState) {
    this.sendServerState()
    return state
  }

  private setGameState(state: GameState) {
    this._currentState = state
    this.sendServerState()
  }

  private sendServerState() {
    this.messenger.sendMsg(
      this.serverState,
      GameState[this._currentState],
      MsgFlag.ServerState
    )
  }

  public transitionToMatchMaking() {
    this.setGameState(GameState.MatchMaking)
    this.messenger.sendText('Waiting for players')
  }

  public transitionToStartGame() {
    this.setGameState(GameState.Start)
    this.startCounter(() => this.transitionToProgress())
  }

  private startCounter(fn: () => void, sec: number = 4, inf: number = 1) {
    let timer = sec
    const intervalId = setInterval(() => {
      if (timer % inf === 0) {
        this.game.io.emit(
          SocketEvents.Counter,
          new CounterDto(
            CounterEvent.StartGame,
            timer - 1,
            timer - 1 === 0 ? 'GO !' : ''
          )
        )
      }
      timer--
      if (timer === 0) {
        clearInterval(intervalId)
        fn()
      }
    }, 1000)
  }

  transitionToProgress() {
    this.setGameState(GameState.Progress)
    this.game.startMatch()
    this.game.startLoop()
  }

  transitionToGameOver() {
    this.setGameState(GameState.Over)
    this.game.stopLoop()
    this.messenger.sendText('Reset')
    this.startCounter(
      () => {
        this.game.resetGame()
        if (this.game.gameData.players.length === 2) {
          this.transitionToStartGame()
        } else {
          this.transitionToMatchMaking()
        }
      },
      20,
      5
    )
  }

  isNotInProgressState() {
    return this.currentState !== GameState.Progress
  }
}
