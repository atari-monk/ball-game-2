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
  }

  private handleKeyDown(event: KeyboardEvent) {
    this.input.up = event.key === 'ArrowUp'
    this.input.down = event.key === 'ArrowDown'
    this.input.left = event.key === 'ArrowLeft'
    this.input.right = event.key === 'ArrowRight'
    this.socketOutManager.sendPlayerInput(this.input)
  }

  public getInput(): IInput {
    return this.input
  }
}
