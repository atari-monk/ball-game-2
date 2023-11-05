import { BallState } from 'shared-api'
import { IPlayer } from '../player/IPlayer'

export interface IBallModel {
  x: number
  y: number
  velocityX: number
  velocityY: number
  radius: number
  mass: number

  lastHit: IPlayer | null

  state: BallState
}
