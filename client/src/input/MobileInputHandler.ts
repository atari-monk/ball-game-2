import { IInput, ISocketOutManager } from 'client-api'

export class MobileInputHandler {
  private input: IInput = {
    up: false,
    down: false,
    left: false,
    right: false,
  }

  private playerX: number = 0 // Initial player X position
  private playerY: number = 0 // Initial player Y position

  constructor(private readonly socketOutManager: ISocketOutManager) {
    // Add touch event listeners to handle mobile input
    document.addEventListener('touchstart', this.handleTouchStart.bind(this), {
      passive: false,
    })
    document.addEventListener('touchend', this.handleTouchEnd.bind(this), {
      passive: false,
    })
  }

  // Method to set the player's position
  public setPlayerPosition(x: number, y: number) {
    this.playerX = x
    this.playerY = y
  }

  private handleTouchStart(event: TouchEvent) {
    event.preventDefault() // Prevent default touch behavior (e.g., scrolling)
    const touch = event.touches[0]

    // Calculate the touch position relative to the player's position
    const relativeX = touch.clientX - this.playerX
    const relativeY = touch.clientY - this.playerY

    console.log('playerX', this.playerX)
    console.log('playerY', this.playerY)
    console.log('touch.clientX', touch.clientX)
    console.log('touch.clientY', touch.clientY)
    console.log('relativeX', relativeX)
    console.log('relativeY', relativeY)

    if (relativeX > 0 && Math.abs(relativeY) < 21) {
      // Moving right when relativeX is positive and |relativeY| is less than 21
      this.input.right = true
    }

    if (
      relativeX > 0 &&
      relativeY < 0 &&
      Math.abs(Math.abs(relativeX) - Math.abs(relativeY)) < 31
    ) {
      // Moving right when relativeX is positive and |relativeY| is less than 21
      this.input.right = true
      this.input.up = true
    }

    if (relativeX < 0 && Math.abs(relativeY) < 21) {
      // Moving right when relativeX is positive and |relativeY| is less than 21
      this.input.left = true
    }

    if (
      relativeX < 0 &&
      relativeY < 0 &&
      Math.abs(Math.abs(relativeX) - Math.abs(relativeY)) < 31
    ) {
      // Moving right when relativeX is positive and |relativeY| is less than 21
      this.input.left = true
      this.input.up = true
    }

    if (relativeY < 0 && Math.abs(relativeX) < 21) {
      // Moving right when relativeX is positive and |relativeY| is less than 21
      this.input.up = true
    }

    if (
      relativeX < 0 &&
      relativeY > 0 &&
      Math.abs(Math.abs(relativeX) - Math.abs(relativeY)) < 31
    ) {
      // Moving right when relativeX is positive and |relativeY| is less than 21
      this.input.left = true
      this.input.down = true
    }

    if (relativeY > 0 && Math.abs(relativeX) < 21) {
      // Moving right when relativeX is positive and |relativeY| is less than 21
      this.input.down = true
    }

    if (
      relativeX > 0 &&
      relativeY > 0 &&
      Math.abs(Math.abs(relativeX) - Math.abs(relativeY)) < 31
    ) {
      // Moving right when relativeX is positive and |relativeY| is less than 21
      this.input.right = true
      this.input.down = true
    }

    // Send the initial input state to the socket manager
    this.socketOutManager.sendPlayerInput(this.input)
  }

  private handleTouchEnd(event: TouchEvent) {
    event.preventDefault() // Prevent default touch behavior (e.g., zooming)

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
