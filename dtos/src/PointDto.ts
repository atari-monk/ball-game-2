import { Team } from 'shared-api'

export class PointDto {
  team: Team

  constructor(team: Team) {
    this.team = team
  }
}
