import { IInput, ISocketOutManager } from 'client-api'
import { Vector2 } from '../utils/Vector2'

export class MobileInputHandler {
  private _input: IInput = {
    up: false,
    down: false,
    left: false,
    right: false,
  }
  private playerPosition: Vector2
  private isTouching: boolean = false
  private smoothedDirection: Vector2 = new Vector2(0, 0)
  private dampingFactor: number = 0.9

  get input(): IInput {
    return this._input
  }

  constructor(private readonly socketOutManager: ISocketOutManager) {
    document.addEventListener('touchstart', this.handleTouchStart.bind(this), {
      passive: false,
    })
    document.addEventListener('touchend', this.handleTouchEnd.bind(this), {
      passive: false,
    })
    document.addEventListener('touchmove', this.handleTouchMove.bind(this), {
      passive: false,
    })
    this.playerPosition = new Vector2(0, 0)
  }

  setPlayerPosition(x: number, y: number) {
    this.playerPosition.x = x
    this.playerPosition.y = y
  }

  private determineDirection(directionVector: Vector2): void {
    this._input.up = false
    this._input.down = false
    this._input.left = false
    this._input.right = false

    const threshold = 0.3

    if (directionVector.x > threshold) {
      this._input.right = true
    } else if (directionVector.x < -threshold) {
      this._input.left = true
    }

    if (directionVector.y > threshold) {
      this._input.down = true
    } else if (directionVector.y < -threshold) {
      this._input.up = true
    }
  }

  private handleTouchStart(event: TouchEvent): void {
    event.preventDefault()
    this.isTouching = true

    const touch = event.touches[0]
    const touchPosition = new Vector2(touch.clientX, touch.clientY)
    const directionVector = touchPosition
      .subtract(this.playerPosition)
      .normalize()

    this.determineDirection(directionVector)

    this.socketOutManager.sendPlayerInput(this._input)
  }

  private handleTouchMove(event: TouchEvent): void {
    if (!this.isTouching) return

    event.preventDefault()

    const touch = event.touches[0]
    const touchPosition = new Vector2(touch.clientX, touch.clientY)
    const directionVector = touchPosition
      .subtract(this.playerPosition)
      .normalize()

    this.smoothedDirection = this.smoothedDirection.add(
      directionVector
        .subtract(this.smoothedDirection)
        .multiply(this.dampingFactor)
    )

    this.determineDirection(this.smoothedDirection)

    this.socketOutManager.sendPlayerInput(this._input)
  }

  private handleTouchEnd(event: TouchEvent) {
    event.preventDefault()
    this.isTouching = false

    this._input.up = false
    this._input.down = false
    this._input.left = false
    this._input.right = false

    this.socketOutManager.sendPlayerInput(this._input)
  }
}
