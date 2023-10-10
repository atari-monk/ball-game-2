import { IInput, ISocketOutManager } from 'client-api'
import { Vector2 } from '../utils/Vector2'

export class MobileInputHandler {
  private input: IInput = {
    up: false,
    down: false,
    left: false,
    right: false,
  }

  private playerPosition: Vector2
  private isTouching: boolean = false
  private smoothedDirection: Vector2 = new Vector2(0, 0)
  private dampingFactor: number = 0.9

  constructor(private readonly socketOutManager: ISocketOutManager) {
    // Add touch event listeners to handle mobile input
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

  // Method to set the player's position
  public setPlayerPosition(x: number, y: number) {
    this.playerPosition.x = x
    this.playerPosition.y = y
  }

  private determineDirection(directionVector: Vector2): void {
    this.input.up = false
    this.input.down = false
    this.input.left = false
    this.input.right = false

    const threshold = 0.3 // Adjust this threshold for sensitivity

    if (directionVector.x > threshold) {
      this.input.right = true
    } else if (directionVector.x < -threshold) {
      this.input.left = true
    }

    if (directionVector.y > threshold) {
      this.input.down = true
    } else if (directionVector.y < -threshold) {
      this.input.up = true
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

    this.socketOutManager.sendPlayerInput(this.input)
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

    this.socketOutManager.sendPlayerInput(this.input)
  }

  private handleTouchEnd(event: TouchEvent) {
    event.preventDefault() // Prevent default touch behavior (e.g., zooming)
    this.isTouching = false

    // Reset all input directions to stop the player's movement
    this.input.up = false
    this.input.down = false
    this.input.left = false
    this.input.right = false

    // Send the updated input state to the socket manager
    this.socketOutManager.sendPlayerInput(this.input)
  }

  public getInput(): IInput {
    return this.input
  }
}
