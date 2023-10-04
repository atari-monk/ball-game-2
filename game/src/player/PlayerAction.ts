import { IField, IGates, IPlayerAction, ITeam } from 'game-api'
import { PlayerModel } from './PlayerModel'

export class PlayerAction extends PlayerModel implements IPlayerAction {
  scorePoint(): void {
    this.score++
    if (this.team) this.team.score++
  }

  assignToTeam(teams: ITeam[]) {
    const teamA = teams[0]
    const teamB = teams[1]
    const selectedTeam =
      teamA.playerIds.length <= teamB.playerIds.length ? teamA : teamB
    this.team = selectedTeam
    selectedTeam.playerIds.push(this.id)
  }

  positionInLine(teams: ITeam[], gates: IGates, field: IField) {
    if (!this.team) throw 'player team must be specified at this point!'
    const playerTeamGoalPost = this.team === teams[0] ? gates.left : gates.right
    this.x = (field.width / 2 + playerTeamGoalPost.x) / 2
    this.direction = playerTeamGoalPost.x < field.width / 2 ? 0 : Math.PI
    const playerSpacing = 4 * this.radius
    const canvasCenterY = field.height / 2
    const numPlayers = this.team.playerIds.length
    const playerIndex = this.team.playerIds.indexOf(this.id) + 1
    this.y = canvasCenterY
    if (numPlayers > 1) {
      if (playerIndex % 2 === 0) {
        this.y -= (playerIndex / 2) * playerSpacing
      } else {
        this.y += Math.floor(playerIndex / 2) * playerSpacing
      }
    }
  }

  resetAfterGoal() {
    this.velocityX = 0
    this.velocityY = 0
    this.speed = 0
  }

  resetAfterMatch() {
    this.resetAfterGoal()
    this.score = 0
    this.team = null
  }
}
