import { IGate } from '../api/IGate'
import { ITeam } from '../api/ITeam'

export class GateDto {
  x: number
  y: number
  width: number
  height: number
  team: ITeam

  constructor(gate: IGate) {
    this.x = gate.x
    this.y = gate.y
    this.width = gate.width
    this.height = gate.height
    this.team = gate.team
  }
}
