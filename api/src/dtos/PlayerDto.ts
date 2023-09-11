import { IPlayer } from '../api/IPlayer'
import { ITeam } from '../api/ITeam'

export class PlayerDto {
  id: string
  x: number
  y: number
  radius: number
  direction: number
  team: ITeam | null

  constructor(player: IPlayer) {
    this.id = player.id
    this.x = player.x
    this.y = player.y
    this.radius = player.radius
    this.direction = player.direction
    this.team = player.team
  }
}
