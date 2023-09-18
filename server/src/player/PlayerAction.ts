import { IField, IGates, IPlayerAction, IPlayerModel, ITeam } from 'api'

export class PlayerAction implements IPlayerAction {
  private readonly speedLevel1: number

  constructor(private readonly player: IPlayerModel) {
    this.speedLevel1 = player.maxSpeedForward / 2
  }

  update(deltaTime: number) {
    const p = this.player
    this.computeDirection(p)
    this.computeVelocity(p)
    this.computePosition(p, deltaTime)
  }

  private computeDirection(p: IPlayerModel) {
    p.directionX = p.x + p.radius * Math.cos(p.direction)
    p.directionY = p.y + p.radius * Math.sin(p.direction)
  }

  private computeVelocity(p: IPlayerModel) {
    p.velocityX = p.speed * Math.cos(p.direction)
    p.velocityY = p.speed * Math.sin(p.direction)
  }

  private computePosition(p: IPlayerModel, deltaTime: number) {
    p.x += p.velocityX * deltaTime
    p.y += p.velocityY * deltaTime
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

  onUp() {
    const p = this.player
    p.speed = Math.min(p.speed + this.speedLevel1, p.maxSpeedForward)
  }

  onDown(): void {
    const p = this.player
    if (p.speed > 0) {
      p.speed = 0
    } else if (p.speed === 0) {
      p.speed = p.maxSpeedBackward
    }
  }

  onLeft(): void {
    const p = this.player
    p.direction -= p.turnSpeed
  }

  onRight(): void {
    const p = this.player
    p.direction += p.turnSpeed
  }
}
