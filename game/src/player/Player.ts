import { INameGenerator, IPlayer } from 'game-api'
import { PlayerState } from './PlayerState'

export class Player extends PlayerState implements IPlayer {
  constructor(id: string, nameGenerator: INameGenerator) {
    super(id, nameGenerator)
  }
}
