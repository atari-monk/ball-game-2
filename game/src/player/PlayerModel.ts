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

  public set id(id: string) {
    this._id = id
  }

  public get name(): string {
    return this._name
  }

  set name(name: string) {
    this._name = name
  }

  public get x(): number {
    return this._x
  }

  set x(x: number) {
    this._x = x
  }

  get y(): number {
    return this._y
  }

  set y(y: number) {
    this._y = y
  }

  get velocityX(): number {
    return this._velocityX
  }

  set velocityX(vx: number) {
    this._velocityX = vx
  }

  get velocityY(): number {
    return this._velocityY
  }

  set velocityY(vy: number) {
    this._velocityY = vy
  }

  get radius(): number {
    return this._radius
  }

  set radius(r: number) {
    this._radius = r
  }

  get collisionDisabled(): boolean {
    return this._collisionDisabled
  }

  set collisionDisabled(c: boolean) {
    this._collisionDisabled = c
  }

  get mass(): number {
    return this._mass
  }

  set mass(m: number) {
    this._mass = m
  }

  get direction(): number {
    return this._direction
  }

  set direction(d: number) {
    this._direction = d
  }

  get directionX(): number {
    return this._directionX
  }

  set directionX(dx: number) {
    this._directionX = dx
  }

  get directionY(): number {
    return this._directionY
  }

  set directionY(dy: number) {
    this._directionY = dy
  }

  get speed(): number {
    return this._speed
  }

  set speed(s: number) {
    this._speed = s
  }

  get maxSpeedForward(): number {
    return this._maxSpeedForward
  }

  set maxSpeedForward(maxsf: number) {
    this._maxSpeedForward = maxsf
  }

  get maxSpeedBackward(): number {
    return this._maxSpeedBackward
  }

  set maxSpeedBackward(maxsb: number) {
    this._maxSpeedBackward = maxsb
  }

  get turnSpeed(): number {
    return this._turnSpeed
  }

  set turnSpeed(ts: number) {
    this._turnSpeed = ts
  }

  get team(): ITeam {
    if (!this._team) throw new Error('Team must be assigned!')
    return this._team
  }

  set team(t: ITeam | null) {
    this._team = t
  }

  get score(): number {
    return this._score
  }

  set score(s: number) {
    this._score = s
  }

  get state(): PlayerState {
    return this._state
  }

  set state(state: PlayerState) {
    this._state = state
  }
}
