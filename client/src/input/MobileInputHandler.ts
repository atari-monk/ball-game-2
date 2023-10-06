import { IInput, ISocketOutManager } from 'client-api'

export class MobileInputHandler {
  private input: IInput = {
    up: false,
    down: false,
    left: false,
    right: false,
  }

  private touchStartX: number | null = null
  private touchStartY: number | null = null

  constructor(private readonly socketOutManager: ISocketOutManager) {
    // Add touch event listeners to handle mobile input
    document.addEventListener('touchstart', this.handleTouchStart.bind(this), {
      passive: false,
    })
    document.addEventListener('touchend', this.handleTouchEnd.bind(this), {
      passive: false,
    })
  }

  private handleTouchStart(event: TouchEvent) {
    event.preventDefault() // Prevent default touch behavior (e.g., scrolling)
    const touch = event.touches[0]
    this.touchStartX = touch.clientX
    this.touchStartY = touch.clientY
  }

  private handleTouchEnd(event: TouchEvent) {
    event.preventDefault() // Prevent default touch behavior (e.g., zooming)
    if (this.touchStartX === null || this.touchStartY === null) {
      return // Touch start data is missing
    }

    const touch = event.changedTouches[0]
    const touchEndX = touch.clientX
    const touchEndY = touch.clientY

    const deltaX = touchEndX - this.touchStartX
    const deltaY = touchEndY - this.touchStartY

    // Reset touch start data
    this.touchStartX = null
    this.touchStartY = null

    // Determine the dominant direction of the swipe
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      this.input.left = deltaX < 0
      this.input.right = deltaX > 0
      this.input.up = false
      this.input.down = false
    } else {
      // Vertical swipe
      this.input.up = deltaY < 0
      this.input.down = deltaY > 0
      this.input.left = false
      this.input.right = false
    }

    // Send the updated input state to the socket manager
    this.socketOutManager.sendPlayerInput(this.input)
  }

  public getInput(): IInput {
    return this.input
  }
}
