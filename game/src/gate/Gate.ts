import { IGate, ITeam } from 'game-api'

export class Gate implements IGate {
  private constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number,
    public team: ITeam
  ) {}

  static create(
    x: number,
    y: number,
    width: number,
    height: number,
    team: ITeam
  ): IGate {
    return new Gate(x, y, width, height, team)
  }
}
