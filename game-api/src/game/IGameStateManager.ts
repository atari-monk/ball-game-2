import { GameState } from '../GameState'

export interface IGameStateManager {
  currentState: GameState
  transitionToMatchMaking(): void
  transitionToStartGame(): void
  transitionToProgress(): void
  transitionToGameOver(): void
  isNotInProgressState(): boolean
}
