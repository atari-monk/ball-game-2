import { IBall, IGates } from 'api'
import { Game } from '../game/Game'

export class BallGateCollider {
  checkGateCollision(ball: IBall, gates: IGates, game: Game) {
    this.checkLeftGate(ball, gates, game)
    this.checkRightGate(ball, gates, game)
  }

  private checkLeftGate(ball: IBall, gates: IGates, game: Game) {
    if (
      ball.x >= gates.left.x &&
      ball.x <= gates.left.x + gates.left.width &&
      ball.y >= gates.left.y &&
      ball.y <= gates.left.y + gates.left.height
    ) {
      this.handleLeftCollision(ball, gates, game)
    }
  }

  private handleLeftCollision(ball: IBall, gates: IGates, game: Game) {
    if (ball.lastHit && ball.lastHit.team?.name !== gates.left.team.name) {
      game.pointScored()
    }
  }

  private checkRightGate(ball: IBall, gates: IGates, game: Game) {
    if (
      ball.x >= gates.right.x &&
      ball.x <= gates.right.x + gates.right.width &&
      ball.y >= gates.right.y &&
      ball.y <= gates.right.y + gates.right.height
    ) {
      this.handleRightCollision(ball, gates, game)
    }
  }

  private handleRightCollision(ball: IBall, gates: IGates, game: Game) {
    if (ball.lastHit && ball.lastHit.team?.name !== gates.right.team.name) {
      game.pointScored()
    }
  }
}
