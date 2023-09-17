import { IPlayer } from './player/IPlayer'

export interface IBall {
  x: number
  y: number
  velocityX: number
  velocityY: number
  radius: number
  mass: number
  lastHit: IPlayer | null
}
