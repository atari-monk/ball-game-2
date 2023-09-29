import { IPlayer } from "game-api"

export class PlayerDto {
  id: string
  x: number
  y: number
  radius: number
  directionX: number
  directionY: number

  constructor(player: IPlayer) {
    this.id = player.id
    this.x = player.x
    this.y = player.y
    this.radius = player.radius
    this.directionX = player.directionX
    this.directionY = player.directionY
  }
}
