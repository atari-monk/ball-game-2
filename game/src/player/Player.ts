import { Server } from 'socket.io'
import {
    IField,
    IGates,
  INameGenerator,
  IPlayer,
  IPlayerAction,
  IPlayerModel,
  IPlayerState,
  ITeam,
  PlayerState,
} from 'game-api'
import { PlayerModel } from './PlayerModel'
import { IdleState } from './state/IdleState'
import { PlayerAction } from './PlayerAction'

export class Player implements IPlayer {
  protected readonly _model: IPlayerModel
  private readonly _action: IPlayerAction
  private currentState: IPlayerState

  constructor(id: string, nameGenerator: INameGenerator, io: Server) {
    this._model = PlayerModel.getDefaultPlayer(id, nameGenerator)
    this._action = new PlayerAction(this._model)
    this.currentState = new IdleState(this, io)
    this.currentState.enter()
  }

  setState(newState: IPlayerState): void {
    this.currentState.exit()
    this.currentState = newState
    this.currentState.enter()
  }

  public get id(): string {
    return this._model.id
  }

  public get name(): string {
    return this._model.name
  }

  public get x(): number {
    return this._model.x
  }

  public get y(): number {
    return this._model.y
  }

  public get velocityX(): number {
    return this._model.velocityX
  }

  public get velocityY(): number {
    return this._model.velocityY
  }

  public get radius(): number {
    return this._model.radius
  }

  public get mass(): number {
    return this._model.mass
  }

  public get direction(): number {
    return this._model.direction
  }

  public get directionX(): number {
    return this._model.directionX
  }

  public get directionY(): number {
    return this._model.directionY
  }

  public get speed(): number {
    return this._model.speed
  }

  public get maxSpeedForward(): number {
    return this._model.maxSpeedForward
  }

  public get maxSpeedBackward(): number {
    return this._model.maxSpeedBackward
  }

  public get turnSpeed(): number {
    return this._model.turnSpeed
  }

  public get team(): ITeam {
    const team = this._model.team
    if (!team) throw new Error('Team must be assigned!')
    return team
  }

  public get state(): PlayerState {
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

  set state(state: PlayerState) {
    this._model.state = state
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
