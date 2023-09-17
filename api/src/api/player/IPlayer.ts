import { ITeam } from '../ITeam'
import { IPlayerAction } from './IPlayerAction'

export interface IPlayer extends IPlayerAction {
  id: string
  name: string
  x: number
  y: number
  velocityX: number
  velocityY: number
  radius: number
  mass: number
  direction: number
  speed: number
  maxSpeedForward: number
  maxSpeedBackward: number
  turnSpeed: number
  team: ITeam
}
