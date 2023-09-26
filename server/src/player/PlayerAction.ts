import { IField, IGates, IPlayerAction, IPlayerModel, ITeam } from 'api'
import { IPlayerController } from './movement/IPlayerController'
import { SoccerPlayerController } from './movement/SoccerPlayerController'

export class PlayerAction implements IPlayerAction {
  private controller: IPlayerController = new SoccerPlayerController(
    this.player
  )

  constructor(private readonly player: IPlayerModel) {}

  onUp(): void {
    this.controller.onUp()
  }

  onDown(): void {
    this.controller.onDown()
  }

  onLeft(): void {
    this.controller.onLeft()
  }

  onRight(): void {
    this.controller.onRight()
  }

  update(deltaTime: number) {
    this.controller.update(deltaTime)
  }

  scorePoint(): void {
    this.player.score++
    if (this.player.team) this.player.team.score++
  }

  assignToTeam(teams: ITeam[]) {
    const teamA = teams[0]
    const teamB = teams[1]
    const selectedTeam =
      teamA.playerIds.length <= teamB.playerIds.length ? teamA : teamB
    this.player.team = selectedTeam
    selectedTeam.playerIds.push(this.player.id)
  }

  positionInLine(teams: ITeam[], gates: IGates, field: IField) {
    if (!this.player.team) throw 'player team must be specified at this point!'
    const playerTeamGoalPost =
      this.player.team === teams[0] ? gates.left : gates.right
    this.player.x = (field.width / 2 + playerTeamGoalPost.x) / 2
    this.player.direction = playerTeamGoalPost.x < field.width / 2 ? 0 : Math.PI
    const playerSpacing = 4 * this.player.radius
    const canvasCenterY = field.height / 2
    const numPlayers = this.player.team.playerIds.length
    const playerIndex = this.player.team.playerIds.indexOf(this.player.id) + 1
    this.player.y = canvasCenterY
    if (numPlayers > 1) {
      if (playerIndex % 2 === 0) {
        this.player.y -= (playerIndex / 2) * playerSpacing
      } else {
        this.player.y += Math.floor(playerIndex / 2) * playerSpacing
      }
    }
  }

  resetAfterGoal() {
    this.player.velocityX = 0
    this.player.velocityY = 0
    this.player.speed = 0
  }

  resetAfterMatch() {
    this.resetAfterGoal()
    this.player.score = 0
    this.player.team = null
  }
}
