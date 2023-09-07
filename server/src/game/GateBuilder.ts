import { Gate } from './Gate'
import { IGate } from './IGate'
import { ITeam } from './ITeam'

export class GateBuilder {
  private x = 0
  private y = 0
  private width = 0
  private height = 0
  private team?: ITeam

  withPosition(x: number, y: number): GateBuilder {
    this.x = x
    this.y = y
    return this
  }

  withWidth(width: number): GateBuilder {
    this.width = width
    return this
  }

  withHeight(height: number): GateBuilder {
    this.height = height
    return this
  }

  withTeam(team: ITeam): GateBuilder {
    this.team = team
    return this
  }

  build(): IGate {
    if (!this.team) throw new Error('Team needs to be speciffied!')
    return Gate.create(this.x, this.y, this.width, this.height, this.team)
  }
}
