import { IField } from './IField'
import { IGates } from './IGates'
import { ITeam } from './ITeam'

export interface IPlayerBehavior {
  scorePoint(): void
  update(deltaTime: number): void
  assignToTeam(teams: ITeam[]): void
  positionInLine(teams: ITeam[], gates: IGates, field: IField): void
}
