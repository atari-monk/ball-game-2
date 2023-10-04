import { IField } from '../IField'
import { IGates } from '../IGates'
import { ITeam } from '../ITeam'

export interface IPlayerAction {
  scorePoint(): void
  assignToTeam(teams: ITeam[]): void
  positionInLine(teams: ITeam[], gates: IGates, field: IField): void
  resetAfterGoal(): void
  resetAfterMatch(): void
}
