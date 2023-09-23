export class AnimationLoop {
  private animationRequestId: number | null = null
  private callback: (timeElapsed: number) => void
  private lastFrameTime: number | null = null

  constructor(callback: (timeElapsed: number) => void) {
    this.callback = callback
  }

  start() {
    const updateAndRender = (timestamp: number) => {
      if (this.lastFrameTime === null) {
        this.lastFrameTime = timestamp
      }

      const timeElapsed = timestamp - this.lastFrameTime
      this.lastFrameTime = timestamp

      this.callback(timeElapsed)

      // Request the next frame of the animation.
      this.animationRequestId = requestAnimationFrame(updateAndRender)
    }

    // Start the animation loop.
    this.animationRequestId = requestAnimationFrame(updateAndRender)
  }

  stop() {
    // Cancel the animation loop when needed.
    if (this.animationRequestId !== null) {
      cancelAnimationFrame(this.animationRequestId)
      this.animationRequestId = null
      this.lastFrameTime = null
    }
  }
}
