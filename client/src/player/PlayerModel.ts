import { PlayerDto } from 'dtos'
import { PlayerState, PlayerStateType } from 'game-api'

export class PlayerModel {
  private _id: string = ''
  private _radius: number = 0
  private _teamColor: string = ''
  private _moveDto: PlayerDto | null = null
  private _state: PlayerState = { type: PlayerStateType.Idle }

  get id(): string {
    return this._id
  }

  set id(value: string) {
    this._id = value
  }

  get radius(): number {
    return this._radius
  }

  set radius(value: number) {
    this._radius = value
  }

  get teamColor(): string {
    return this._teamColor
  }

  set teamColor(value: string) {
    this._teamColor = value
  }

  get moveDto(): PlayerDto | null {
    return this._moveDto
  }

  set moveDto(value: PlayerDto) {
    this._moveDto = value
  }

  get state(): PlayerState | null {
    return this._state
  }

  set state(value: PlayerState) {
    this._state = value
  }
}
