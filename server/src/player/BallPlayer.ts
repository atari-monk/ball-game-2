import { IPlayer, IPlayerBehavior, ITeam } from 'api'

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
}
