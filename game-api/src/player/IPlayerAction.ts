import { IField } from '../IField'
import { IGates } from '../IGates'
import { ITeam } from '../ITeam'

export interface IPlayerAction {
  scorePoint(): void
  update(deltaTime: number): void
  assignToTeam(teams: ITeam[]): void
  positionInLine(teams: ITeam[], gates: IGates, field: IField): void
  resetAfterGoal(): void
  resetAfterMatch(): void
  onUp(): void
  onDown(): void
  onLeft(): void
  onRight(): void
  onInactive(): void
}
