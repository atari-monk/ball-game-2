import { IBall, IPlayer } from 'game-api'

export class Dribbler {
  private sumRadiiSquared: number = 0
  private timers: { [playerId: string]: number } = {}

  init(players: IPlayer[], ball: IBall) {
    const rp = players[0].radius + 0.2 * players[0].radius
    const rb = ball.radius + 0.2 * ball.radius
    this.sumRadiiSquared = (rp + rb) ** 2
  }

  dribble(players: IPlayer[], ball: IBall, dt: number) {
    for (const player of players) {
      if (!player.ballCollision) {
        this.dribbleAction(player, ball)
      }
      const distanceSquared = this.getDistanceSquared(ball, player)
      const playerId = player.id
      const playerTimer = this.timers[playerId] || 0

      if (distanceSquared < this.sumRadiiSquared) {
        if (this.isDribbleOn(players)) {
          this.resetDribble(players)
          console.log('dribble reset')
        }
        if (playerTimer >= 1000) {
          player.ballCollision = false
          console.log('dribble on')
        } else {
          this.timers[playerId] = playerTimer + dt
        }
      } else {
        this.timers[playerId] = 0
        player.ballCollision = true
      }
    }
  }

  private isDribbleOn(players: IPlayer[]) {
    for (const player of players) {
      if (player.ballCollision) return true
    }
    return false
  }

  private resetDribble(players: IPlayer[]) {
    for (const player of players) {
      player.ballCollision = true
    }
  }

  private getDistanceSquared(ball: IBall, player: IPlayer) {
    const x = ball.x - player.x
    const y = ball.y - player.y
    return x ** 2 + y ** 2
  }

  private dribbleAction(player: IPlayer, ball: IBall) {
    ball.x = player.directionX
    ball.y = player.directionY
  }
}
