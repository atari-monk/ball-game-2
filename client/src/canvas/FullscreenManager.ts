export class FullscreenManager {
  private element: HTMLElement

  constructor(element: HTMLElement) {
    this.element = element
  }

  enterFullscreen() {
    if (!document.fullscreenEnabled) {
      console.error('Fullscreen mode is not supported in this browser.')
      return
    }

    if (this.element instanceof HTMLElement) {
      if (this.element.requestFullscreen) {
        this.element.requestFullscreen().catch((error: Error) => {
          console.error('Error entering fullscreen mode:', error)
        })
      } else {
        console.error('Fullscreen mode is not supported on this element.')
      }
    } else {
      console.error('Invalid element provided.')
    }
  }

  toggleFullscreen() {
    if (document.fullscreenElement === this.element) {
      // If the element is already in fullscreen, exit fullscreen.
      document.exitFullscreen()
    } else {
      // If the element is not in fullscreen, enter fullscreen.
      this.enterFullscreen()
    }
  }
}
