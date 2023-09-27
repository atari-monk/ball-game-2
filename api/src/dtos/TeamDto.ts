import { ITeam } from '../api/ITeam'

export class TeamDto {
  name: string
  color: string
  playerIds: string[]
  score: number

  constructor(team: ITeam) {
    this.name = team.name
    this.color = team.color
    this.playerIds = team.playerIds
    this.score = team.score
  }
}
