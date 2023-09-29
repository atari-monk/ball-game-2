import {
  IField,
  IGates,
  INameGenerator,
  IPlayer,
  IPlayerAction,
  IPlayerModel,
  ITeam,
  PlayerState,
} from 'api'
import { PlayerModel } from './PlayerModel'
import { PlayerAction } from './PlayerAction'

export class Player implements IPlayer {
  private readonly _model: IPlayerModel
  private readonly _action: IPlayerAction

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

  set velocityX(vx: number) {
    this._model.velocityX = vx
  }

  set velocityY(vy: number) {
    this._model.velocityY = vy
  }

  set direction(d: number) {
    this._model.direction = d
  }

  set x(x: number) {
    this._model.x = x
  }

  set y(y: number) {
    this._model.y = y
  }

  constructor(id: string, nameGenerator: INameGenerator) {
    this._model = PlayerModel.getDefaultPlayer(id, nameGenerator)
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
