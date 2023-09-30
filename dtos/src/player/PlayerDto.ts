export class PlayerDto {
  id: string
  x: number
  y: number
  radius: number
  directionX: number
  directionY: number

  constructor(
    id: string,
    x: number,
    y: number,
    radius: number,
    directionX: number,
    directionY: number
  ) {
    this.id = id
    this.x = x
    this.y = y
    this.radius = radius
    this.directionX = directionX
    this.directionY = directionY
  }
}
