import { IPlayerModel, ITeam, PlayerState, PlayerStateType } from 'game-api'

export class PlayerModel implements IPlayerModel {
  private _id: string = ''
  private _name: string = ''
  private _x: number = 0
  private _y: number = 0
  private _velocityX: number = 0
  private _velocityY: number = 0
  private _radius: number = 0
  private _collisionDisabled: boolean = false
  private _mass: number = 0
  private _direction: number = 0
  private _directionX: number = 0
  private _directionY: number = 0
  private _speed: number = 0
  private _maxSpeedForward: number = 0
  private _maxSpeedBackward: number = 0
  private _turnSpeed: number = 0
  private _team: ITeam | null = null
  private _score: number = 0
  private _state: PlayerState = { type: PlayerStateType.Idle }

  public get id(): string {
    return this._id
  }

  public get name(): string {
    return this._name
  }

  public get x(): number {
    return this._x
  }

  set x(x: number) {
    this.x = x
  }

  public get y(): number {
    return this._y
  }

  set y(y: number) {
    this.y = y
  }

  public get velocityX(): number {
    return this._velocityX
  }

  set velocityX(vx: number) {
    this.velocityX = vx
  }

  public get velocityY(): number {
    return this._velocityY
  }

  set velocityY(vy: number) {
    this.velocityY = vy
  }

  public get radius(): number {
    return this._radius
  }

  public get collisionDisabled(): boolean {
    return this._collisionDisabled
  }

  public get mass(): number {
    return this._mass
  }

  public get direction(): number {
    return this._direction
  }

  set direction(d: number) {
    this._direction = d
  }

  public get directionX(): number {
    return this._directionX
  }

  public get directionY(): number {
    return this._directionY
  }

  public get speed(): number {
    return this._speed
  }

  set speed(s: number) {
    this._speed = s
  }

  public get maxSpeedForward(): number {
    return this._maxSpeedForward
  }

  public get maxSpeedBackward(): number {
    return this._maxSpeedBackward
  }

  public get turnSpeed(): number {
    return this._turnSpeed
  }

  public get team(): ITeam {
    if (!this._team) throw new Error('Team must be assigned!')
    return this._team
  }

  set team(t: ITeam | null) {
    this._team = t
  }

  public get score(): number {
    return this._score
  }

  set score(s: number) {
    this._score = s
  }

  public get state(): PlayerState {
    return this._state
  }

  set state(state: PlayerState) {
    this._state = state
  }
}
