import { ISocketOutManager } from 'client-api'
import { InputHandler } from './InputHandler'
import { MobileInputHandler } from './MobileInputHandler'
import { StaticJoystick } from './StaticJoystick'
import { IInputConfig } from './IInputConfig'

export class InputManager {
  private _keyboradInput: InputHandler | null = null
  private _mobileInputHandler: MobileInputHandler | null = null
  private _joysticFactory: StaticJoystick | null = null
  private _config: IInputConfig

  get mobileInputHandler() {
    return this._mobileInputHandler
  }

  get config() {
    return this._config
  }

  constructor(
    private readonly socketOutManager: ISocketOutManager,
    config: IInputConfig = {
      isKeyboard: true,
      isMobileInput: false,
      isJoystic: true,
    }
  ) {
    this._config = config
    if (this._config.isKeyboard)
      this._keyboradInput = new InputHandler(this.socketOutManager)
    if (this._config.isMobileInput)
      this._mobileInputHandler = new MobileInputHandler(this.socketOutManager)
    if (this._config.isJoystic) {
      this._joysticFactory = this.createJoystic()
    }
  }

  private createJoystic(): StaticJoystick | null {
    const staticZone = document.querySelector('.joystick_static') as HTMLElement
    if (!staticZone) throw new Error('No element with class joystick_static!')
    return new StaticJoystick(
      staticZone,
      { left: '50%', top: '85%' },
      'white',
      this.socketOutManager
    )
  }
}
