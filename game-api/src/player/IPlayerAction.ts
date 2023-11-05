import { IField } from '../IField'
import { IGates } from '../IGates'
import { ITeam } from '../ITeam'
import { IUpdate } from '../game_object/IUpdate'

export interface IPlayerAction extends IUpdate {
  scorePoint(): void
  assignToTeam(teams: ITeam[]): void
  positionInLine(teams: ITeam[], gates: IGates, field: IField): void
  resetAfterGoal(): void
  resetAfterMatch(): void
}
