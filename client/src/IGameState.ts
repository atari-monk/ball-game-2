import { IPlayer } from 'api'
import { IGate } from './IGate'
import { IMessage } from './IMessage'

export interface IGameState {
  players: Record<string, IPlayer>
  ball: {
    x: number
    y: number
    radius: number
    mass: number
  }
  field: {
    width: number
    height: number
  }
  gates: {
    left: IGate
    right: IGate
  }
  messages: IMessage[]
}
