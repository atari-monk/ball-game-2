import { ITeam } from './ITeam'

export interface IPlayerBehavior {
  scorePoint(): void
  update(deltaTime: number): void
  assignToTeam(teams: ITeam[]): void
}
