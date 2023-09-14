import {
  IField,
  IGates,
  INameGenerator,
  IPlayer,
  ITeam,
} from 'api'
import { PlayerBuilder } from './PlayerBuilder'
import { BallPlayer } from './BallPlayer'

export class Player implements IPlayer {
  private behaviors: BallPlayer

  private constructor(
    public id: string,
    public name: string,
    public x: number,
    public y: number,
    public velocityX: number,
    public velocityY: number,
    public radius: number,
    public collisionDisabled: boolean,
    public mass: number,
    public direction: number,
    public speed: number,
    public maxSpeedForward: number,
    public maxSpeedBackward: number,
    public turnSpeed: number,
    public team: ITeam | null,
    public score: number
  ) {
    this.behaviors = new BallPlayer(this)
  }

  static builder(id: string, name: string): PlayerBuilder {
    return new PlayerBuilder(id, name)
  }

  public static create(
    id: string,
    name: string,
    x: number,
    y: number,
    velocityX: number,
    velocityY: number,
    radius: number,
    collisionDisabled: boolean,
    mass: number,
    direction: number,
    speed: number,
    maxSpeedForward: number,
    maxSpeedBackward: number,
    turnSpeed: number,
    team: ITeam | null,
    score: number
  ): IPlayer {
    return new Player(
      id,
      name,
      x,
      y,
      velocityX,
      velocityY,
      radius,
      collisionDisabled,
      mass,
      direction,
      speed,
      maxSpeedForward,
      maxSpeedBackward,
      turnSpeed,
      team,
      score
    )
  }

  public static getDefaultPlayer(
    id: string,
    nameGenerator: INameGenerator
  ): IPlayer {
    return BallPlayer.getDefaultPlayer(id, nameGenerator)
  }

  public update(deltaTime: number) {
    this.behaviors.update(deltaTime)
  }

  public scorePoint(): void {
    this.behaviors.scorePoint()
  }

  public assignToTeam(teams: ITeam[]) {
    this.behaviors.assignToTeam(teams)
  }

  public positionInLine(teams: ITeam[], gates: IGates, field: IField) {
    this.behaviors.positionInLine(teams, gates, field)
  }
}
