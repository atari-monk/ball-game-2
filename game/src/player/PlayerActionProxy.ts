import { IField, IGates, INameGenerator, IPlayerAction, ITeam } from 'game-api'
import { PlayerAction } from './PlayerAction'
import { PlayerSetters } from './PlayerSetters'

export class PlayerActionProxy extends PlayerSetters {
  private readonly _action: IPlayerAction

  constructor(id: string, nameGenerator: INameGenerator) {
    super(id, nameGenerator)
    this._action = new PlayerAction(this._model)
  }

  update(deltaTime: number) {
    this._action.update(deltaTime)
  }

  scorePoint(): void {
    this._action.scorePoint()
  }

  assignToTeam(teams: ITeam[]) {
    this._action.assignToTeam(teams)
  }

  positionInLine(teams: ITeam[], gates: IGates, field: IField) {
    this._action.positionInLine(teams, gates, field)
  }

  resetAfterGoal(): void {
    this._action.resetAfterGoal()
  }

  resetAfterMatch(): void {
    this._action.resetAfterMatch()
  }

  onUp(): void {
    this._action.onUp()
  }

  onDown(): void {
    this._action.onDown()
  }

  onLeft(): void {
    this._action.onLeft()
  }

  onRight(): void {
    this._action.onRight()
  }

  onInactive(): void {
    this._action.onInactive()
  }
}
