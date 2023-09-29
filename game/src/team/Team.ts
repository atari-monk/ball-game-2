import { ITeam } from 'api'
import { TeamBuilder } from './TeamBuilder'

export class Team implements ITeam {
  constructor(
    public name: string,
    public color: string,
    public playerIds: string[],
    public score: number
  ) {}

  static builder(): TeamBuilder {
    return new TeamBuilder()
  }

  static create(
    name: string,
    color: string,
    playerIds: string[],
    score: number
  ): ITeam {
    return new Team(name, color, playerIds, score)
  }
}
