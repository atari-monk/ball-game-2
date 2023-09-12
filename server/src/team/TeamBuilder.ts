import { ITeam } from 'api'
import { Team } from './Team'

export class TeamBuilder {
  private playerIds: string[] = []
  private name: string = ''
  private color: string = ''
  private score: number = 0

  constructor() {}

  withName(name: string): TeamBuilder {
    this.name = name
    return this
  }

  withColor(color: string): TeamBuilder {
    this.color = color
    return this
  }

  withScore(score: number): TeamBuilder {
    this.score = score
    return this
  }

  build(): ITeam {
    return Team.create(this.name, this.color, this.playerIds, this.score)
  }
}
