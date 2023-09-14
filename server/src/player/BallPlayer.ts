import { IField, IGates, IPlayer, IPlayerBehavior, ITeam } from 'api'

export class BallPlayer implements IPlayerBehavior {
  constructor(private readonly player: IPlayer) {}

  public update(deltaTime: number) {
    const speed = this.player.speed
    this.player.velocityX = speed * Math.cos(this.player.direction)
    this.player.velocityY = speed * Math.sin(this.player.direction)

    const displacementX = this.player.velocityX * deltaTime
    const displacementY = this.player.velocityY * deltaTime

    this.player.x += displacementX
    this.player.y += displacementY
  }

  public scorePoint(): void {
    this.player.score++
    if (this.player.team) this.player.team.score++
  }

  public assignToTeam(teams: ITeam[]) {
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
}
