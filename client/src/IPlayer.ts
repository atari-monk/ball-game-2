import { ITeam } from './ITeam'

export interface IPlayer {
  id: string
  x: number
  y: number
  radius: number
  mass: number
  direction: number
  speed: number
  maxSpeed: number
  team: ITeam | null
}
