import { IPlayer } from '../api/IPlayer'
import { ITeam } from '../api/ITeam'

export class PlayerDto {
  id: string
  x: number
  y: number
  radius: number
  mass: number
  direction: number
  speed: number
  maxSpeed: number
  team: ITeam | null

  constructor(player: IPlayer) {
    this.id = player.id
    this.x = player.x
    this.y = player.y
    this.radius = player.radius
    this.mass = player.mass
    this.direction = player.direction
    this.speed = player.speed
    this.maxSpeed = player.maxSpeed
    this.team = player.team
  }
}
