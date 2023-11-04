import { BallDto } from 'dtos'
import { BallState, BallStateType } from 'shared-api'

export class BallModel {
  private _radius: number = 0
  private _moveDto: BallDto | null = null
  private _state: BallState = { type: BallStateType.Idle }

  get radius(): number {
    return this._radius
  }

  set radius(value: number) {
    this._radius = value
  }

  get moveDto(): BallDto | null {
    return this._moveDto
  }

  set moveDto(value: BallDto) {
    this._moveDto = value
  }

  get state(): BallState | null {
    return this._state
  }

  set state(value: BallState) {
    this._state = value
  }
}
