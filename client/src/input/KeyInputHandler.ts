import { IKeyInput, ISocketOutManager } from 'client-api'

export class KeyInputHandler {
  private keyInput: IKeyInput = {
    H: false,
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
      case 'h':
      case 'H':
        this.keyInput.H = state
        break
    }
    this.socketOutManager.sendKeyInput(this.keyInput)
  }

  public getKeyInput(): IKeyInput {
    return this.keyInput
  }
}
