import { ITeam } from './ITeam'

export interface IPlayer {
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
  team: ITeam | null
  score: number
  scorePoint(): void
}
