import { ITeam } from '../ITeam'
import { PlayerState } from './state/PlayerState'

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
  team: ITeam | null
  score: number
  state: PlayerState
}
