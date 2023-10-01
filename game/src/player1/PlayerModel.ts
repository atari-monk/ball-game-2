import { INameGenerator, IPlayerModel, ITeam, PlayerState } from 'game-api'
import { PlayerBuilder } from './PlayerBuilder'

export class PlayerModel implements IPlayerModel {
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
    public directionX: number,
    public directionY: number,
    public speed: number,
    public maxSpeedForward: number,
    public maxSpeedBackward: number,
    public turnSpeed: number,
    public team: ITeam | null,
    public score: number,
    public state: PlayerState
  ) {}

  static getDefaultPlayer(id: string, nameGenerator: INameGenerator) {
    const newPlayer = PlayerModel.builder(
      id,
      nameGenerator.getUniqueFunnySingleWordName()
    )
      .withPosition(0, 0)
      .withVelocity(0, 0)
      .withRadius(20)
      .withCollisionDisabled(false)
      .withMass(20)
      .withDirection(0)
      .withSpeed(0)
      .withMaxSpeedForward(0.1)
      .withMaxSpeedBackward(-0.05)
      .withTurnSpeed(0.4)
      .withTeam(null)
      .withScore(0)
      .build()
    return newPlayer
  }

  static builder(id: string, name: string): PlayerBuilder {
    return new PlayerBuilder(id, name)
  }

  static create(
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
    directionX: number,
    directionY: number,
    speed: number,
    maxSpeedForward: number,
    maxSpeedBackward: number,
    turnSpeed: number,
    team: ITeam | null,
    score: number,
    state: PlayerState
  ): IPlayerModel {
    return new PlayerModel(
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
      directionX,
      directionY,
      speed,
      maxSpeedForward,
      maxSpeedBackward,
      turnSpeed,
      team,
      score,
      state
    )
  }
}
