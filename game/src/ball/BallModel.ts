import { IBallModel, IPlayer } from 'game-api'
import { BallState, BallStateType } from 'shared-api'
import { Server } from 'socket.io'
import { BallStateContext } from './state/BallStateContext'

export class BallModel implements IBallModel {
  private _x: number = 0
  private _y: number = 0
  private _velocityX: number = 0
  private _velocityY: number = 0
  private _radius: number = 0
  private _mass: number = 0
  private _lastHit: IPlayer | null = null

  private _state: BallState = { type: BallStateType.Idle }
  protected stateContext: BallStateContext

  get x(): number {
    return this._x
  }

  set x(value: number) {
    this._x = value
  }

  get y(): number {
    return this._y
  }

  set y(value: number) {
    this._y = value
  }

  get velocityX(): number {
    return this._velocityX
  }

  set velocityX(value: number) {
    this._velocityX = value
  }

  get velocityY(): number {
    return this._velocityY
  }

  set velocityY(value: number) {
    this._velocityY = value
  }

  get radius(): number {
    return this._radius
  }

  set radius(value: number) {
    this._radius = value
  }

  get mass(): number {
    return this._mass
  }

  set mass(value: number) {
    this._mass = value
  }

  get lastHit(): IPlayer | null {
    return this._lastHit
  }

  set lastHit(value: IPlayer | null) {
    this._lastHit = value
  }

  get state(): BallState {
    return this._state
  }

  set state(state: BallState) {
    this._state = state
  }

  constructor(protected readonly io: Server) {
    this.stateContext = new BallStateContext(this, io)
  }
}
