import { Server } from 'socket.io'
import { PlayerBuilder } from './PlayerBuilder'
import { PlayerState } from './PlayerState'
import { INameGenerator } from 'game-api'

export class Player extends PlayerState {
  static getDefaultPlayer(
    io: Server,
    id: string,
    nameGenerator: INameGenerator
  ) {
    const newPlayer = new PlayerBuilder(io)
      .withId(id)
      .withName(nameGenerator.getUniqueFunnySingleWordName())
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
}
