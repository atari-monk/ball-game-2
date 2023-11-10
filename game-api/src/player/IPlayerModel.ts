import { PlayerState } from 'shared-api'
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
  directionX: number
  directionY: number
  speed: number
  maxSpeedForward: number
  maxSpeedBackward: number
  turnSpeed: number
  score: number
  ballCollision: boolean

  team: ITeam | null

  state: PlayerState
}
