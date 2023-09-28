import { IInput } from '../api/IInput'
import { ISocketOutManager } from '../socket/ISocketOutManager'

export class InputHandler {
  private input: IInput = {
    up: false,
    down: false,
    left: false,
    right: false,
  }

  constructor(private readonly socketOutManager: ISocketOutManager) {
    document.addEventListener('keydown', this.handleKeyDown.bind(this))
    document.addEventListener('keyup', this.handleKeyUp.bind(this))
  }

  private handleKeyDown(event: KeyboardEvent) {
    this.setKeyState(event.key, true)
  }

  private handleKeyUp(event: KeyboardEvent) {
    this.setKeyState(event.key, false)
  }

  private setKeyState(key: string, state: boolean) {
    switch (key) {
      case 'ArrowUp':
        this.input.up = state
        break
      case 'ArrowDown':
        this.input.down = state
        break
      case 'ArrowLeft':
        this.input.left = state
        break
      case 'ArrowRight':
        this.input.right = state
        break
    }
    this.socketOutManager.sendPlayerInput(this.input)
  }

  public getInput(): IInput {
    return this.input
  }
}
