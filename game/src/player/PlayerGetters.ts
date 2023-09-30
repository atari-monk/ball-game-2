import { INameGenerator, IPlayerModel, ITeam, PlayerState } from 'game-api'
import { PlayerModel } from './PlayerModel'

export class PlayerGetters {
  protected readonly _model: IPlayerModel

  get id(): string {
    return this._model.id
  }

  get name(): string {
    return this._model.name
  }

  get x(): number {
    return this._model.x
  }

  get y(): number {
    return this._model.y
  }

  get velocityX(): number {
    return this._model.velocityX
  }

  get velocityY(): number {
    return this._model.velocityY
  }

  get radius(): number {
    return this._model.radius
  }

  get mass(): number {
    return this._model.mass
  }

  get direction(): number {
    return this._model.direction
  }

  get directionX(): number {
    return this._model.directionX
  }

  get directionY(): number {
    return this._model.directionY
  }

  get speed(): number {
    return this._model.speed
  }

  get maxSpeedForward(): number {
    return this._model.maxSpeedForward
  }

  get maxSpeedBackward(): number {
    return this._model.maxSpeedBackward
  }

  get turnSpeed(): number {
    return this._model.turnSpeed
  }

  get team(): ITeam {
    const team = this._model.team
    if (!team) throw new Error('Team must be assigned!')
    return team
  }

  get state(): PlayerState {
    return this._model.state
  }

  constructor(id: string, nameGenerator: INameGenerator) {
    this._model = PlayerModel.getDefaultPlayer(id, nameGenerator)
  }
}
