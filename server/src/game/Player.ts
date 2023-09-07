import { Team } from './Game'

export interface Player {
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
  maxSpeed: number
  team: Team | null
  score: number
  scorePoint(): void
}
