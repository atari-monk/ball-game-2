import { Server } from 'socket.io'
import { IPlayer, IBall, ITeam, IField, IGates } from 'game-api'
import { NameGenerator } from '../utils/NameGenerator'

export interface IGameData {
  field: IField
  teams: ITeam[]
  gates: IGates
  ball: IBall
  players: IPlayer[]

  getPlayer(id: string, io: Server, nameGenerator: NameGenerator): IPlayer
}
