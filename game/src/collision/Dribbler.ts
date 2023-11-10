import { IBall, IPlayer } from 'game-api'
//import { Vector2 } from '../utils/Vector2'

export class Dribbler {
  private sumRadiiSquared: number = 0
  //private dr: Vector2
  private timers: { [playerId: string]: number } = {}

  constructor() {
    //this.dr = new Vector2(0, 0)
  }

  init(players: IPlayer[], ball: IBall) {
    const rp = players[0].radius + 0.2 * players[0].radius
    const rb = ball.radius + 0.2 * ball.radius
    this.sumRadiiSquared = (rp + rb) ** 2
  }

  dribble(players: IPlayer[], ball: IBall, dt: number) {
    for (const player of players) {
      const distanceSquared = this.getDistanceSquared(ball, player)
      const playerId = player.id
      const playerTimer = this.timers[playerId] || 0

      if (distanceSquared < this.sumRadiiSquared) {
        if (playerTimer >= 1000) {
          //console.log('drible')
          player.ballCollision = false
          this.dribbleAction(player, ball)
        } else {
          this.timers[playerId] = playerTimer + dt
        }
      } else {
        this.timers[playerId] = 0
        player.ballCollision = true
      }
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
