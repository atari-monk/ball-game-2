import { Server } from 'socket.io'
import { INameGenerator, IPlayer } from 'game-api'
import { PlayerState } from './PlayerState'

export class Player extends PlayerState implements IPlayer {
  constructor(id: string, nameGenerator: INameGenerator, io: Server) {
    super(id, nameGenerator, io)
  }
}
