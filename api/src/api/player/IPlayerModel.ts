import { ITeam } from '../ITeam'

export interface IPlayerModel {
  id: string
  name: string
  x: number
  y: number
  velocityX: number
  velocityY: number
  radius: number
  collisionDisabled: boolean
  mass: number
  direction: number
  speed: number
  maxSpeedForward: number
  maxSpeedBackward: number
  turnSpeed: number
  team: ITeam | null
  score: number
}
