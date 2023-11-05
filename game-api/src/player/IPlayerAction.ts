import { IField } from '../IField'
import { IGates } from '../IGates'
import { ITeam } from '../ITeam'

export interface IPlayerAction {
  update(deltaTime: number): void
  scorePoint(): void
  assignToTeam(teams: ITeam[]): void
  positionInLine(teams: ITeam[], gates: IGates, field: IField): void
  resetAfterGoal(): void
  resetAfterMatch(): void
}
