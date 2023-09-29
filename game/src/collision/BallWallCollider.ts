import { IBall, IField } from 'game-api'

export class BallWallCollider {
  checkWallCollisionForBall(ball: IBall, field: IField) {
    this.checkSides(ball, field)
    this.checkFloors(ball, field)
  }

  private checkSides(ball: IBall, field: IField) {
    const newX = ball.x + ball.velocityX

    if (newX - ball.radius < 0 || newX + ball.radius > field.width) {
      ball.velocityX *= -1

      this.preventRecollideX(newX, ball, field)
    }
  }

  private preventRecollideX(newX: number, ball: IBall, field: IField) {
    if (newX - ball.radius < 0) {
      ball.x = ball.radius
    } else {
      ball.x = field.width - ball.radius
    }
  }

  private checkFloors(ball: IBall, field: IField) {
    const newY = ball.y + ball.velocityY
    if (newY - ball.radius < 0 || newY + ball.radius > field.height) {
      ball.velocityY *= -1

      this.preventRecollideY(newY, ball, field)
    }
  }

  private preventRecollideY(newY: number, ball: IBall, field: IField) {
    if (newY - ball.radius < 0) {
      ball.y = ball.radius
    } else {
      ball.y = field.height - ball.radius
    }
  }
}
